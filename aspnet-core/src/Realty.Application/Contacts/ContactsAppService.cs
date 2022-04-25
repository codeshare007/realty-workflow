using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using NUglify.Helpers;
using Realty.Authorization;
using Realty.Contacts.Dto;
using Realty.Contacts.Input;
using Realty.Dto;
using Realty.Leads;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Contacts
{
    public class ContactsAppService : RealtyAppServiceBase
    {
        private readonly IRepository<Lead, Guid> _leadRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<Signing, Guid> _signingRepository;

        public ContactsAppService(IRepository<Lead, Guid> leadRepository,
            IRepository<Transaction, Guid> transactionRepository,
            IRepository<Signing, Guid> signingRepository
            )
        {
            _leadRepository = leadRepository;
            _transactionRepository = transactionRepository;
            _signingRepository = signingRepository;
        }

        public async Task<PagedResultDto<ContactTableDto>> GetContactList(ContactGetList input)
        {
            var user = await GetCurrentUserAsync();
            var list = new List<ContactTableDto>();
            input.Filter = input.Filter?.ToLower();

            if (input.ContactType == ContactSourceType.All || input.ContactType == ContactSourceType.Lead)
            {
                var leadContacts = await _leadRepository
                    .GetAllIncluding(a => a.LeadContacts)
                    .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll), l => l.AgentId == user.Id)
                    .SelectMany(a => a.LeadContacts)
                    .ToListAsync();

                var leadDto = ObjectMapper.Map<List<ContactTableDto>>(leadContacts);

                leadDto.ForEach(a => a.Type = "Lead Contact");
                list.AddRange(leadDto);
            }

            if (input.ContactType == ContactSourceType.All || input.ContactType == ContactSourceType.Transaction)
            {
                var transactionContacts = await _transactionRepository
                    .GetAllIncluding(a => a.TransactionParticipants)
                    .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll), l => l.AgentId == user.Id)
                    .SelectMany(a => a.TransactionParticipants)
                    .ToListAsync();

                var transactionDto = ObjectMapper.Map<List<ContactTableDto>>(transactionContacts);
                list.AddRange(transactionDto);
            }

            if (input.ContactType == ContactSourceType.All || input.ContactType == ContactSourceType.Signing)
            {
                var signingContacts = await _signingRepository
                    .GetAllIncluding(a => a.Participants)
                    .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll), l => l.AgentId == user.Id)
                    .SelectMany(a => a.Participants)
                    .ToListAsync();

                var signingDto = ObjectMapper.Map<List<ContactTableDto>>(signingContacts);
                list.AddRange(signingDto);
            }

            if (!input.Filter.IsNullOrEmpty())
            {
                list = list.Where(a =>
                    (a.FirstName != null && a.FirstName.ToLower().Contains(input.Filter)) || (a.LastName != null && a.LastName.ToLower().Contains(input.Filter)) ||
                     (a.Email != null && a.Email.ToLower().Contains(input.Filter)) || (a.Phone != null && a.Phone.ToLower().Contains(input.Filter))).ToList();
            }

            list = list.DistinctBy(a => a.Email != null ? a.Email.ToLower() : string.Empty).ToList();
            var res = new PagedResultDto<ContactTableDto>();
            res.TotalCount = list.Count;
            list = list.Skip(input.SkipCount).Take(input.MaxResultCount).ToList();
            res.Items = list;

            return res;
        }

        public async Task<List<ContactTableDto>> GetByEmail(ContactGetByEmail input)
        {
            var user = await GetCurrentUserAsync();
            var list = new List<ContactTableDto>();
            input.EmailAdress = input.EmailAdress?.ToLower();

            if (input.ContactType == ContactSourceType.All || input.ContactType == ContactSourceType.Lead)
            {
                var leadContacts = await _leadRepository
                    .GetAllIncluding(a => a.LeadContacts)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll), l => l.AgentId == user.Id)
                    .SelectMany(a => a.LeadContacts)
                    .Where(a => a.Email != null && a.Email.ToLower() == input.EmailAdress)
                    .ToListAsync();

                var leadDto = ObjectMapper.Map<List<ContactTableDto>>(leadContacts);
                leadDto.ForEach(a => a.Type = "Lead Contact");
                list.AddRange(leadDto);
            }

            if (input.ContactType == ContactSourceType.All || input.ContactType == ContactSourceType.Transaction)
            {
                var transactionContacts = await _transactionRepository
                    .GetAllIncluding(a => a.TransactionParticipants)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll), l => l.AgentId == user.Id)
                    .SelectMany(a => a.TransactionParticipants)
                    .Where(a => a.Email != null && a.Email.ToLower() == input.EmailAdress)
                    .ToListAsync();

                var transactionDto = ObjectMapper.Map<List<ContactTableDto>>(transactionContacts);
                transactionDto.ForEach(a => a.Type = "Transaction Contact");
                list.AddRange(transactionDto);
            }

            if (input.ContactType == ContactSourceType.All || input.ContactType == ContactSourceType.Signing)
            {
                var signingContacts =
                await _signingRepository
                    .GetAllIncluding(a => a.Participants)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll), l => l.AgentId == user.Id)
                    .SelectMany(a => a.Participants)
                    .Where(a => a.Email != null && a.Email.ToLower() == input.EmailAdress)
                    .ToListAsync();

                var signingDto = ObjectMapper.Map<List<ContactTableDto>>(signingContacts);
                signingDto.ForEach(a => a.Type = "Signing Contact");
                list.AddRange(signingDto);
            }

            return list;
        }
    }
}
