using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Abp.Extensions;
using Realty.Contacts.Dto;
using Realty.SigningParticipants.Dto;
using Realty.Signings;
using Realty.SigningParticipants.Input;
using Abp.BackgroundJobs;
using Realty.Signings.Jobs;

namespace Realty.SigningParticipants
{
    [AbpAuthorize(AppPermissions.Pages_Signings)]
    public class SigningParticipantAppService : RealtyAppServiceBase, ISigningParticipantAppService
    {
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IBackgroundJobManager _jobManager;

        public SigningParticipantAppService(
            IRepository<Signing, Guid> signingRepository, 
            IBackgroundJobManager jobManager)
        {
            _signingRepository = signingRepository;
            _jobManager = jobManager;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<PagedResultDto<ContactListDto>> GetAllAsync(GetSigningParticipantsInput input)
        {
            var query = GetSignings()
                .Include(t => t.Participants)
                .Where(t => t.Id == input.SigningId)
                .SelectMany(t => t.Participants);

            var participantCount = await query.CountAsync();

            var participants = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var participantListDto = ObjectMapper.Map<List<ContactListDto>>(participants);
            return new PagedResultDto<ContactListDto>(
                participantCount,
                participantListDto
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task ResendSigningRequestAccessEmailAsync(ResendSigningRequestAccessEmail input)
        {
            var signing = await GetSignings()
                .Include(s => s.SigningRequests)
                .Include(s => s.ViewRequests)
                .Where(t => t.Id == input.SigningId && t.Status == SigningStatus.Pending &&
                    (t.SigningRequests.Any(s => s.Id == input.SigningRequestAccessId) || (t.ViewRequests.Any(s => s.Id == input.SigningRequestAccessId))))
                .FirstOrDefaultAsync();

            if (signing != null) 
            {
                var viewRequest = signing.ViewRequests.FirstOrDefault(s => s.Id == input.SigningRequestAccessId);
                var signingRequest = signing.SigningRequests.FirstOrDefault(s => s.Id == input.SigningRequestAccessId);

                if (signingRequest != null)
                {
                    await _jobManager.EnqueueAsync<SigningRequestCreatedEmailDeliveryJob,
                        SigningRequestCreatedEmailDeliveryJobArgs>(new SigningRequestCreatedEmailDeliveryJobArgs() { SigningRequestId = signingRequest.Id });
                }
                else if (viewRequest != null)
                {
                    await _jobManager.EnqueueAsync<ViewRequestCreatedEmailDeliveryJob,
                        ViewRequestCreatedEmailDeliveryJobArgs>(new ViewRequestCreatedEmailDeliveryJobArgs() { ViewRequestId = viewRequest.Id });
                }

                await _signingRepository.UpdateAsync(signing);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task UpdateSigningRequestAccessEmailAsync(UpdateSigningRequestAccessEmail input)
        {
            var signing = await GetSignings()
                .Include(s => s.SigningRequests)
                .Include(s => s.ViewRequests)
                .Where(t => t.Id == input.SigningId && t.Status == SigningStatus.Pending &&
                    (t.SigningRequests.Any(s => s.Id == input.SigningRequestAccessId) || (t.ViewRequests.Any(s => s.Id == input.SigningRequestAccessId))))
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                var viewRequest = signing.ViewRequests.FirstOrDefault(s => s.Id == input.SigningRequestAccessId);
                var signingRequest = signing.SigningRequests.FirstOrDefault(s => s.Id == input.SigningRequestAccessId);

                var oldEmail = string.Empty;
                if (signingRequest != null)
                {
                    signingRequest.Participant.Email = input.Email;
                }
                else if (viewRequest != null)
                {
                    viewRequest.Participant.Email = input.Email;
                }
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<List<SigningAccessRequestDto>> GetAllAccessRequstsAsync(GetSigningParticipantsInput input)
        {
            var query = GetSignings()
                .Include(t => t.SigningRequests)
                .ThenInclude(r => r.Participant)
                .Include(t => t.ViewRequests)
                .ThenInclude(r => r.Participant)
                .Where(t => t.Id == input.SigningId);

            var signing = await query.FirstOrDefaultAsync();

            List<SigningAccessRequestDto> list = new List<SigningAccessRequestDto>();

            list.AddRange(signing.SigningRequests
                .Select(r =>
                    new SigningAccessRequestDto(
                        r.Id,
                        ObjectMapper.Map<ContactListDto>(r.Participant),
                        r.LastViewDate,
                        r.Status,
                        r.GetRejectComment()
                        ))
                .ToArray());

            list.AddRange(signing.ViewRequests
                .Select(r =>
                    new SigningAccessRequestDto(
                        r.Id,
                        ObjectMapper.Map<ContactListDto>(r.Participant),
                        r.LastViewDate))
                .ToArray());

            return list;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Create)]
        public async Task CreateAsync(CreateSigningParticipantInput input)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == input.Signing.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(signing, nameof(signing));

            var participant = ObjectMapper.Map<SigningParticipant>(input.Participant);
            signing.AddParticipant(participant);

            await _signingRepository.UpdateAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Create)]
        public async Task AddFromTransaction(Guid signingId, Guid participantId)
        {
            var signing = await GetSignings()
                .Where(s => s.Id == signingId)
                .FirstOrDefaultAsync();

            Check.NotNull(signing, nameof(signing));

            if (signing.Transaction != null)
            {
                var contact = signing.Transaction.TransactionParticipants.FirstOrDefault(p => p.Id == participantId);
                Check.NotNull(contact, nameof(contact));

                var participant = ObjectMapper.Map<SigningParticipant>(contact);
                signing.AddParticipant(participant);

                await _signingRepository.UpdateAsync(signing);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<ContactDto> GetForEditAsync(GetSigningParticipantInput input)
        {
            var participant = await GetSignings()
                .Where(t => t.Id == input.SigningId)
                .SelectMany(t => t.Participants)
                .Where(c => c.Id == input.ParticipantId)
                .FirstOrDefaultAsync();

            return ObjectMapper.Map<ContactDto>(participant);
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Edit)]
        public async Task UpdateAsync(UpdateSigningParticipantInput input)
        {
            var signing = await GetSignings()
                .Include(t => t.Participants)
                .Where(t => t.Id == input.Signing.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(signing, nameof(signing));

            var participant = signing.Participants.First(c => c.Id == input.Participant.Id);

            ObjectMapper.Map(input.Participant, participant);

            await _signingRepository.UpdateAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Delete)]
        public async Task DeleteAsync(DeleteSigningParticipantInput input)
        {
            var signing = await GetSignings()
                .Include(t => t.Participants)
                .Where(t => t.Id == input.SigningId)
                .FirstOrDefaultAsync();

            Check.NotNull(signing, nameof(signing));

            var signingParticipant = signing.Participants.FirstOrDefault(c => c.Id == input.ParticipantId);

            if (signingParticipant != null)
            {
                signing.RemoveParticipant(signingParticipant);
                await _signingRepository.UpdateAsync(signing);
                await CurrentUnitOfWork.SaveChangesAsync();
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
