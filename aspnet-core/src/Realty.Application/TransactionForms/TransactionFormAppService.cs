using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization;
using Realty.Forms.Dto;
using Realty.Storage;
using Realty.Transactions;
using Realty.Forms;
using Realty.Forms.Input;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;
using Realty.Libraries;

namespace Realty.TransactionForms
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionFormAppService : RealtyAppServiceBase, ITransactionFormAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly FormAssembler _formAssembler;

        public TransactionFormAppService(
            IRepository<Transaction, Guid> transactionRepository,
            IRepository<File, Guid> fileRepository,
            FormAssembler formAssembler, 
            IRepository<Library, Guid> libraryRepository)
        {
            _transactionRepository = transactionRepository;
            _fileRepository = fileRepository;
            _formAssembler = formAssembler;
            _libraryRepository = libraryRepository;
        }

        public async Task<PagedResultDto<TransactionFormListDto>> GetAllAsync(GetTransactionFormsInput input)
        {
            var query = GetTransactions()
                .Where(t => t.Id == input.Id)
                .SelectMany(t => t.Forms)
                .WhereIf(!input.Filter.IsNullOrEmpty(), f => f.Name.Contains(input.Filter));

            var totalCount = await query.CountAsync();

            var forms = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();

            var dto = ObjectMapper
                .Map<List<FormListDto>>(forms)
                .Select(formDto => new TransactionFormListDto(input.Id, formDto))
                .ToList();

            return new PagedResultDto<TransactionFormListDto>(totalCount, dto);
        }

        public async Task<Guid> CreateAsync(CreateTransactionFormInput input)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = ObjectMapper.Map<Form>(input.Form);
            form.Height = 1650;
            form.Width = 1275;

            form.File = await _fileRepository.GetAsync(input.Form.FileId);

            transaction.Add(form);

            await _transactionRepository.UpdateAsync(transaction);
            await CurrentUnitOfWork.SaveChangesAsync();

            return form.Id;
        }

        public async Task<Guid?> AddFromLibraryAsync(AddFromLibraryInput input)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            Form transactionForm = null;

            if (transaction != null)
            {
                var library = await _libraryRepository.GetAll()
                    .Include("Forms.Pages")
                    .Include("Forms.Pages.Controls")
                    .FirstOrDefaultAsync(l => l.Forms.Any(f => f.Id == input.Form.Id));

                if (library != null) {
                    var libraryForm = library.Forms.First(f => f.Id == input.Form.Id);

                    if (libraryForm != null) {
                        transactionForm = transaction.CloneForm(libraryForm);

                        await _transactionRepository.UpdateAsync(transaction);
                        await CurrentUnitOfWork.SaveChangesAsync();

                        var pmiMapping = new Dictionary<Guid, ParticipantMappingItem>();
                        if (libraryForm.ParticipantMappingItems.Count > 0)
                        {
                            var items = new List<ParticipantMappingItem>();
                            foreach (var item in libraryForm.ParticipantMappingItems)
                            {
                                var newItem = new ParticipantMappingItem()
                                {
                                    Name = item.Name,
                                    DisplayOrder = item.DisplayOrder,
                                    TenantId = item.TenantId
                                };

                                pmiMapping.Add(item.Id, newItem);
                                items.Add(newItem);
                            }

                            transactionForm.UpdateParticipantMappingItems(items);
                        }

                        await CurrentUnitOfWork.SaveChangesAsync();

                        if (libraryForm.ParticipantMappingItems.Count > 0)
                        {
                            foreach (var page in transactionForm.Pages)
                            {
                                foreach (var control in page.Controls)
                                {
                                    if (control.ParticipantMappingItemId.HasValue)
                                    {
                                        control.SetParticipantMappingItemId(pmiMapping[control.ParticipantMappingItemId.Value].Id);
                                    }
                                }
                            }
                        }

                        await CurrentUnitOfWork.SaveChangesAsync();
                    }
                }
            }
            
            return transactionForm.Id != Guid.Empty ? transactionForm.Id : (Guid?)null;
        }


        public async Task<Guid?> AddTransactionFrom(AddTransactionFromInput input)
        {
            var user = await GetCurrentUserAsync();
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                    t => t.AgentId == user.Id)
                .FirstOrDefaultAsync();
            var signingForm = new Form();

            if (transaction != null)
            {
                var transactionSource = await _transactionRepository
                    .GetAll()
                    .Where(t => t.Id == input.TransactionId)
                    .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                        t => t.AgentId == user.Id)
                    .FirstOrDefaultAsync();

                if (transactionSource != null)
                {
                    var libraryForm = transactionSource.Forms.FirstOrDefault(f => f.Id == input.Form.Id);

                    if (libraryForm != null)
                    {
                        transaction.CloneForm(libraryForm);

                        await _transactionRepository.UpdateAsync(transaction);
                        await CurrentUnitOfWork.SaveChangesAsync();
                    }
                }
            }

            return signingForm.Id != Guid.Empty ? signingForm.Id : (Guid?)null;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Create)]
        public async Task<List<ParticipantMappingItemDto>> UpdateParticipantMappingItemsAsync(UpdateParticipantMappingItemsInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = transaction.Forms.First(f => f.Id == input.FormId);

            var items = input.Items != null ? ObjectMapper.Map<List<ParticipantMappingItem>>(input.Items) : new List<ParticipantMappingItem>();
            form.UpdateParticipantMappingItems(items);

            await _transactionRepository.UpdateAsync(transaction);

            return ObjectMapper.Map<List<ParticipantMappingItemDto>>(form.ParticipantMappingItems);
        }

        public async Task<TransactionFormEditDto> GetForEditAsync(GetTransactionFormForEditInput input)
        {
            var transaction = await GetTransactions()
                .WhereIf(input.Id == Guid.Empty, t => t.Forms.Any(f => f.Id == input.Form.Id))
                .WhereIf(input.Id != Guid.Empty, t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = transaction.Forms.First(f => f.Id == input.Form.Id);
            var formDto = ObjectMapper.Map<FormEditDto>(form);

            return new TransactionFormEditDto(transaction.Id, transaction.Name, formDto);
        }

        public async Task UpdateAsync(UpdateTransactionFormInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = transaction.Forms.First(f => f.Id == input.Form.Id);

            _formAssembler.Map(input.Form, form);

            await _transactionRepository.UpdateAsync(transaction);
        }

        public async Task DeleteAsync(DeleteTransactionFormInput input)
        {
            // DO NOT OPTIMIZE REQUESTS
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var form = transaction.Forms.First(f => f.Id == input.Form.Id);

            transaction.Delete(form);

            await _transactionRepository.UpdateAsync(transaction);
        }

        private IQueryable<Transaction> GetTransactions()
        {
            var user = GetCurrentUser();

            return _transactionRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                    l => l.AgentId == user.Id);
        }
    }
}
