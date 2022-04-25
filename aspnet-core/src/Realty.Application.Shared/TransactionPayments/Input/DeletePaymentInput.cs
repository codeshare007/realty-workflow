using System;
using Abp.Application.Services.Dto;

namespace Realty.TransactionPayments.Dto
{
    public class DeletePaymentInput : EntityDto<Guid>
    {
        public Guid PaymentId { get; set; }
    }
}
