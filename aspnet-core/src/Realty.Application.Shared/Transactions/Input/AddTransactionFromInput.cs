using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Input
{
    public class AddTransactionFromInput : EntityDto<Guid>
    {
        public Guid TransactionId { get; set; }
        public EntityDto<Guid> Form { get; set; }
    }
}
