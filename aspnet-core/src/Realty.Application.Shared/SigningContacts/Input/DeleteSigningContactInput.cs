using System;

namespace Realty.SigningContacts.Input
{
    public class DeleteSigningContactInput
    {
        public Guid ContactId { get; set; }

        public Guid SigningId { get; set; }
    }
}
