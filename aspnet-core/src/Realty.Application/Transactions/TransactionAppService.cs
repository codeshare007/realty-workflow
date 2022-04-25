using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Immutable;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Abp.Extensions;
using Abp.Runtime.Session;
using NUglify.Helpers;
using Realty.Attachments;
using Realty.Attachments.Dto;
using Realty.Authorization.Users;
using Realty.Dto;
using Realty.Signings.Input;
using Realty.Storage;
using Realty.TransactionPaymentTrackers;
using Realty.Transactios.Input;
using Abp.Timing;
using Realty.Contacts;

namespace Realty.Transactions
{
    [AbpAuthorize(AppPermissions.Pages_Transactions)]
    public class TransactionAppService : RealtyAppServiceBase, ITransactionAppService
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly IFileStorageService _fileStorageService;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<File, Guid> _fileRepository;

        public TransactionAppService(
            IRepository<Transaction, Guid> transactionRepository,
            ITempFileCacheManager tempFileCacheManager, 
            IFileStorageService fileStorageService,
            IRepository<User, long> userRepository,
            IRepository<File, Guid> fileRepository)
        {
            _transactionRepository = transactionRepository;
            _userRepository = userRepository;
            _tempFileCacheManager = tempFileCacheManager;
            _fileStorageService = fileStorageService;
            _fileRepository = fileRepository;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<List<TransactionSearchDto>> SearchTransaction(SearchTransactionsInput input)
        {
            var transactions = await GetTransactions()
                .WhereIf(!input.Name.IsNullOrEmpty(),t => t.Name.Contains(input.Name))
                .Take(10)
                .ToListAsync();

            return ObjectMapper.Map<List<TransactionSearchDto>>(transactions);
        }

        public async Task<Guid> DuplicateTransactionAsync(DuplicateTransactionInput input)
        {
            var originalTransaction = await GetTransactions()
                .Where(a => a.Id == input.Id)
                .FirstAsync();

            Transactions.Transaction transaction = null;

            if (originalTransaction != null)
            {
                transaction = new Transaction(input.Name)
                {
                    AgentId = this.AbpSession.GetUserId()
                };

                transaction.Clone(originalTransaction);
                transaction.Name = input.Name;
                
                foreach (var signingForm in originalTransaction.Forms)
                {
                    transaction.CloneForm(signingForm);
                }

                foreach (var participant in originalTransaction.TransactionParticipants)
                {
                    var newTransactionParticipant = new TransactionParticipant()
                    {
                        TenantId = participant.TenantId,
                        Type = participant.Type,
                        FirstName = participant.FirstName,
                        MiddleName = participant.MiddleName,
                        LastName = participant.LastName,
                        Email = participant.Email,
                        Phone = participant.Phone,
                        LegalName = participant.LegalName,
                        PreferredSignature = participant.PreferredSignature,
                        PreferredInitials = participant.PreferredInitials,
                        Firm = participant.Firm,
                        Suffix = participant.Suffix,
                        Company = participant.Company,
                        Address = new Address()
                        {
                            TenantId = participant.Address.TenantId,
                            StreetNumber = participant.Address.StreetNumber,
                            StreetName = participant.Address.StreetName,
                            UnitNumber = participant.Address.UnitNumber,
                            City = participant.Address.City,
                            State = participant.Address.State,
                            ZipCode = participant.Address.ZipCode
                        }
                    };

                    transaction.AddParticipant(newTransactionParticipant);
                }

                transaction.LastModificationTime = Clock.Now;
                await _transactionRepository.InsertAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return transaction?.Id ?? Guid.Empty;
        }
        
        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<PagedResultDto<TransactionListDto>> GetAllAsync(GetTransactionsInput input)
        {
            var query = GetTransactions()
                .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                .WhereIf(input.CustomerId.HasValue, u => u.CustomerId.HasValue && u.Customer.PublicId == input.CustomerId)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => (u.Customer != null && (u.Customer.Name + ' ' + u.Customer.Surname).Contains(input.Filter)) ||
                             (u.Agent != null && (u.Agent.Name + ' ' + u.Agent.Surname).Contains(input.Filter)) ||
                             u.Name.Contains(input.Filter) || u.Notes.Contains(input.Filter));

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
            transaction.LastModificationTime = Clock.Now;

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

            transaction.PaymentTracker = new TransactionPaymentTracker();
            await _transactionRepository.InsertAsync(transaction);
            await CurrentUnitOfWork.SaveChangesAsync();
            return transaction.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<TransactionEditDto> GetForEditAsync(Guid input)
        {
            var form = await GetTransactions()
                .Where(t => t.Id == input)
                .FirstOrDefaultAsync();

            var dto = ObjectMapper.Map<TransactionEditDto>(form);
            return dto;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Edit)]
        public async Task<Guid> UpdateAsync(UpdateTransactionInput input)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Transaction.Id)
                //add validation
                .FirstOrDefaultAsync();

            if (transaction != null)
            {
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
            }
            
            return transaction != null ? transaction.Id : Guid.Empty;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Delete)]
        public async Task DeleteAsync(Guid id)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == id)
                .FirstOrDefaultAsync();

            if (transaction != null)
            {
                await _transactionRepository.DeleteAsync(transaction);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Edit)]
        public async Task CreateAttachmentAsync(CreateTransactionAttachmentInput input)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var file = await _fileRepository.GetAsync(input.Attachment.FileId);
            var attachment = ObjectMapper.Map<Attachment>(input.Attachment);
            attachment.File = file;

            transaction.AddAttachment(attachment);

            await _transactionRepository.UpdateAsync(transaction);
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions_Edit)]
        public async Task DeleteAttachmentAsync(DeleteTransactionAttachmentInput input)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var attachment = transaction.Attachments.First(a => a.Id == input.Attachment.Id);
            transaction.DeleteAttachment(attachment);

            await _transactionRepository.UpdateAsync(transaction);
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<PagedResultDto<TransactionAttachmentListDto>> GetAttachmentsAsync(GetTransactionAttachmentsInput input)
        {
            var transaction = await GetTransactions()
                .Where(t => t.Id == input.Id)
                .FirstOrDefaultAsync();

            var query = transaction.Attachments
                .AsQueryable()
                .WhereIf(!input.Filter.IsNullOrEmpty(), a => a.Name.Contains(input.Filter))
                .OrderBy(input.Sorting)
                .PageBy(input);

            var count = query.Count();

            var dto = ObjectMapper.Map<List<AttachmentListDto>>(transaction.Attachments);

            return new PagedResultDto<TransactionAttachmentListDto>(
                totalCount: count,
                items: dto.Select(a => new TransactionAttachmentListDto(transaction.Id, a)).ToImmutableList()
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<FileDto> DownloadAttachmentAsync(DownloadTransactionAttachmentInput input)
        {
            var transaction = await GetTransactions()
                    .Where(a => a.Id == input.Id)
                    .Include(t => t.Attachments)
                    .ThenInclude(a => a.File)
                    .FirstAsync();

            var attachment = transaction.Attachments.First(a => a.Id == input.Attachment.Id);
            
            var file = await _fileStorageService.GetFile(attachment.File.Id);

            var fileDto = new FileDto(attachment.File.Name, attachment.File.ContentType);
            _tempFileCacheManager.SetFile(fileDto.FileToken, file.Item1);

            return fileDto;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<FileDto> DownloadOriginalDocumentAsync(DownloadOriginalDocumentInput input)
        {
            var signing = await GetTransactions()
                .Where(a => a.Id == input.Id)
                .Include(t => t.Forms)
                .ThenInclude(a => a.File)
                .FirstAsync();

            var form = signing.Forms.First(a => a.Id == input.Form.Id);

            var file = await _fileStorageService.GetFile(form.File.Id);

            var fileDto = new FileDto(form.File.Name, form.File.ContentType);
            _tempFileCacheManager.SetFile(fileDto.FileToken, file.Item1);

            return fileDto;
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
