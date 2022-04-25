using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Input
{
    public class UpdateAddressInput: AddressInput, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
    }
}
