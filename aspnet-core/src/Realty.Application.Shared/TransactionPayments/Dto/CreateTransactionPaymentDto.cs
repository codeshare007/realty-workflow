using Realty.TransactionPaymentTrackers;
using System;

namespace Realty.TransactionPayments.Dto
{
    public class CreateTransactionPaymentDto
    {
        public PaymentParticipantType ParticipantType { get; set; }
        public GatewayType Gateway { get; set; }
        public PaymentStatus Status { get; set; }
        public Guid ParticipantId { get; set; }
        public string CheckNumber { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Comment { get; set; }
        public decimal Bounced { get; set; }
    }
}
