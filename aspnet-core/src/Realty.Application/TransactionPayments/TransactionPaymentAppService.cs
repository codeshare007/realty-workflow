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
using Realty.TransactionPayments.Dto;
using Abp;
using Castle.Windsor.Configuration.Interpreters.XmlProcessor.ElementProcessors;
using Realty.TransactionPayments;
using Abp.Timing;

namespace Realty.TransactionPaymentTrackers
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionPaymentAppService : RealtyAppServiceBase, ITransactionPaymentAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        public TransactionPaymentAppService(
            IRepository<Transaction, Guid> transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<List<TransactionPaymentListDto>> GetPaymentsAsync(GetPaymentsInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var payments = transaction.PaymentTracker.Payments
                .Where(p => p.ParticipantType == input.ParticipantType)
                .ToList();

            return ObjectMapper.Map<List<TransactionPaymentListDto>>(payments);
        }

        public async Task<Guid> CreatePaymentAsync(CreatePaymentInput input)
        {
            Check.NotNull(input, nameof(input));

            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.TransactionId)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var payment = ObjectMapper.Map<Payment>(input);
            payment.SetGateway(input.Gateway);
            payment.SetStatus(input.Status);
            payment.SetParticipantType(input.ParticipantType);
            payment.SetPaymentDate(input.PaymentDate ?? Clock.Now);
            payment.SetParticipantId(input.ParticipantId);

            transaction.PaymentTracker.AddPayment(payment);
            await _transactionRepository.UpdateAsync(transaction);

            return payment.Id;
        }

        public async Task<TransactionPaymentDto> GetPaymentAsync(GetPaymentInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var payment = transaction.PaymentTracker.Payments.FirstOrDefault(p => p.Id == input.PaymentId);
            Check.NotNull(payment, nameof(payment));

            return ObjectMapper.Map<TransactionPaymentDto>(payment);
        }

        public async Task<Guid> UpdatePaymentAsync(UpdatePaymentInput input)
        {
            Check.NotNull(input, nameof(input));

            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.TransactionId)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var payment = transaction.PaymentTracker.Payments.FirstOrDefault(p => p.Id == input.Id);
            Check.NotNull(payment, nameof(payment));

            ObjectMapper.Map(input, payment);
            payment.SetGateway(input.Gateway);
            payment.SetStatus(input.Status);
            payment.SetPaymentDate(input.PaymentDate);
            payment.SetParticipantId(input.ParticipantId);

            transaction.PaymentTracker.AddPayment(payment);
            await _transactionRepository.UpdateAsync(transaction);

            return payment.Id;
        }

        public async Task DeletePaymentAsync(DeletePaymentInput input)
        {
            var transaction = await GetFilteredTransactions()
                .Where(u => u.Id == input.Id)
                .FirstOrDefaultAsync();

            Check.NotNull(transaction, nameof(transaction));
            Check.NotNull(transaction.PaymentTracker, nameof(transaction.PaymentTracker));

            var payment = transaction.PaymentTracker.Payments.FirstOrDefault(p => p.Id == input.PaymentId);
            Check.NotNull(payment, nameof(payment));

            transaction.PaymentTracker.RemovePayment(payment);
            await _transactionRepository.UpdateAsync(transaction);
        }

        private IQueryable<Transaction> GetFilteredTransactions()
        {
            var query = _transactionRepository
                .GetAll();

            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll))
            {
                var user = GetCurrentUser();
                query = query.Where(u => u.AgentId == user.Id);
            }

            return query.Include(t => t.PaymentTracker);
        }
        }
}
