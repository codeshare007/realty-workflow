using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionAdditionalFees.Dto
{
    public class CreateTransactionAdditionalFeeInput : EntityDto<Guid>
    {
        public TransactionAdditionalFeeDto AdditionalFee { get; set; }
    }
}
