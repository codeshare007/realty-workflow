using System;
using Abp.Application.Services.Dto;
using Realty.TransactionPaymentTrackers;

namespace Realty.TransactionPayments.Dto
{
    public class TransactionPaymentListDto : EntityDto<Guid>
    {
        public GatewayType Gateway { get; set; }
        public PaymentStatus Status { get; set; }
        public string ParticipantName { get; set; }
        public string CheckNumber { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Comment { get; set; }
        public decimal Bounced { get; set; }
    }
}
