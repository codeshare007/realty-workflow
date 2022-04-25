using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;

namespace Realty.Contacts
{
    public abstract class Contact : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public ContactType Type { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string LegalName { get; set; }
        public string PreferredSignature { get; set; }
        public string PreferredInitials { get; set; }
        // Lawyer
        public string Firm { get; set; }
        // Lawyer
        public string Suffix { get; set; }
        // General, Lessee, Lessor, Agent
        public string Company { get; set; }

        public virtual Address Address { get; set; }

        [NotMapped]
        public string FullName
        {
            get
            {
                var stringBuilder = new StringBuilder(FirstName);

                if (!string.IsNullOrEmpty(MiddleName))
                {
                    stringBuilder.AppendFormat(" {0}", MiddleName);
                }

                if (!string.IsNullOrEmpty(LastName))
                {
                    stringBuilder.AppendFormat(" {0}", LastName);
                }

                return stringBuilder.ToString();
            }
        }
        [NotMapped]
        public string Signature
        {
            get
            {
                if (!string.IsNullOrEmpty(PreferredSignature))
                    return PreferredSignature;

                return FullName;
            }
        }

        [NotMapped]
        public string Initials
        {
            get
            {
                if (!string.IsNullOrEmpty(PreferredInitials))
                    return PreferredInitials;

                var stringBuilder = new StringBuilder(FirstName.Length > 0 ? FirstName.Substring(0, 1) : string.Empty);

                if (LastName.Length > 0)
                {
                    stringBuilder.AppendFormat(".{0}.", LastName.Substring(0, 1));
                }

                return stringBuilder.ToString();
            }
        }
    }
}
