using Realty.Forms.Input;
using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Input
{
    public class UpdateTransactionFormInput: EntityDto<Guid>
    {
        public UpdateFormInput Form { get; set; }
    }
}
