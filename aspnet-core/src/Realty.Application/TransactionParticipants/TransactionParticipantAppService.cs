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
using Realty.TransactionParticipants.Dto;
using Realty.TransactionParticipants.Input;
using Realty.Transactions;

namespace Realty.TransactionParticipants
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionParticipantAppService : RealtyAppServiceBase, ITransactionParticipantAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;

        public TransactionParticipantAppService(IRepository<Transaction, Guid> transactionRepository) =>
            _transactionRepository = transactionRepository;


        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<PagedResultDto<ContactListDto>> GetAllAsync(GetTransactionParticipantsInput input)
        {
            var query = GetTransactions()
                .Include(t => t.TransactionParticipants)
                .Where(t => t.Id == input.TransactionId)
                .SelectMany(t => t.TransactionParticipants)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        c => c.FirstName.Contains(input.Filter) || c.LastName.Contains(input.Filter) ||
                            c.Phone.Contains(input.Filter) || c.Email.Contains(input.Filter) ||
                            c.Address.StreetName.Contains(input.Filter) || c.Address.StreetNumber.Contains(input.Filter));

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

        [AbpAuthorize(AppPermissions.Pages_Transactions_Create)]
        public async Task CreateAsync(CreateTransactionParticipantInput input)
        {
            var transaction = await GetTransactions()
                .Include(t => t.TransactionParticipants)
                .Where(t => t.Id == input.TransactionId)
                //add validation
                .FirstOrDefaultAsync();

            if (transaction != null)
            {
                var participant = ObjectMapper.Map<TransactionParticipant>(input.Participant);
                transaction.AddParticipant(participant);

                await _transactionRepository.UpdateAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<TransactionParticipantDto> GetForEditAsync(GetTransactionParticipantInput input)
        {
            var participant = await GetTransactions()
                .Where(t => t.Id == input.TransactionId)
                .SelectMany(t => t.TransactionParticipants)
                .Where(c => c.Id == input.ParticipantId)
                .FirstOrDefaultAsync();

            return ObjectMapper.Map<TransactionParticipantDto>(participant);
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Edit)]
        public async Task UpdateAsync(UpdateTransactionParticipantInput input)
        {
            var transaction = await GetTransactions()
                .Include(t => t.TransactionParticipants)
                .Where(t => t.Id == input.TransactionId)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));

            var participant = transaction.TransactionParticipants.FirstOrDefault(c => c.Id == input.Participant.Id);

            if (participant != null)
            {
                ObjectMapper.Map(input.Participant, participant);

                await _transactionRepository.UpdateAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Delete)]
        public async Task DeleteAsync(DeleteTransactionParticipantInput input)
        {
            var transaction = await GetTransactions()
                .Include(t => t.TransactionParticipants)
                .Where(t => t.Id == input.TransactionId)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));

            var transactionParticipant = transaction.TransactionParticipants.FirstOrDefault(c => c.Id == input.ParticipantId);

            if (transactionParticipant != null)
            {
                transaction.RemoveParticipant(transactionParticipant);
                await _transactionRepository.UpdateAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        private IQueryable<Transaction> GetTransactions()
        {
            var user = GetCurrentUser();

            return _transactionRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                    l => l.AgentId == user.Id);
        }
    }
}
