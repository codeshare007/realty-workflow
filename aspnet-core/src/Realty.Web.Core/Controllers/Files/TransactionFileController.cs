using System;
using System.Net;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Realty.Authorization;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.Web.Controllers.Files
{
    [AbpMvcAuthorize]
    public class TransactionFileController : FileController
    {
        private readonly IRepository<Transaction, Guid> _repository;
        private readonly IFileStorageService _fileStorageService;
        
        public TransactionFileController(
            IFileStorageService fileStorageService, 
            StorageExceptionHandler exceptionHandler, 
            IRepository<Transaction, Guid> repository
            ): base(fileStorageService, exceptionHandler)
        {
            _repository = repository;
            _fileStorageService = fileStorageService;
        }

        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<ActionResult> DownloadFileAsync(Guid id)
        {
            var file = await _fileStorageService.GetFile(id);
            if (file == null)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }
            return File(file.Item1, file.Item2.ContentType, file.Item2.Name);
        }
        
        protected override async Task<IHaveFiles> GetParentAsync(Guid entityId)
        {
            //TODO: add check access to entity and check status
            return await _repository.GetAsync(entityId);
        }

    }
}