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
using Abp;
using Realty.TransactionAdditionalFees.Dto;
using Realty.TransactionPaymentTrackers;

namespace Realty.TransactionAdditionalFees
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionAdditionalFeeAppService : RealtyAppServiceBase, ITransactionAdditionalFeeAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        public TransactionAdditionalFeeAppService(
            IRepository<Transaction, Guid> transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<List<TransactionAdditionalFeeDto>> GetListAsync(GetTransactionAdditionalFeeListInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var additionalFees = transaction.PaymentTracker
                .AdditionalFees
                .ToList();

            return ObjectMapper.Map<List<TransactionAdditionalFeeDto>>(additionalFees);
        }

        public async Task<Guid> CreateAsync(CreateTransactionAdditionalFeeInput input)
        {
            Check.NotNull(input.AdditionalFee, nameof(input.AdditionalFee));

            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var additionalFee = ObjectMapper.Map<TransactionAdditionalFee>(input.AdditionalFee);
            
            transaction.PaymentTracker.AddAdditionalFee(additionalFee);
            await _transactionRepository.UpdateAsync(transaction);

            return additionalFee.Id;
        }

        public async Task<TransactionAdditionalFeeDto> GetAsync(GetTransactionAdditionalFeeInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var additionalFee = transaction.PaymentTracker.AdditionalFees.FirstOrDefault(p => p.Id == input.AdditionalFeeId);
            Check.NotNull(additionalFee, nameof(additionalFee));

            return ObjectMapper.Map<TransactionAdditionalFeeDto>(additionalFee);
        }

        public async Task<Guid> UpdateAsync(UpdateTransactionAdditionalFeeInput input)
        {
            Check.NotNull(input.AdditionalFee, nameof(input.AdditionalFee));

            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var additionalFee = transaction.PaymentTracker.AdditionalFees.FirstOrDefault(p => p.Id == input.AdditionalFee.Id);
            Check.NotNull(additionalFee, nameof(additionalFee));

            ObjectMapper.Map(input.AdditionalFee, additionalFee);

            transaction.PaymentTracker.AddAdditionalFee(additionalFee);
            await _transactionRepository.UpdateAsync(transaction);

            return additionalFee.Id;
        }

        public async Task DeleteAsync(DeleteTransactionAdditionalFeeInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var additionalFee = transaction.PaymentTracker.Payments.FirstOrDefault(p => p.Id == input.AdditionalFeeId);
            Check.NotNull(additionalFee, nameof(additionalFee));

            transaction.PaymentTracker.RemovePayment(additionalFee);
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
