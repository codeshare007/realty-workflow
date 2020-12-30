using Realty.Contacts.Dto;
using System;

namespace Realty.SigningContacts.Input
{
    public class CreateSigningContactInput
    {
        public ContactDto Contact { get; set; }

        public Guid SigningId { get; set; }
    }
}
