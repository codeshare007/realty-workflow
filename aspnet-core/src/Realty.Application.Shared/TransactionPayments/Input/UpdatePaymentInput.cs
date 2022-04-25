using System;
using Abp.Application.Services.Dto;
using Realty.TransactionPaymentTrackers;

namespace Realty.TransactionPayments.Dto
{
    public class UpdatePaymentInput : EntityDto<Guid>
    {
        public GatewayType Gateway { get; set; }
        public PaymentStatus Status { get; set; }
        public Guid ParticipantId { get; set; }
        public string CheckNumber { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Comment { get; set; }
        public decimal Bounced { get; set; }
        public Guid TransactionId { get; set; }
    }
}
