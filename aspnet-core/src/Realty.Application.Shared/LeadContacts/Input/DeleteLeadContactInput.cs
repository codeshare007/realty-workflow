using System;

namespace Realty.LeadContacts.Input
{
    public class DeleteLeadContactInput
    {
        public Guid ContactId { get; set; }

        public Guid LeadId { get; set; }
    }
}
