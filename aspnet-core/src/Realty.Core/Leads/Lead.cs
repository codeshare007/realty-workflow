using System;
using System.Collections.Generic;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Authorization.Users;
using Realty.Contacts;
using Realty.Transactions;

namespace Realty.Leads
{
    public class Lead : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        private List<RecommendedListing> _recommendedListings = new List<RecommendedListing>();
        private List<Transaction> _transactions = new List<Transaction>();

        public LeadStatus Status { get; set; }
        public LeadSource Source { get; set; }
        public string ExternalSource { get; set; }
        public string ExternalId { get; set; }
        public string Notes { get; set; }

        public decimal? MinBath { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent  { get; set; }
        public DateTime? MoveFrom { get; set; }
        public DateTime? MoveTo { get; set; }

        public string Tags { get; set; }
        public string Cities { get; set; }
        public string Pets { get; set; }
        public string Beds { get; set; }

        public int TenantId { get; set; }
        public long? CustomerId { get; set; }
        public long? AgentId { get; set; }
        public Guid? ContactId { get; set; }
        public virtual Contact Contact { get; set; }
        public virtual User Customer { get; set; }
        public virtual User Agent { get; set; }
        public virtual IReadOnlyCollection<RecommendedListing> RecommendedListings => _recommendedListings.AsReadOnly();
        public virtual IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();
    }
}
