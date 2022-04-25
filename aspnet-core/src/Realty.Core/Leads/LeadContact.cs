using System;
using System.ComponentModel.DataAnnotations.Schema;
using Realty.Contacts;

namespace Realty.Leads
{
    public class LeadContact : Contact
    {
        public Guid? LeadId { get; set; }
        [ForeignKey("LeadId")]
        public virtual Lead Lead { get; set; }
    }
}
