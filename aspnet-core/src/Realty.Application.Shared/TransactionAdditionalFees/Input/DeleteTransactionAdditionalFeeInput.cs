using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionAdditionalFees.Dto
{
    public class DeleteTransactionAdditionalFeeInput : EntityDto<Guid>
    {
        public Guid AdditionalFeeId { get; set; }
    }
}
