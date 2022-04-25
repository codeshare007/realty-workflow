using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionPaymentTrackers.Dto
{
    public class TransactionPaymentTrackerDto : EntityDto<Guid>
    {
        public Guid TransactionId { get; set; }
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

        public decimal ReceivedFromTenant { get; set; }
        public decimal ReceivedFromLandlord { get; set; }
        public decimal ReceivedToLandlord { get; set; }
        public decimal ReceivedToAgent { get; set; }
        public decimal TotalAddedFees { get; set; }
    }
}
