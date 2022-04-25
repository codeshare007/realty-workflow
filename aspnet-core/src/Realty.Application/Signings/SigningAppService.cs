using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Immutable;
using Realty.Signings.Dto;
using Realty.Signings.Input;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Abp.Extensions;
using Realty.Authorization.Users;
using Realty.Forms.Dto;
using Abp.Domain.Uow;
using Realty.Transactions;
using Realty.Signings.AccessRequests;
using Abp.Runtime.Session;
using Abp.Timing;
using Realty.Dto;
using Realty.Storage;
using Realty.Contacts.Dto;
using Realty.Forms;
using Realty.Attachments.Dto;
using Realty.Contacts;
using Abp.BackgroundJobs;
using Realty.Forms.Jobs;
using Realty.Signings.Jobs;
using Realty.Forms.Events;

namespace Realty.Signings
{
    [AbpAuthorize(AppPermissions.Pages_Signings)]
    public class SigningAppService : RealtyAppServiceBase, ISigningAppService
    {
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<SigningRequest, Guid> _signingRequestRepository;
        private readonly IRepository<ViewRequest, Guid> _viewRequestRepository;
        private readonly ISigningRequestValidatingFactory _signingRequestValidatingFactory;
        private readonly IFileStorageService _fileStorageService;
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly ISigningEmailService _signingEmailService;
        private readonly SigningBuilder _signingBuilder; 
        private readonly IBackgroundJobManager _jobManager;

        public SigningAppService(
            IRepository<Signing, Guid> signingRepository,
            IRepository<User, long> userRepository,
            IRepository<Transaction, Guid> transactionRepository,
            IRepository<SigningRequest, Guid> signingRequestRepository,
            IRepository<ViewRequest, Guid> viewRequestRepository,
            ISigningRequestValidatingFactory signingRequestValidatingFactory,
            SigningBuilder signingBuilder,
            IFileStorageService fileStorageService,
            ITempFileCacheManager tempFileCacheManager, 
            IBackgroundJobManager jobManager, 
            ISigningEmailService signingEmailService)
        {
            _signingRepository = signingRepository;
            _userRepository = userRepository;
            _transactionRepository = transactionRepository;
            _signingRequestRepository = signingRequestRepository;
            _viewRequestRepository = viewRequestRepository;
            _signingRequestValidatingFactory = signingRequestValidatingFactory;
            _signingBuilder = signingBuilder;
            _fileStorageService = fileStorageService;
            _tempFileCacheManager = tempFileCacheManager;
            _jobManager = jobManager;
            _signingEmailService = signingEmailService;
        }


        [AbpAllowAnonymous]
        public async Task<SigningFormDto> GetForSigningAsync(GetSigningInput input)
        {
            var request = await GetSigningRequest(input.Id);
            Check.NotNull(request, nameof(request));

            return await GetSigningByRequestAsync(request);
        }

        [AbpAllowAnonymous]
        public async Task<SigningFormDto> GetForViewAsync(GetSigningInput input)
        {
            var request = await GetViewRequest(input.Id);
            Check.NotNull(request, nameof(request));

            return await GetSigningByRequestAsync(request);
        }

        [AbpAllowAnonymous]
        public async Task CompleteSigningRequestAsync(CompleteSigningRequestInput input)
        {
            var request = await GetSigningRequest(input.Id);
            Check.NotNull(request, nameof(request));

            using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
            {
                var signing = await _signingRepository.GetAsync(request.SigningId);
                Check.NotNull(signing, nameof(signing));

                signing.SetSigningRequestCompleted(request);
                await _signingRepository.UpdateAsync(signing);
            }
        }

        public async Task<Guid> ResetSigningAsync(ResetSigningInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(signing, nameof(signing));
            var newSigningId = await DuplicateSigningAsync(new DuplicateSigningInput()
            {
                Id = input.Id,
                ForNextSinging = false,
                IsReset = true,
                Name = signing.Name
            });

            await _signingRepository.DeleteAsync(signing);

            return newSigningId;
        }

        [AbpAllowAnonymous]
        public async Task RejectSigningRequestAsync(RejectSigningRequestInput input)
        {
            var request = await GetSigningRequest(input.Id);
            Check.NotNull(request, nameof(request));

            using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
            {
                var signing = await _signingRepository
                    .GetAll()
                    .Include(s => s.Agent)
                    .Where(s => s.Id == request.SigningId)
                    .FirstOrDefaultAsync();

                Check.NotNull(signing, nameof(signing));

                signing.SetSigningRequestRejected(request, input.Comment);
                await _signingRepository.UpdateAsync(signing);

                if (signing.Agent != null)
                {
                    await _signingEmailService.SendSigningRejectedNotificationAsync(signing, request);
                }
            }
        }

        public async Task<SigningSummaryDto> GetSummaryAsync(GetSummaryInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync(); 

            var dto = _signingBuilder.GetSummary(signing);

            return dto;
        }

        public async Task PublishSigningAsync(PublishSigningInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync(); 

            Check.NotNull(signing, nameof(signing));

            _signingBuilder.Publish(signing, input);

            await _signingRepository.UpdateAsync(signing);
        }

        public async Task<Guid?> CreateWithTransactionFormsAsync(CreateWithTransactionFormsInput input)
        {
            Signing signing = null;

            var user = GetCurrentUser();
            var firstFormId = input.Forms.Select(f => f.Id).FirstOrDefault();
            var transaction = await _transactionRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                    l => l.AgentId == user.Id)
                .Include(l => l.Forms).ThenInclude(f => f.Pages).ThenInclude(p => p.Controls)
                .FirstOrDefaultAsync(l => l.Forms.Any(f => f.Id == firstFormId));

            if (transaction != null)
            {
                signing = new Signing(transaction.Name);
                signing.TransactionId = input.Id;
                signing.AgentId = this.AbpSession.GetUserId();

                var formsMapping = new List<KeyValuePair<Form, Form>>();
                foreach (var transactionForm in transaction.Forms.Where(f => input.Forms.Any(i => i.Id == f.Id)))
                {
                    var newForm = signing.CloneForm(transactionForm);
                    formsMapping.Add(new KeyValuePair<Form, Form>(transactionForm, newForm));
                }

                await _signingRepository.InsertAsync(signing);
                await CurrentUnitOfWork.SaveChangesAsync();

                var pmiMapping = new Dictionary<Guid, ParticipantMappingItem>();
                foreach (var pair in formsMapping)
                {
                    if (pair.Key.ParticipantMappingItems.Count > 0)
                    {
                        var items = new List<ParticipantMappingItem>();
                        foreach (var item in pair.Key.ParticipantMappingItems)
                        {
                            var newItem = new ParticipantMappingItem()
                            {
                                Name = item.Name,
                                DisplayOrder = item.DisplayOrder,
                                TenantId = item.TenantId
                            };

                            pmiMapping.Add(item.Id, newItem);
                            items.Add(newItem);
                        }

                        pair.Value.UpdateParticipantMappingItems(items);
                    }
                }

                await CurrentUnitOfWork.SaveChangesAsync();

                foreach (var pair in formsMapping)
                {
                    if (pair.Key.ParticipantMappingItems.Count > 0)
                    {
                        foreach (var page in pair.Value.Pages) 
                        {
                            foreach (var control in page.Controls)
                            {
                                if (control.ParticipantMappingItemId.HasValue) 
                                {
                                    control.SetParticipantMappingItemId(pmiMapping[control.ParticipantMappingItemId.Value].Id);
                                }
                            }
                        }
                    }
                }

                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return signing?.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<PagedResultDto<SigningListDto>> GetAllAsync(GetSigningsInput input)
        {
            var query = GetSignings()
                .WhereIf(input.TransactionId.HasValue, u => u.TransactionId == input.TransactionId)
                .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => u.Name.Contains(input.Filter) || u.Notes.Contains(input.Filter));
            
            var signingCount = await query.CountAsync();

            var signings = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var signingListDto = ObjectMapper.Map<List<SigningListDto>>(signings);
            return new PagedResultDto<SigningListDto>(
                signingCount,
                signingListDto
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Create)]
        public async Task<Guid> CreateAsync(CreateSigningInput input)
        {
            var signing = ObjectMapper.Map<Signing>(input);
            var tenant = await GetCurrentTenantAsync();
            signing.TenantId = tenant.Id;

            if (input.AgentId.HasValue)
            {
                signing.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            signing.SetExpirationSettings(new ExpirationSettings(input.Settings.ExpirationSettings.ExpirationDate));
            signing.SetReminderSettings(new ReminderSettings(input.Settings.ReminderSettings.DispatchingFrequency));

            signing.LastModificationTime = Clock.Now;
            await _signingRepository.InsertAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();
            return signing.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<SigningEditDto> GetForEditAsync(Guid input)
        {
            var form = await GetSignings()
                .Where(s => s.Id == input)
                .FirstOrDefaultAsync();

            var dto = ObjectMapper.Map<SigningEditDto>(form);
            return dto;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<FileDto> DownloadOriginalDocumentAsync(DownloadOriginalDocumentInput input)
        {
            var signing = await GetSignings()
                .Where(a => a.Id == input.Id)
                .Include(t => t.Forms)
                .ThenInclude(a => a.File)
                .FirstAsync();

            var form = signing.Forms.First(a => a.Id == input.Form.Id);

            var file = await _fileStorageService.GetFile(form.File.Id);

            var fileDto = new FileDto(form.File.Name, form.File.ContentType);
            _tempFileCacheManager.SetFile(fileDto.FileToken, file.Item1);

            return fileDto;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<FileDto> DownloadSignedDocumentAsync(DownloadSignedDocumentInput input)
        {
            var signing = await GetSignings()
                .Where(a => a.Id == input.Id)
                .Include(t => t.Forms)
                .ThenInclude(a => a.SignedFile)
                .FirstAsync();

            var form = signing.Forms.First(a => a.Id == input.Form.Id);

            var file = await _fileStorageService.GetFile(form.SignedFile.Id);

            var fileDto = new FileDto(form.File.Name, form.File.ContentType);
            _tempFileCacheManager.SetFile(fileDto.FileToken, file.Item1);

            return fileDto;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<FileDto> DownloadFinalDocumentAsync(DownloadFinalDocumentInput input)
        {
            var signing = await GetSignings()
                .Where(a => a.Id == input.Id)
                .Include(t => t.SignedFile)
                .FirstAsync();

            var file = await _fileStorageService.GetFile(signing.SignedFile.Id);

            var fileDto = new FileDto(signing.SignedFile.Name, signing.SignedFile.ContentType);
            _tempFileCacheManager.SetFile(fileDto.FileToken, file.Item1);

            return fileDto;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task RegenerateSignedDocumentsAsync(EntityDto<Guid> input)
        {
            var signing = await GetSignings()
                .Where(a => a.Id == input.Id)
                .Include(t => t.SignedFile)
                .FirstAsync();

            if (signing != null)
            {
                var args = new CreateSignedPdfDocumentsBackgroundJobArgs(signing);

                await _jobManager.EnqueueAsync<CreateSignedPdfDocumentsBackgroundJob,
                    CreateSignedPdfDocumentsBackgroundJobArgs>(args);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task RegeneratePageImagesAsync(EntityDto<Guid> input)
        {
            var signing = await GetSignings()
                .Where(a => a.Id == input.Id)
                .Include(t => t.SignedFile)
                .FirstAsync();

            if (signing != null)
            {
                foreach (var form in signing.Forms)
                {
                    signing.RegeneratePageBackgrounds();
                }
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<Guid> DuplicateSigningAsync(DuplicateSigningInput input)
        {
            var originalSigning = await GetSignings()
                .Where(a => a.Id == input.Id)
                .Include(t => t.SignedFile)
                .FirstAsync();

            Signing signing = null;
            
            if (originalSigning != null)
            {
                signing = new Signing(input.Name)
                {
                    AgentId = originalSigning.AgentId, 
                    TransactionId = originalSigning.TransactionId
                };

                if (originalSigning.ExpirationSettings != null)
                {
                    signing.SetExpirationSettings(new ExpirationSettings(originalSigning.ExpirationSettings.ExpirationDate));
                }

                if (originalSigning.ReminderSettings != null)
                {
                    signing.SetReminderSettings(new ReminderSettings(originalSigning.ReminderSettings.DispatchingFrequency));
                }

                originalSigning.Participants.ToList();
                var participantsMapping = new Dictionary<Guid, SigningParticipant>();
                foreach (var participant in originalSigning.Participants)
                {
                    var newSigningParticipant = new SigningParticipant()
                    {
                    TenantId = participant.TenantId,
                        Type = participant.Type,
                        FirstName = participant.FirstName,
                        MiddleName = participant.MiddleName,
                        LastName = participant.LastName,
                        Email = participant.Email,
                        Phone = participant.Phone,
                        LegalName = participant.LegalName,
                        PreferredSignature = participant.PreferredSignature,
                        PreferredInitials = participant.PreferredInitials,
                        Firm = participant.Firm,
                        Suffix = participant.Suffix,
                        Company = participant.Company,
                        Address = new Address() 
                        {
                            TenantId = participant.Address.TenantId,
                            StreetNumber = participant.Address.StreetNumber,
                            StreetName = participant.Address.StreetName,
                            UnitNumber = participant.Address.UnitNumber,
                            City = participant.Address.City,
                            State = participant.Address.State,
                            ZipCode = participant.Address.ZipCode
                        }
                    };
                    
                    participantsMapping.Add(participant.Id, newSigningParticipant);
                    signing.AddParticipant(newSigningParticipant);
                }

                await _signingRepository.InsertAsync(signing);
                await CurrentUnitOfWork.SaveChangesAsync();

                var formsMapping = new List<KeyValuePair<Form, Form>>();
                foreach (var signingForm in originalSigning.Forms)
                {
                    var newForm = signing.CloneForm(signingForm, input.ForNextSinging);
                    formsMapping.Add(new KeyValuePair<Form, Form>(signingForm, newForm));
                }

                var pmiMapping = new Dictionary<Guid, ParticipantMappingItem>();
                foreach (var pair in formsMapping)
                {
                    if (pair.Key.ParticipantMappingItems.Count > 0)
                    {
                        var items = new List<ParticipantMappingItem>();
                        pair.Key.ParticipantMappingItems.ToList();
                        foreach (var item in pair.Key.ParticipantMappingItems)
                        {
                            var newItem = new ParticipantMappingItem()
                            {
                                Name = item.Name,
                                DisplayOrder = item.DisplayOrder,
                                TenantId = item.TenantId
                            };

                            pmiMapping.Add(item.Id, newItem);
                            items.Add(newItem);
                        }

                        pair.Value.UpdateParticipantMappingItems(items);
                    }
                }

                await CurrentUnitOfWork.SaveChangesAsync();

                foreach (var pair in formsMapping)
                {
                    foreach (var page in pair.Value.Pages)
                    {
                        foreach (var control in page.Controls)
                        {
                            if (control.ParticipantMappingItemId.HasValue && pmiMapping.Keys.Contains(control.ParticipantMappingItemId.Value))
                            {
                                control.SetParticipantMappingItemId(pmiMapping[control.ParticipantMappingItemId.Value].Id);
                            }
                            else
                            {
                                control.SetParticipantMappingItemId(null);
                            }

                            if (control.ParticipantId.HasValue && participantsMapping.Keys.Contains(control.ParticipantId.Value))
                            {
                                control.SetParticipant(participantsMapping[control.ParticipantId.Value].Id);

                                if (!input.ForNextSinging && !input.IsReset) {
                                    control.SetValue(null, null, Clock.Now);
                                }
                            }
                            else
                            {
                                control.SetParticipant(null);
                            }
                        }
                    }
                }

                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return signing?.Id ?? Guid.Empty;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Edit)]
        public async Task<Guid> UpdateAsync(UpdateSigningInput input)
        {
            var signing = await GetSignings()
                .Where(t => t.Id == input.Signing.Id)
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                signing.Name = input.Signing.Name;
                signing.Notes = input.Signing.Notes;
                signing.SetExpirationSettings(new ExpirationSettings(input.Signing.Settings.ExpirationSettings.ExpirationDate));
                signing.SetReminderSettings(new ReminderSettings(input.Signing.Settings.ReminderSettings.DispatchingFrequency));

                if (input.Signing.AgentId.HasValue)
                {
                    signing.AgentId = await _userRepository
                        .GetAll()
                        .Where(u => u.PublicId == input.Signing.AgentId)
                        .Select(u => u.Id)
                        .FirstOrDefaultAsync();
                }

                await _signingRepository.UpdateAsync(signing);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
            
            return signing != null ? signing.Id : Guid.Empty;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Delete)]
        public async Task DeleteAsync(Guid id)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == id)
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                await _signingRepository.DeleteAsync(signing);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<PagedResultDto<SigningAttachmentListDto>> GetAttachmentsAsync(GetSigningAttachmentsInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            var query = signing.Attachments
                .AsQueryable()
                .WhereIf(!input.Filter.IsNullOrEmpty(), a => a.Name.Contains(input.Filter))
                .OrderBy(input.Sorting)
                .PageBy(input);

            var count = query.Count();

            var dto = signing.Attachments.Select(a => new
            {
                CreatedBy = a.SigningParticipant?.FullName ?? a.CreatorUser.FullName,
                Attachments = ObjectMapper.Map<AttachmentListDto>(a)
            });
                ObjectMapper.Map<List<AttachmentListDto>>(signing.Attachments);

            return new PagedResultDto<SigningAttachmentListDto>(
                totalCount: count,
                items: dto.Select(a => new SigningAttachmentListDto(signing.Id, a.CreatedBy, a.Attachments)).ToImmutableList()
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<FileDto> DownloadAttachmentAsync(DownloadSigningAttachmentInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .Include(t => t.Attachments)
                .ThenInclude(a => a.File)
                .FirstAsync();

            var attachment = signing.Attachments.First(a => a.Id == input.Attachment.Id);

            var file = await _fileStorageService.GetFile(attachment.File.Id);

            var fileDto = new FileDto(attachment.File.Name, attachment.File.ContentType);
            _tempFileCacheManager.SetFile(fileDto.FileToken, file.Item1);

            return fileDto;
        }

        private async Task<SigningRequest> GetSigningRequest(Guid id)
        {
            using (UnitOfWorkManager.Current.DisableFilter(AbpDataFilters.MustHaveTenant))
            using (UnitOfWorkManager.Current.SetTenantId(null))
            {
                var request = await _signingRequestRepository
                    .GetAll()
                    .Where(s => s.Id == id)
                    .Include(s => s.Participant)
                    .FirstOrDefaultAsync();

                request.LastViewDate = Clock.Now;
                await _signingRequestRepository.UpdateAsync(request);

                return request;
            }
        }

        private async Task<ViewRequest> GetViewRequest(Guid id)
        {
            using (UnitOfWorkManager.Current.DisableFilter(AbpDataFilters.MustHaveTenant))
            using (UnitOfWorkManager.Current.SetTenantId(null))
            {
                var request = await _viewRequestRepository.GetAsync(id);
                
                request.LastViewDate = Clock.Now;
                await _viewRequestRepository.UpdateAsync(request);

                return request;
            }
        }

        private async Task<SigningFormDto> GetSigningByRequestAsync(AccessRequest request)
        {
            using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
            {
                var signing = await _signingRepository
                    .GetAll()
                    .Where(s => s.Id ==request.SigningId)
                    .Include(s => s.Participants)
                    .FirstOrDefaultAsync();

                Check.NotNull(signing, nameof(signing));

                _signingRequestValidatingFactory.Create(signing).Validate(request);
                
                var formDto = signing.Forms
                    .Select(form => ObjectMapper.Map<FormEditDto>(form))
                    .ToArray();

                var participants = signing.Participants
                    .ToList()
                    .Select(participant => ObjectMapper.Map<ContactInfoDto>(participant))
                    .ToArray();

                return new SigningFormDto(signing.Id, signing.Name, formDto, request.Participant.Id, participants);
            }
        }
        
        private IQueryable<Signing> GetSignings()
        {
            var user = GetCurrentUser();

            return _signingRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll),
                    l => l.AgentId == user.Id);
        }
    }
}
