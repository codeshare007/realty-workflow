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
using Realty.Dto;
using Realty.Libraries.Input;
using Realty.Signings.Input;
using Realty.Storage;

namespace Realty.Libraries
{
    public class LibraryAppService: RealtyAppServiceBase, ILibraryAppService
    {
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public LibraryAppService(IRepository<Library, Guid> libraryRepository, 
            IFileStorageService fileStorageService, 
            ITempFileCacheManager tempFileCacheManager)
        {
            _libraryRepository = libraryRepository;
            _fileStorageService = fileStorageService;
            _tempFileCacheManager = tempFileCacheManager;
        }

        [AbpAuthorize(AppPermissions.Pages_Library_Forms, AppPermissions.Pages_LibraryForms_View, RequireAllPermissions = false)]
        public async Task<PagedResultDto<LibraryListDto>> GetAllAsync(GetLibrariesInput input)
        {
            var query = _libraryRepository.GetAll()
                .WhereIf(!input.Filter.IsNullOrEmpty(), f => f.Name.Contains(input.Filter));

            var totalCount = await query.CountAsync();
            
            var libraries = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();
            
            var dto = ObjectMapper.Map<List<LibraryListDto>>(libraries);
            return new PagedResultDto<LibraryListDto>(totalCount, dto);
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Create)]
        public async Task<Guid> CreateAsync(CreateLibraryInput input)
        {
            var library = ObjectMapper.Map<Library>(input);

            await _libraryRepository.InsertAsync(library);
            await CurrentUnitOfWork.SaveChangesAsync();

            return library.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Create, AppPermissions.Pages_LibraryForms_Edit, 
            RequireAllPermissions = false)]
        public async Task<LibraryEditDto> GetForEditAsync(Guid id)
        {
            var library = await _libraryRepository.GetAsync(id);
            var dto = ObjectMapper.Map<LibraryEditDto>(library);
            return dto;
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Edit)]
        public async Task UpdateAsync(UpdateLibraryInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var library = await _libraryRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, library);

            await _libraryRepository.UpdateAsync(library);
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Delete)]
        public async Task DeleteAsync(Guid id)
        {
            // DO NOT OPTIMIZE REQUESTS
            var library = await _libraryRepository.GetAsync(id);
            await _libraryRepository.DeleteAsync(library);
        }

        [AbpAuthorize(AppPermissions.Pages_Library_Forms, AppPermissions.Pages_LibraryForms_View, RequireAllPermissions = false)]
        public async Task<FileDto> DownloadOriginalDocumentAsync(DownloadOriginalDocumentInput input)
        {
            var signing = await _libraryRepository.GetAll()
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
    }
}
