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
using Realty.Leads;
using Realty.LeadContacts.Input;
using Realty.LeadContacts;
using Realty.LeadContacts.Dto;

namespace Realty.LeadContactss
{
    [AbpAuthorize(AppPermissions.Pages_Leads)]
    public class LeadContactAppService : RealtyAppServiceBase, ILeadContactAppService
    {
        private readonly IRepository<Lead, Guid> _leadRepository;

        public LeadContactAppService(IRepository<Lead, Guid> leadRepository) =>
            _leadRepository = leadRepository;


        [AbpAuthorize(AppPermissions.Pages_Leads)]
        public async Task<PagedResultDto<ContactListDto>> GetAllAsync(GetLeadContactsInput input)
        {
            var query = GetLeads()
                .Include(t => t.LeadContacts)
                .Where(t => t.Id == input.LeadId)
                .SelectMany(t => t.LeadContacts)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        c => c.FirstName.Contains(input.Filter) || c.LastName.Contains(input.Filter) ||
                            c.Phone.Contains(input.Filter) || c.Email.Contains(input.Filter) ||
                            c.Address.StreetName.Contains(input.Filter) || c.Address.StreetNumber.Contains(input.Filter));

            var contactCount = await query.CountAsync();

            var contacts = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var contactListDto = ObjectMapper.Map<List<ContactListDto>>(contacts);
            return new PagedResultDto<ContactListDto>(
                contactCount,
                contactListDto
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Leads_Create)]
        public async Task CreateAsync(CreateLeadContactInput input)
        {
            var lead = await GetLeads()
                .Include(t => t.LeadContacts)
                .Where(t => t.Id == input.LeadId)
                //add validation
                .FirstOrDefaultAsync();

            if (lead != null)
            {
                var contact = ObjectMapper.Map<LeadContact>(input.Contact);
                lead.AddContact(contact);

                await _leadRepository.UpdateAsync(lead);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Leads)]
        public async Task<LeadContactDto> GetForEditAsync(GetLeadContactInput input)
        {
            var contact = await GetLeads()
                .Where(t => t.Id == input.LeadId)
                .SelectMany(t => t.LeadContacts)
                .Where(c => c.Id == input.ContactId)
                .FirstOrDefaultAsync();

            return ObjectMapper.Map<LeadContactDto>(contact);
        }

        [AbpAuthorize(AppPermissions.Pages_Leads_Edit)]
        public async Task UpdateAsync(UpdateLeadContactInput input)
        {
            var lead = await GetLeads()
                .Include(t => t.LeadContacts)
                .Where(t => t.Id == input.LeadId)
                .FirstOrDefaultAsync();

            Check.NotNull(lead, nameof(lead));

            var contact = lead.LeadContacts.FirstOrDefault(c => c.Id == input.Contact.Id);

            if (contact != null)
            {
                ObjectMapper.Map(input.Contact, contact);

                await _leadRepository.UpdateAsync(lead);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Leads_Delete)]
        public async Task DeleteAsync(DeleteLeadContactInput input)
        {
            var lead = await GetLeads()
                .Include(t => t.LeadContacts)
                .Where(t => t.Id == input.LeadId)
                .FirstOrDefaultAsync();

            Check.NotNull(lead, nameof(lead));

            var leadContact = lead.LeadContacts.FirstOrDefault(c => c.Id == input.ContactId);

            if (leadContact != null)
            {
                lead.RemoveContact(leadContact);
                await _leadRepository.UpdateAsync(lead);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
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
