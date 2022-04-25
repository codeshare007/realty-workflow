using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Dto
{
    public class TransactionSearchDto : EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
