using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Dto;

namespace Realty.Libraries.Dto
{
    public class LibraryFormEditDto: EntityDto<Guid>
    {
        protected LibraryFormEditDto()
        {
        }

        public LibraryFormEditDto(Guid libraryId, FormEditDto form)
        {
            Id = libraryId;
            Form = form;
        }

        public FormEditDto Form { get; set; }
    }
}
