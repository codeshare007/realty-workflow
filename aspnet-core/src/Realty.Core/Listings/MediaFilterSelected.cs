using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Listings
{
    public class MediaFilterSelected : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public Media Media { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
        [ForeignKey("UserFilterId ")]
        public virtual UsersFilters Filter { get; set; }
    }

   
}
