using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Input;

namespace Realty.Transactions.Input
{
    public class CreateTransactionFormInput: EntityDto<Guid>
    {
        public CreateFormInput Form { get; set; }
    }
}
