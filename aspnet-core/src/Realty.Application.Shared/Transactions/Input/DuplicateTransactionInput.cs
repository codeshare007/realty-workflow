using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactios.Input
{
    public class DuplicateTransactionInput : EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
