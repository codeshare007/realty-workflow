using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Abp.Extensions;
using Realty.Contacts.Dto;
using Realty.Contacts;
using Realty.Signings;
using Realty.SigningContacts.Input;

namespace Realty.SigningContacts
{
    [AbpAuthorize(AppPermissions.Pages_Signings)]
    public class SigningContactAppService : RealtyAppServiceBase, ISigningContactsAppService
    {
        private readonly IRepository<Signing, Guid> _signingRepository;

        public SigningContactAppService(
            IRepository<Signing, Guid> signingRepository)
        {
            _signingRepository = signingRepository;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<PagedResultDto<ContactInfoDto>> GetAllAsync(GetSigningContactsInput input)
        {
            var user = await GetCurrentUserAsync();

            var query = _signingRepository.GetAll()
                .Include(t => t.SigningContacts)
                .ThenInclude(t => t.Contact)
                .Where(t => t.Id == input.SigningId)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll), t => t.AgentId == user.Id)
                .SelectMany(t => t.SigningContacts)
                .Select(c => c.Contact)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        c => c.FirstName.Contains(input.Filter) || c.LastName.Contains(input.Filter) ||
                            c.Phone.Contains(input.Filter) || c.Email.Contains(input.Filter) ||
                            c.Address.StreetName.Contains(input.Filter) || c.Address.StreetNumber.Contains(input.Filter));

            var contactCount = await query.CountAsync();

            var contacts = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var contactListDtos = ObjectMapper.Map<List<ContactInfoDto>>(contacts);
            return new PagedResultDto<ContactInfoDto>(
                contactCount,
                contactListDtos
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Create)]
        public async Task CreateAsync(CreateSigningContactInput input)
        {
            var signing = await _signingRepository
                .GetAll()
                .Include(t => t.SigningContacts)
                .Where(t => t.Id == input.SigningId)
                //add validation
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                var contact = ObjectMapper.Map<Contact>(input.Contact);
                signing.AddContact(contact);

                await _signingRepository.UpdateAsync(signing);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<ContactDto> GetForEditAsync(GetSigningContactInput input)
        {
            var user = await GetCurrentUserAsync();

            var contact = await _signingRepository
                .GetAll()
                .Where(t => t.Id == input.SigningId)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll), t => t.AgentId == user.Id)
                .SelectMany(t => t.SigningContacts)
                .Select(c => c.Contact)
                .Where(c => c.Id == input.ContactId)
                .FirstOrDefaultAsync();

            return ObjectMapper.Map<ContactDto>(contact);
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Edit)]
        public async Task UpdateAsync(UpdateSigningContactInput input)
        {
            var user = await GetCurrentUserAsync();
            
            var signing = await _signingRepository
                .GetAll()
                .Include(t => t.SigningContacts)
                .ThenInclude(t => t.Contact)
                .Where(t => t.Id == input.SigningId)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll), t => t.AgentId == user.Id)
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                var contact = signing.SigningContacts
                    .Where(c => c.ContactId == input.Contact.Id)
                    .Select(s => s.Contact)
                    .FirstOrDefault();

                if (contact != null)
                {
                    ObjectMapper.Map(input.Contact, contact);

                    await _signingRepository.UpdateAsync(signing);
                    await CurrentUnitOfWork.SaveChangesAsync();
                }
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Delete)]
        public async Task DeleteAsync(DeleteSigningContactInput input)
        {
            var user = await GetCurrentUserAsync();

            var signing = await _signingRepository
                .GetAll()
                .Include(t => t.SigningContacts)
                .ThenInclude(t => t.Contact)
                .Where(t => t.Id == input.SigningId)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll), t => t.AgentId == user.Id)
                .FirstOrDefaultAsync();

            if (signing != null)
            {
                var signingContact = signing.SigningContacts
                    .Where(c => c.ContactId == input.ContactId)
                    .FirstOrDefault();

                if (signingContact != null)
                {
                    signing.RemoveContact(signingContact);
                    await _signingRepository.UpdateAsync(signing);
                    await CurrentUnitOfWork.SaveChangesAsync();
                }
            }
        }
    }
}
