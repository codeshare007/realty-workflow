using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class DownloadOriginalDocumentInput : EntityDto<Guid>
    {
        public EntityDto<Guid> Form { get; set; }
    }
}
