using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Repositories;
using Realty.Libraries;
using Realty.Storage;

namespace Realty.Web.Controllers.Files
{
    [AbpMvcAuthorize]
    public class LibraryFileController : FileController
    {
        private readonly IRepository<Library, Guid> _repository;
        
        public LibraryFileController(
            IFileStorageService fileStorageService, 
            StorageExceptionHandler exceptionHandler, 
            IRepository<Library, Guid> repository
            ): base(fileStorageService, exceptionHandler)
        {
            _repository = repository;
        }

        protected override async Task<IHaveFiles> GetParentAsync(Guid entityId)
        {
            //TODO: add check access to entity and check status
            return await _repository.GetAsync(entityId);
        }
    }
}