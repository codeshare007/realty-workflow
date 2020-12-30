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
using Realty.Controls.Input;
using Realty.Controls;
using Realty.DynamicEntityPropertyValues.Dto;
using Realty.Forms;
using Realty.Libraries.Dto;
using Realty.Libraries.Input;

namespace Realty.Libraries
{
    [AbpAuthorize(AppPermissions.Pages_Library_Forms)]
    public class LibraryFormAppService : RealtyAppServiceBase, ILibraryFormAppService
    {
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly IRepository<Control, Guid> _controlRepository;
        private readonly FormAssembler _formAssembler;

        public LibraryFormAppService(
            IRepository<Library, Guid> libraryRepository,
            IRepository<File, Guid> fileRepository,
            IRepository<Control, Guid> controlRepository,
            FormAssembler formAssembler)
        {
            _libraryRepository = libraryRepository;
            _fileRepository = fileRepository;
            _controlRepository = controlRepository;
            _formAssembler = formAssembler;
        }

        [AbpAuthorize(AppPermissions.Pages_Library_Forms)]
        public async Task<PagedResultDto<LibraryFormListDto>> GetAllAsync(GetLibraryFormsInput input)
        {
            var query = _libraryRepository.GetAll()
                .Where(l => l.Id == input.Id)
                .SelectMany(l => l.Forms)
                .WhereIf(!input.Filter.IsNullOrEmpty(), f => f.Name.Contains(input.Filter));

            var totalCount = await query.CountAsync();

            var forms = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();

            var dto = ObjectMapper
                .Map<List<FormListDto>>(forms)
                .Select(f => new LibraryFormListDto(input.Id, f))
                .ToList();

            return new PagedResultDto<LibraryFormListDto>(totalCount, dto);
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Create)]
        public async Task<Guid> CreateAsync(CreateLibraryFormInput input)
        {
            var library = await _libraryRepository.GetAsync(input.Id);
            var form = ObjectMapper.Map<Form>(input.Form);

            form.File = await _fileRepository.GetAsync(input.Form.FileId);

            library.Add(form);

            await _libraryRepository.UpdateAsync(library);
            await CurrentUnitOfWork.SaveChangesAsync();

            return form.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Create, AppPermissions.Pages_LibraryForms_Edit,
            RequireAllPermissions = false)]
        public async Task<LibraryFormEditDto> GetForEditAsync(GetLibraryFormForEditInput input)
        {
            var library = input.Id == Guid.Empty
                ? await _libraryRepository.GetAll().FirstAsync(l => l.Forms.Any(f => f.Id == input.Form.Id)) 
                : await _libraryRepository.GetAsync(input.Id);

            var form = library.Forms.First(f => f.Id == input.Form.Id);
            var formDto = ObjectMapper.Map<FormEditDto>(form);
            return new LibraryFormEditDto(library.Id, formDto);
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Edit)]
        public async Task UpdateAsync(UpdateLibraryFormInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var library = await _libraryRepository.GetAsync(input.Id);
            var form = library.Forms.First(f => f.Id == input.Form.Id);

            _formAssembler.Map(input.Form, form);

            await _libraryRepository.UpdateAsync(library);
        }

        public async Task UpdateControlValueAsync(ControlValueInput input)
        {
            Check.NotNull(input.ControlId, nameof(input.ControlId));

            var control = await _controlRepository.GetAsync(input.ControlId);

            if (control != null)
            {
                control.SetValue(input.Value);
                await _controlRepository.UpdateAsync(control);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_LibraryForms_Delete)]
        public async Task DeleteAsync(DeleteLibraryFormInput input)
        {
            // DO NOT OPTIMIZE REQUESTS
            var library = await _libraryRepository.GetAsync(input.Id);
            var form = library.Forms.First(f => f.Id == input.Form.Id);

            library.Delete(form);

            await _libraryRepository.UpdateAsync(library);
        }
    }
}
