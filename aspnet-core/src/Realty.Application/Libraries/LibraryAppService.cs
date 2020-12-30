using System;
using System.Collections.Generic;
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
using Realty.Libraries.Input;

namespace Realty.Libraries
{
    [AbpAuthorize(AppPermissions.Pages_Library_Forms)]
    public class LibraryAppService: RealtyAppServiceBase, ILibraryAppService
    {
        private readonly IRepository<Library, Guid> _libraryRepository;
        
        public LibraryAppService(IRepository<Library, Guid> libraryRepository)
        {
            _libraryRepository = libraryRepository;
        }

        [AbpAuthorize(AppPermissions.Pages_Library_Forms)]
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
    }
}
