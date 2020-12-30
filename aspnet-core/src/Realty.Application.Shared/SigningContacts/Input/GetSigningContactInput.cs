using System;

namespace Realty.SigningContacts.Input
{
    public class GetSigningContactInput
    {
        public Guid ContactId { get; set; }

        public Guid SigningId { get; set; }
    }
}
