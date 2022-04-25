using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Authorization;
using Realty.Authorization;
using Realty.Transactions;
using Realty.TransactionPaymentTrackers.Dto;
using Abp;

namespace Realty.TransactionPaymentTrackers
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionPaymentTrackerAppService : RealtyAppServiceBase, ITransactionPaymentTrackerAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        public TransactionPaymentTrackerAppService(
            IRepository<Transaction, Guid> transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<TransactionPaymentTrackerDto> GetAsync(GetTransactionPaymentTrackerInput input)
        {
            var query = GetFilteredTransactions()
                .Where(u => u.Id == input.Id);
            
            var transactionPaymentTracker = await query
                .Include(t => t.PaymentTracker)
                .ThenInclude(t => t.Payments)
                .Include(t => t.PaymentTracker)
                .ThenInclude(t => t.AdditionalFees)
                .Select(t => t.PaymentTracker)
                .FirstOrDefaultAsync();

            if (transactionPaymentTracker == null) 
            {
                transactionPaymentTracker = new TransactionPaymentTracker();
            }

            var dto = ObjectMapper.Map<TransactionPaymentTrackerDto>(transactionPaymentTracker);

            dto.ReceivedFromTenant = transactionPaymentTracker
                .Payments
                .Where(p => p.ParticipantType == PaymentParticipantType.FromClient)
                .Sum(t => t.Amount - t.Bounced);

            dto.ReceivedFromLandlord = transactionPaymentTracker
                .Payments
                .Where(p => p.ParticipantType == PaymentParticipantType.FromLandlord)
                .Sum(t => t.Amount - t.Bounced);

            dto.ReceivedToLandlord = transactionPaymentTracker
                .Payments
                .Where(p => p.ParticipantType == PaymentParticipantType.ToLandlord)
                .Sum(t => t.Amount - t.Bounced);

            dto.ReceivedToAgent = transactionPaymentTracker
                .Payments
                .Where(p => p.ParticipantType == PaymentParticipantType.ToAgent)
                .Sum(t => t.Amount - t.Bounced);

            dto.TotalAddedFees = transactionPaymentTracker.AdditionalFees.Sum(f => f.Amount);

            return dto;
        }

        public async Task UpdateAsync(UpdateTransactionPaymentTrackerInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));

            if (transaction.PaymentTracker == null) 
            {
                transaction.PaymentTracker = new TransactionPaymentTracker();
            }

            ObjectMapper.Map(input, transaction.PaymentTracker);
            await _transactionRepository.UpdateAsync(transaction);
        }

        private IQueryable<Transaction> GetFilteredTransactions()
        {
            var query = _transactionRepository.GetAll();

            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll))
            {
                var user = GetCurrentUser();
                query = query.Where(u => u.AgentId == user.Id);
            }

            return query;
        }
        }
}
