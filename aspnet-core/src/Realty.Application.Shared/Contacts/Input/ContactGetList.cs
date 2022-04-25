using Realty.Dto;
using System;

namespace Realty.Contacts.Input
{
    public class ContactGetList : PagedAndSortedInputDto
    {
        public string Filter { get; set; }

        public Guid? AgentId { get; set; }

        public ContactSourceType ContactType { get; set; }
    }

    public class ContactGetByEmail
    {
        public string EmailAdress { get; set; }

        public ContactSourceType ContactType { get; set; }
    }

    public enum ContactSourceType
    {
        All = 0,
        Lead = 1,
        Transaction = 2,
        Signing = 3
    }
}
