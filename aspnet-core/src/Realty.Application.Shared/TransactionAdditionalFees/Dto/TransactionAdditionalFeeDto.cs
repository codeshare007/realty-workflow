using System;
using Abp.Application.Services.Dto;
using Realty.TransactionPaymentTrackers;

namespace Realty.TransactionAdditionalFees.Dto
{
    public class TransactionAdditionalFeeDto : EntityDto<Guid>
    {
        public decimal Amount { get; set; }
        public string Comment { get; set; }
    }
}
