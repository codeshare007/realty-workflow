using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization;
using Realty.Contacts.Dto;
using Realty.Forms.Dto;
using Realty.Storage;
using Realty.Signings;
using Realty.Forms;
using Realty.Signings.Dto;
using Realty.Signings.Input;
using Realty.Transactions.Input;
using Realty.Libraries;
using Realty.Transactions;

namespace Realty.SigningForms
{
    [AbpAuthorize(AppPermissions.Pages_Signings)]
    public class SigningFormAppService : RealtyAppServiceBase, ISigningFormAppService
    {
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<Transactions.Transaction, Guid> _transactionRepository;
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly FormAssembler _formAssembler;

        public SigningFormAppService(
            IRepository<Signing, Guid> signingRepository,
            IRepository<File, Guid> fileRepository,
            FormAssembler formAssembler, 
            IRepository<Library, Guid> libraryRepository, 
            IRepository<Transaction, Guid> transactionRepository)
        {
            _signingRepository = signingRepository;
            _fileRepository = fileRepository;
            _formAssembler = formAssembler;
            _libraryRepository = libraryRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<PagedResultDto<SigningFormListDto>> GetAllAsync(GetSigningFormsInput input)
        {
            var query = GetSignings()
                .Where(t => t.Id == input.Id)
                .SelectMany(t => t.Forms)
                .WhereIf(!input.Filter.IsNullOrEmpty(), f => f.Name.Contains(input.Filter));

            var totalCount = await query.CountAsync();

            var forms = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();

            var dto = ObjectMapper
                .Map<List<FormListDto>>(forms)
                .Select(formDto => new SigningFormListDto(input.Id, formDto))
                .ToList();

            return new PagedResultDto<SigningFormListDto>(totalCount, dto);
        }

        public async Task UpdateSigningFormsOrderAsync(UpdateSigningFormsOrderInput input)
        {
            var signing = await GetSignings()
                .Include(s => s.Forms)
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                foreach (var form in input.Forms) 
                {
                    var signingForm = signing.Forms.FirstOrDefault(f => f.Id == form.Id);

                    if (form != null) 
                    {
                        signingForm.SetDisplayOrder(form.DisplayOrder);
                    }
                }

                await _signingRepository.UpdateAsync(signing);
            }
        }

        public async Task<Guid> CreateAsync(CreateSigningFormInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = ObjectMapper.Map<Form>(input.Form);
            form.Height = 1650;
            form.Width = 1275;

            form.File = await _fileRepository.GetAsync(input.Form.FileId);

            signing.Add(form);

            await _signingRepository.UpdateAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();

            return form.Id;
        }

        public async Task<SigningFormEditDto> GetForEditAsync(GetSigningFormForEditInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            var formDto = signing.Forms
                .Select(form => ObjectMapper.Map<FormEditDto>(form))
                .ToArray();

            var participantDto = signing
                .Participants
                .Select(participant => ObjectMapper.Map<ContactListDto>(participant))
                .ToArray();

            return new SigningFormEditDto(signing.Id, signing.Name, formDto, participantDto);
        }

        public async Task<Guid?> AddFromLibraryAsync(AddFromLibraryInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            var signingForm = new Form();

            if (signing != null)
            {
                var library = await _libraryRepository.GetAll()
                    .Include("Forms.Pages")
                    .Include("Forms.Pages.Controls")
                    .FirstOrDefaultAsync(l => l.Forms.Any(f => f.Id == input.Form.Id));

                if (library != null)
                {
                    var libraryForm = library.Forms.First(f => f.Id == input.Form.Id);

                    if (libraryForm != null)
                    {
                        signingForm = signing.CloneForm(libraryForm);

                        await _signingRepository.UpdateAsync(signing);
                        await CurrentUnitOfWork.SaveChangesAsync();

                        var pmiMapping = new Dictionary<Guid, ParticipantMappingItem>();
                        if (libraryForm.ParticipantMappingItems.Count > 0)
                        {
                            var items = new List<ParticipantMappingItem>();
                            foreach (var item in libraryForm.ParticipantMappingItems)
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

                            signingForm.UpdateParticipantMappingItems(items);
                        }

                        await CurrentUnitOfWork.SaveChangesAsync();

                        if (libraryForm.ParticipantMappingItems.Count > 0)
                        {
                            foreach (var page in signingForm.Pages)
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

                        await CurrentUnitOfWork.SaveChangesAsync();
                    }
                }
            }

            return signingForm.Id != Guid.Empty ? signingForm.Id : (Guid?)null;
        }

        public async Task<Guid?> AddTransactionFrom(AddTransactionFromInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            var signingForm = new Form();

            if (signing != null)
            {
                var user = await GetCurrentUserAsync();
                var transaction = await _transactionRepository
                    .GetAll()
                    .Where(t => t.Id == input.TransactionId)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                        t => t.AgentId == user.Id)
                    .FirstOrDefaultAsync();

                if (transaction != null)
                {
                    var libraryForm = transaction.Forms.FirstOrDefault(f => f.Id == input.Form.Id);
                    signingForm = signing.CloneForm(libraryForm);

                    await _signingRepository.UpdateAsync(signing);
                    await CurrentUnitOfWork.SaveChangesAsync();

                    var pmiMapping = new Dictionary<Guid, ParticipantMappingItem>();
                    if (libraryForm.ParticipantMappingItems.Count > 0)
                    {
                        var items = new List<ParticipantMappingItem>();
                        foreach (var item in libraryForm.ParticipantMappingItems)
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

                        signingForm.UpdateParticipantMappingItems(items);
                    }

                    await CurrentUnitOfWork.SaveChangesAsync();

                    if (libraryForm.ParticipantMappingItems.Count > 0)
                    {
                        foreach (var page in signingForm.Pages)
                        {
                            foreach (var control in page.Controls)
                            {
                                if (control.ParticipantMappingItemId.HasValue && pmiMapping.Keys.Contains(control.ParticipantMappingItemId.Value))
                                {
                                    control.SetParticipantMappingItemId(pmiMapping[control.ParticipantMappingItemId.Value].Id);
                                }
                            }
                        }
                    }

                    await CurrentUnitOfWork.SaveChangesAsync();
                }
            }

            return signingForm.Id != Guid.Empty ? signingForm.Id : (Guid?)null;
        }

        public async Task UpdateAsync(UpdateSigningFormInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();
            
            foreach (var form in signing.Forms) 
            {
                var formInput = input.Forms.FirstOrDefault(f => f.Id == form.Id);
                _formAssembler.Map(formInput, form);
            }

            await _signingRepository.UpdateAsync(signing);
        }

        public async Task DeleteAsync(DeleteSigningFormInput input)
        {
            // DO NOT OPTIMIZE REQUESTS
            var signing = await GetSignings()
                .Where(s => s.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = signing.Forms.First(f => f.Id == input.Form.Id);

            signing.Delete(form);

            await _signingRepository.UpdateAsync(signing);
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
