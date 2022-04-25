using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Dto;

namespace Realty.Transactions.Dto
{
    public class TransactionFormEditDto: EntityDto<Guid>
    {
        protected TransactionFormEditDto()
        {
        }

        public TransactionFormEditDto(Guid transactionId, string name, FormEditDto form)
        {
            Id = transactionId;
            Name = name;
            Form = form;
        }

        public string Name { get; set; }
        public FormEditDto Form { get; set; }
    }
}
