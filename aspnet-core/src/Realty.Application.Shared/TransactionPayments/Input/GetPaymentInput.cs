using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionPayments.Dto
{
    public class GetPaymentInput : EntityDto<Guid>
    {
        public Guid PaymentId { get; set; }
    }
}
