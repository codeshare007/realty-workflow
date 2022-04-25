using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Input
{
    public class UpdateContactInput: ContactInput, IEntityDto<Guid>
    {
        public Guid Id { get; set; }

        public UpdateAddressInput Address { get; set; }
    }
}
