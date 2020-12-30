using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Abp.Extensions;
using Realty.Authorization.Users;

namespace Realty.Transactions
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionAppService : RealtyAppServiceBase, ITransactionAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<User, long> _userRepository;

        public TransactionAppService(
            IRepository<Transaction, Guid> transactionRepository,
            IRepository<User, long> userRepository)
        {
            _transactionRepository = transactionRepository;
            _userRepository = userRepository;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<PagedResultDto<TransactionListDto>> GetAllAsync(GetTransactionsInput input)
        {
            var query = _transactionRepository.GetAll()
                .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                .WhereIf(input.CustomerId.HasValue, u => u.CustomerId.HasValue && u.Customer.PublicId == input.CustomerId)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => (u.Customer != null && (u.Customer.Name + ' ' + u.Customer.Surname).Contains(input.Filter)) ||
                             (u.Agent != null && (u.Agent.Name + ' ' + u.Agent.Surname).Contains(input.Filter)) ||
                             u.Name.Contains(input.Filter) || u.Notes.Contains(input.Filter));

            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll)) {
                var user = await GetCurrentUserAsync();
                query = query.Where(u => u.AgentId == user.Id);
            }

            var transactionCount = await query.CountAsync();

            var transactions = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var transactionListDtos = ObjectMapper.Map<List<TransactionListDto>>(transactions);
            return new PagedResultDto<TransactionListDto>(
                transactionCount,
                transactionListDtos
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Create)]
        public async Task<Guid> CreateAsync(CreateTransactionInput input)
        {
            var transaction = ObjectMapper.Map<Transaction>(input);
            var tenant = await GetCurrentTenantAsync();
            transaction.TenantId = tenant.Id;

            if (input.AgentId.HasValue)
            {
                transaction.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            if (input.CustomerId.HasValue)
            {
                transaction.CustomerId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.CustomerId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            await _transactionRepository.InsertAsync(transaction);
            await CurrentUnitOfWork.SaveChangesAsync();
            return transaction.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<TransactionEditDto> GetForEditAsync(Guid input)
        {
            var form = await _transactionRepository.GetAsync(input);
            var dto = ObjectMapper.Map<TransactionEditDto>(form);
            return dto;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Edit)]
        public async Task<Guid> UpdateAsync(UpdateTransactionInput input)
        {
            var transaction = await _transactionRepository
                .GetAll()
                .Where(t => t.Id == input.Transaction.Id)
                //add validation
                .FirstOrDefaultAsync();

            transaction.Name = input.Transaction.Name;
            transaction.Notes = input.Transaction.Notes;
            transaction.Status = input.Transaction.Status;
            transaction.Type = input.Transaction.Type;
            transaction.LeadId = input.Transaction.LeadId;
            transaction.ListingId = input.Transaction.ListingId;

            if (input.Transaction.AgentId.HasValue)
            {
                transaction.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.Transaction.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            if (input.Transaction.CustomerId.HasValue)
            {
                transaction.CustomerId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.Transaction.CustomerId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            await _transactionRepository.UpdateAsync(transaction);
            await CurrentUnitOfWork.SaveChangesAsync();
            return transaction.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Delete)]
        public async Task DeleteAsync(Guid id)
        {
            var user = await GetCurrentUserAsync();
            var transaction = await _transactionRepository.GetAsync(id);

            if (transaction != null && 
                (PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll) || transaction.AgentId == user.Id)) {
                await _transactionRepository.DeleteAsync(transaction);
            }
        }
    }
}
