using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Dto
{
    public class AddressDto: EntityDto<Guid>
    {
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string UnitNumber { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
