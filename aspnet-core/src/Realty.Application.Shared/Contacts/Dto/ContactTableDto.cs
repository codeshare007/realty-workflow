using System;

namespace Realty.Contacts.Dto
{
    public class ContactTableDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string LegalName { get; set; }
        public string PreferredSignature { get; set; }

        public string Type { get; set; }
        public string ParentName { get; set; }
        public Guid ParentId { get; set; }
    }
}
