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
            var query = _leadRepository.GetAll()
                .Include(c => c.Customer)
                .Include(c => c.Agent)
                .Include(c => c.Contact)
                .ThenInclude(c => c.Address)
                .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                .WhereIf(input.CustomerId.HasValue, u => u.CustomerId.HasValue && u.Customer.PublicId == input.CustomerId)
                .WhereIf(!input.Filter.IsNullOrEmpty(), 
                        u => (u.Customer != null && (u.Customer.Name + ' ' + u.Customer.Surname).Contains(input.Filter)) ||
                             (u.Agent != null && (u.Agent.Name + ' ' + u.Agent.Surname).Contains(input.Filter)) ||
                             (u.Contact != null && (u.Contact.FirstName + ' ' + u.Contact.LastName).Contains(input.Filter)) ||
                             (u.Contact != null && u.Contact.Phone.Contains(input.Filter)));

            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll)) {
                var user = await GetCurrentUserAsync();
                query = query.Where(u => u.AgentId == user.Id);
            }

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
            var leads = await _leadRepository.GetAll()
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => (u.Customer != null && (u.Customer.Name + ' ' + u.Customer.Surname).Contains(input.Filter)) ||
                             (u.Agent != null && (u.Agent.Name + ' ' + u.Agent.Surname).Contains(input.Filter)) ||
                             (u.Contact != null && (u.Contact.FirstName + ' ' + u.Contact.LastName).Contains(input.Filter)) ||
                             (u.Contact != null && u.Contact.Phone.Contains(input.Filter)))
                .Take(10)
                .ToListAsync();

            return ObjectMapper.Map<List<KeyValuePair<Guid, string>>>(leads);
        }

        public async Task<Guid> CreateLeadAsync(CreateLeadInput input)
        {
            var lead = ObjectMapper.Map<Lead>(input);
            var tenant = await GetCurrentTenantAsync();
            lead.TenantId =
            lead.Contact.TenantId =
            lead.Contact.Address.TenantId = tenant.Id;

            if (input.AgentId.HasValue)
            {
                lead.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
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
            var lead = ObjectMapper.Map<Lead>(input.Lead);
            var tenant = await GetCurrentTenantAsync();
            lead.TenantId = 
            lead.Contact.TenantId = 
            lead.Contact.Address.TenantId = tenant.Id;

            if (input.Lead.AgentId.HasValue)
            {
                lead.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.Lead.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
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
            var user = await GetCurrentUserAsync();
            var lead = await _leadRepository.GetAsync(id);

            if (lead != null && 
                (PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll) || lead.AgentId == user.Id)) {
                await _leadRepository.DeleteAsync(lead);
            }
        }

        public async Task<Guid> CreateTransactionAsync(Guid leadId, Guid? listingId)
        {
            var user = await GetCurrentUserAsync();
            var lead = await _leadRepository.GetAll()
                .Include(c => c.Customer)
                .Include(c => c.Agent)
                .Include(c => c.Contact)
                .ThenInclude(c => c.Address)
                .FirstOrDefaultAsync(l => l.Id == leadId);

            if (lead != null && 
                (PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll) || lead.AgentId == user.Id)) {

                var transaction = new Transaction() {
                    AgentId = user.Id,
                    CustomerId = lead.CustomerId,
                    LeadId = lead.Id,
                    ListingId = listingId,
                    Name = $"Transaction from lead {lead.ExternalSource}"
                };

                await _transactionRepository.InsertAndGetIdAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                transaction.AddContact(lead.Contact);
                await _transactionRepository.UpdateAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                return transaction.Id;
            }

            return Guid.Empty;
        }

        public async Task<LeadEditDto> GetForEditAsync(Guid input)
        {
           var lead = await _leadRepository.GetAll()
                .Include(c => c.Customer)
                .Include(c => c.Agent)
                .Include(c => c.Contact)
                .ThenInclude(c => c.Address)
                .FirstOrDefaultAsync(l => l.Id == input);

            var dto = ObjectMapper.Map<LeadEditDto>(lead);
            return dto;
        }
    }
}
