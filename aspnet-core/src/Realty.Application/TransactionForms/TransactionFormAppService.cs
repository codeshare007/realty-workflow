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
using Realty.Transactions.Dto;
using Realty.Transactions.Input;

namespace Realty.TransactionForms
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionFormAppService : RealtyAppServiceBase, ITransactionFormAppService
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly FormAssembler _formAssembler;

        public TransactionFormAppService(
            IRepository<Transaction, Guid> transactionRepository,
            IRepository<File, Guid> fileRepository,
            FormAssembler formAssembler)
        {
            _transactionRepository = transactionRepository;
            _fileRepository = fileRepository;
            _formAssembler = formAssembler;
        }

        public async Task<PagedResultDto<TransactionFormListDto>> GetAllAsync(GetTransactionFormsInput input)
        {
            var query = _transactionRepository.GetAll()
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
            var transaction = await _transactionRepository.GetAsync(input.Id);
            var form = ObjectMapper.Map<Form>(input.Form);

            form.File = await _fileRepository.GetAsync(input.Form.FileId);

            transaction.Add(form);

            await _transactionRepository.UpdateAsync(transaction);
            await CurrentUnitOfWork.SaveChangesAsync();

            return form.Id;
        }

        public async Task<TransactionFormEditDto> GetForEditAsync(GetTransactionFormForEditInput input)
        {
            var transaction = input.Id == Guid.Empty 
                ? await _transactionRepository.GetAll().FirstAsync(t => t.Forms.Any(f => f.Id == input.Form.Id))
                : await _transactionRepository.GetAsync(input.Id);

            var form = transaction.Forms.First(f => f.Id == input.Form.Id);
            var formDto = ObjectMapper.Map<FormEditDto>(form);
            return new TransactionFormEditDto(transaction.Id, formDto);
        }

        public async Task UpdateAsync(UpdateTransactionFormInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var transaction = await _transactionRepository.GetAsync(input.Id);
            var form = transaction.Forms.First(f => f.Id == input.Form.Id);

            _formAssembler.Map(input.Form, form);

            await _transactionRepository.UpdateAsync(transaction);
        }

        public async Task DeleteAsync(DeleteTransactionFormInput input)
        {
            // DO NOT OPTIMIZE REQUESTS
            var transaction = await _transactionRepository.GetAsync(input.Id);
            var form = transaction.Forms.First(f => f.Id == input.Form.Id);

            transaction.Delete(form);

            await _transactionRepository.UpdateAsync(transaction);
        }
    }
}
