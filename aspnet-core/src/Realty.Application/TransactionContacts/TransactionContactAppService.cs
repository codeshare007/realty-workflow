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
using Realty.TransactionContacts.Input;
using Realty.Transactions;

namespace Realty.TransactionContacts
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionContactAppService : RealtyAppServiceBase, ITransactionContactsAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<Contact, Guid> _contactRepository;
        private readonly IRepository<TransactionContact, Guid> _transactionContactRepository;

        public TransactionContactAppService(
            IRepository<Transaction, Guid> transactionRepository,
            IRepository<TransactionContact, Guid> transactionContactRepository, 
            IRepository<Contact, Guid> contactRepository)
        {
            _transactionRepository = transactionRepository;
            _transactionContactRepository = transactionContactRepository;
            _contactRepository = contactRepository;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<PagedResultDto<ContactInfoDto>> GetAllAsync(GetTransactionContactsInput input)
        {
            var user = await GetCurrentUserAsync();
            
            var query = _transactionContactRepository.GetAll()
                .Include(t => t.Contact)
                .Where(t => t.TransactionId == input.TransactionId)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll), t => t.Transaction.AgentId == user.Id)
                .Select(t => t.Contact)
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

        [AbpAuthorize(AppPermissions.Pages_Transactions_Create)]
        public async Task CreateAsync(CreateTransactionContactInput input)
        {
            var transaction = await _transactionRepository
                .GetAll()
                .Include(t => t.TransactionContacts)
                .Where(t => t.Id == input.TransactionId)
                //add validation
                .FirstOrDefaultAsync();

            if (transaction != null)
            {
                var contact = ObjectMapper.Map<Contact>(input.Contact);
                transaction.AddContact(contact);

                await _transactionRepository.UpdateAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<ContactDto> GetForEditAsync(GetTransactionContactInput input)
        {
            var user = await GetCurrentUserAsync();

            var contact = await _transactionContactRepository.GetAll()
                .Include(t => t.Contact)
                .Where(t => t.TransactionId == input.TransactionId && t.ContactId == input.ContactId)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll), t => t.Transaction.AgentId == user.Id)
                .Select(t => t.Contact)
                .FirstOrDefaultAsync();

            return ObjectMapper.Map<ContactDto>(contact);
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Edit)]
        public async Task UpdateAsync(UpdateTransactionContactInput input)
        {
            var transaction = await _transactionRepository
                .GetAll()
                .Include(t => t.TransactionContacts)
                .Where(t => t.Id == input.TransactionId && t.TransactionContacts.Any(c => c.ContactId == input.Contact.Id))
                //add validation
                .FirstOrDefaultAsync();

            if (transaction != null)
            {
                var contact = await _contactRepository.GetAsync(input.Contact.Id);
                if (contact != null)
                {
                    ObjectMapper.Map(input.Contact, contact);

                    await _contactRepository.UpdateAsync(contact);
                    await CurrentUnitOfWork.SaveChangesAsync();
                }
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Delete)]
        public async Task DeleteAsync(DeleteTransactionContactInput input)
        {
            var transaction = await _transactionRepository
                .GetAll()
                .Include(t => t.TransactionContacts)
                .Where(t => t.Id == input.TransactionId && t.TransactionContacts.Any(c => c.ContactId == input.ContactId))
                //add validation
                .FirstOrDefaultAsync();

            if (transaction != null)
            {
                var transactionContact = transaction
                    .TransactionContacts
                    .Where(t => t.ContactId == input.ContactId)
                    .FirstOrDefault();

                if (transactionContact != null)
                {
                    transaction.RemoveContact(transactionContact);
                    await _transactionRepository.UpdateAsync(transaction);
                    await CurrentUnitOfWork.SaveChangesAsync();
                }
            }
        }
    }
}
