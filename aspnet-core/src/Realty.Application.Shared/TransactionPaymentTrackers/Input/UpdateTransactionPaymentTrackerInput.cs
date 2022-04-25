using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionPaymentTrackers.Dto
{
    public class UpdateTransactionPaymentTrackerInput : EntityDto<Guid>
    {
        public decimal FirstPayment { get; set; }
        public decimal LastPayment { get; set; }
        public decimal SecurityPayment { get; set; }
        public decimal KeyPayment { get; set; }
        public decimal OtherPayment { get; set; }
        public decimal FeePayment { get; set; }
        public decimal TenantFeePercentage { get; set; }
        public decimal LandlordFeePercentage { get; set; }
        public float AgentFeePercentage { get; set; }
        public bool IsWithholdingFee { get; set; }
    }
}
