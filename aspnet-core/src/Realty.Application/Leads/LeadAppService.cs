using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Realty.Leads.Dto;
using Realty.Leads.Input;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Realty.Authorization.Users.Dto;
using Realty.Authorization.Roles;
using Realty.Transactions;
using Abp.Extensions;
using Realty.Authorization.Users;
using Realty.Common.Dto;
using Realty.TransactionPaymentTrackers;
using Abp.Timing;

namespace Realty.Leads
{
    [AbpAuthorize(AppPermissions.Pages_Leads)]
    public class LeadAppService : RealtyAppServiceBase, ILeadAppService
    {
        private readonly IRepository<Lead, Guid> _leadRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly RoleManager _roleManager;

        public LeadAppService(
            IRepository<Lead, Guid> leadRepository,
            RoleManager roleManager,
            IRepository<Transaction, Guid> transactionRepository, 
            IRepository<User, long> userRepository)
        {
            _roleManager = roleManager;
            _leadRepository = leadRepository;
            _transactionRepository = transactionRepository;
            _userRepository = userRepository;
        }

        public async Task<PagedResultDto<LeadListDto>> GetLeadsAsync(GetLeadsInput input)
        {
            var query = GetLeads()
                .Include(c => c.Customer)
                .Include(c => c.Agent)
                .Include(c => c.LeadContacts)
                .ThenInclude(c => c.Address)
                .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                .WhereIf(input.CustomerId.HasValue, u => u.CustomerId.HasValue && u.Customer.PublicId == input.CustomerId)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => (u.Customer != null && (u.Customer.Name + ' ' + u.Customer.Surname).Contains(input.Filter)) ||
                             (u.Agent != null && (u.Agent.Name + ' ' + u.Agent.Surname).Contains(input.Filter)) ||
                             (u.LeadContacts.Any(c => (c.FirstName + ' ' + c.LastName).Contains(input.Filter))));

            var leadCount = await query.CountAsync();

            var leads = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var leadListDtos = ObjectMapper.Map<List<LeadListDto>>(leads);
            return new PagedResultDto<LeadListDto>(
                leadCount,
                leadListDtos
                );
        }

        public async Task<List<KeyValuePair<Guid, string>>> Search(SearchInput input)
        {
            var leads = await GetLeads()
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => (u.Customer != null && (u.Customer.Name + ' ' + u.Customer.Surname).Contains(input.Filter)) ||
                             (u.Agent != null && (u.Agent.Name + ' ' + u.Agent.Surname).Contains(input.Filter)) ||
                             (u.LeadContacts.Any(c => (c.FirstName + ' ' + c.LastName).Contains(input.Filter))))
                .Take(10)
                .ToListAsync();

            return ObjectMapper.Map<List<KeyValuePair<Guid, string>>>(leads);
        }

        public async Task<Guid> CreateLeadAsync(CreateLeadInput input)
        {
            var lead = ObjectMapper.Map<Lead>(input);
            var leadContact = ObjectMapper.Map<LeadContact>(input.Contact);
            
            var tenant = await GetCurrentTenantAsync();
            lead.TenantId = 
            leadContact.TenantId =
            leadContact.Address.TenantId = tenant.Id;
            lead.AddContact(leadContact);

            if (input.AgentId.HasValue)
            {
                lead.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }
            else 
            {
                lead.AgentId = AbpSession.UserId;
            }

            if (input.CustomerId.HasValue)
            {
                lead.CustomerId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.CustomerId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            await _leadRepository.InsertAsync(lead);
            await CurrentUnitOfWork.SaveChangesAsync();
            return lead.Id;
        }
        
        public async Task<Guid> UpdateLeadAsync(UpdateLeadInput input)
        {
            var lead = await GetLeads().Where(l => l.Id == input.Lead.Id)
                .FirstOrDefaultAsync();

            ObjectMapper.Map(input.Lead, lead);
            
            if (input.Lead.AgentId.HasValue)
            {
                lead.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.Lead.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }
            else
            {
                lead.AgentId = AbpSession.UserId;
            }

            if (input.Lead.CustomerId.HasValue)
            {
                lead.CustomerId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.Lead.CustomerId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            await _leadRepository.UpdateAsync(lead);
            await CurrentUnitOfWork.SaveChangesAsync();
            return lead.Id;
        }

        public async Task DeleteAsync(Guid id)
        {
            var lead = await GetLeads().Where(l => l.Id == id).FirstOrDefaultAsync();

            if (lead != null) {
                await _leadRepository.DeleteAsync(lead);
            }
        }

        public async Task<Guid> CreateTransactionAsync(string name, Guid leadId)
        {
            var lead = await GetLeads()
                .Include(c => c.Customer)
                .Include(c => c.Agent)
                .Include(c => c.LeadContacts)
                .ThenInclude(c => c.Address)
                .FirstOrDefaultAsync(l => l.Id == leadId);

            if (lead != null) {

                var user = await GetCurrentUserAsync();
                var transaction = new Transaction() {
                    AgentId = user.Id,
                    CustomerId = lead.CustomerId,
                    LeadId = lead.Id,
                    Name = name ?? $"Transaction from lead",
                    PaymentTracker = new TransactionPaymentTracker()
                };
                transaction.LastModificationTime = Clock.Now;

                await _transactionRepository.InsertAndGetIdAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                foreach (var contact in lead.LeadContacts)
                {
                    transaction.AddParticipant(ObjectMapper.Map<TransactionParticipant>(contact));
                }
                
                await _transactionRepository.UpdateAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                return transaction.Id;
            }

            return Guid.Empty;
        }

        public async Task<LeadEditDto> GetForEditAsync(Guid input)
        {
           var lead = await GetLeads()
                .Include(c => c.Customer)
                .Include(c => c.Agent)
                .FirstOrDefaultAsync(l => l.Id == input);

            var dto = ObjectMapper.Map<LeadEditDto>(lead);
            return dto;
        }

        private IQueryable<Lead> GetLeads()
        {
            var user = GetCurrentUser();

            return _leadRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll),
                    l => l.AgentId == user.Id);
        }
    }
}
