using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionAdditionalFees.Dto
{
    public class GetTransactionAdditionalFeeInput : EntityDto<Guid>
    {
        public Guid AdditionalFeeId { get; set; }
    }
}
