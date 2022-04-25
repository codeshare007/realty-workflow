using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class CreateWithTransactionFormsInput : EntityDto<Guid>
    {
        public EntityDto<Guid>[] Forms { get; set; }
    }
}
