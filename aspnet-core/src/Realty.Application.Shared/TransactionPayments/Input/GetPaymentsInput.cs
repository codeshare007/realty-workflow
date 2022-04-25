using System;
using Abp.Application.Services.Dto;
using Realty.TransactionPaymentTrackers;

namespace Realty.TransactionPayments.Dto
{
    public class GetPaymentsInput : EntityDto<Guid>
    {
        public PaymentParticipantType ParticipantType { get; set; }
    }
}
