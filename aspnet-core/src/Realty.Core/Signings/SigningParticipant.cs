using System;
using System.ComponentModel.DataAnnotations.Schema;
using Realty.Contacts;

namespace Realty.Signings
{
    public class SigningParticipant : Contact
    {
        public Guid? SigningId { get; set; }
        [ForeignKey("SigningId ")]
        public virtual Signing Signing { get; set; }
    }
}
