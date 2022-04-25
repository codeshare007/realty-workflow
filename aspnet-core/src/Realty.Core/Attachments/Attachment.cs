using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Authorization.Users;
using Realty.Forms;
using Realty.Signings;
using Realty.Storage;

namespace Realty.Attachments
{
    public class Attachment: FullAuditedEntity<Guid>, IMustHaveTenant, IHaveFile
    {
        protected Attachment()
        {
        }

        public Attachment(string name, File file)
        {
            Name = name;
            File = file;
        }

        [MinLength(Constants.MinNameLength), MaxLength(Constants.MaxNameLength)]
        public string Name { get; private set; }
        
        public int TenantId { get; set; }

        public virtual File File { get; set; }

        public virtual User CreatorUser { get; set; }

        //TODO: move to new entity
        public virtual SigningParticipant SigningParticipant { get; set; }
    }
}
