using Realty.Forms.Input;
using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Input
{
    public class GetTransactionFormsInput : GetFormsInput, IEntityDto<Guid>
    {
        //Transaction Id
        public Guid Id { get; set; }
    }
}
