using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;

namespace Realty.TransactionPaymentTrackers
{
    public class Payment : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public GatewayType Gateway { get; private set; }
        public PaymentStatus Status { get; private set; }
        public PaymentParticipantType ParticipantType { get; private set; }
        public Guid? TransactionParticipantId { get; private set; }
        public string CheckNumber { get; set; }
        public decimal Amount { get; private set; }
        public DateTime PaymentDate { get; private set; }
        public string Comment { get; set; }
        public string ExternalPaymentInfo { get; private set; }
        public decimal Bounced { get; private set; }

        public int TenantId { get; set; }

        public void SetGateway(GatewayType gateway)
        {
            this.Gateway = gateway;
        }

        public void SetStatus(PaymentStatus status)
        {
            this.Status = status;
        }

        public void SetParticipantType(PaymentParticipantType participantType)
        {
            this.ParticipantType = participantType;
        }

        public void SetPaymentDate(DateTime paymentDate)
        {
            this.PaymentDate = paymentDate;
        }

        public void SetParticipantId(Guid? participantId)
        {
            this.TransactionParticipantId = participantId;
        }

        public void SetExternalPaymentInfo(string externalPaymentInfo)
        {
            this.ExternalPaymentInfo = externalPaymentInfo;
        }
    }
}
