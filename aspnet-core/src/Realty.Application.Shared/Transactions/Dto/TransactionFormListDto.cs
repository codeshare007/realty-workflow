using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Dto;
using Realty.Libraries.Dto;

namespace Realty.Transactions.Dto
{
    public class TransactionFormListDto: EntityDto<Guid>, IHasFormDto<Guid>
    {
        protected TransactionFormListDto()
        {
        }

        public TransactionFormListDto(Guid transactionId, FormListDto form)
        {
            Id = transactionId;
            Form = form;
        }

        public FormListDto Form { get; set; }
    }
}
