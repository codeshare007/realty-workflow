using System;
using Realty.Listings;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Leads
{
    public class RecommendedListing : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int DisplayOrder { get; set; }

        public DateTime? LastViewDate { get; set; }
        public RequestTourTime? RequestedTourTime { get; set; }
        public DateTime? RequestedTourDate { get; set; }
        public string LeadQuestion { get; private set; }
        public string Notes { get; set; }

        public int TenantId { get; set; }
        public Guid LeadId { get; set; }
        public Guid ListingId { get; set; }
        public virtual Lead Lead { get; set; }
        public virtual Listing Listing { get; set; }

        public void SetLeadQuestion(string question)
        {
            this.LeadQuestion = question;
            //ToDO: send email to agent
        }
        public void SetRequestedTour(RequestTourTime? requestedTourTime, DateTime? requestedTourDate)
        {
            this.RequestedTourTime = requestedTourTime;
            this.RequestedTourDate = requestedTourDate;
            //ToDO: send email to agent
        }
    }
}
