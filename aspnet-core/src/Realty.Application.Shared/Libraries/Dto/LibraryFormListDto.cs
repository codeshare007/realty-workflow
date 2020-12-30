using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Dto;

namespace Realty.Libraries.Dto
{
    public class LibraryFormListDto: EntityDto<Guid>, IHasFormDto<Guid>
    {
        protected LibraryFormListDto()
        {

        }

        public LibraryFormListDto(Guid libraryId, FormListDto form)
        {
            Id = libraryId;
            Form = form;
        }

        public FormListDto Form { get; set; }
    }
}
