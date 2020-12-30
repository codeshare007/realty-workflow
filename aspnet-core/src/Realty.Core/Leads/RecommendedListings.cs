using System;
using Realty.Listings;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Leads
{
    public class RecommendedListing : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int DisplayOrder { get; set; }

        public DateTime LastViewDate { get; set; }
        public DateTime RequestedTourDate { get; set; }
        public string LeadQuestion { get; set; }
        public string Notes { get; set; }

        public int TenantId { get; set; }
        public Guid LeadId { get; set; }
        public Guid ListingId { get; set; }
        public virtual Lead Lead { get; set; }
        public virtual Listing Listing { get; set; }
    }
}
