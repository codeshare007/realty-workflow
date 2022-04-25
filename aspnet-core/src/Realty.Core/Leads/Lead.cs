using System;
using System.Collections.Generic;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Authorization.Users;
using Realty.Transactions;

namespace Realty.Leads
{
    public class Lead : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<RecommendedListing> _recommendedListings = new List<RecommendedListing>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Transaction> _transactions = new List<Transaction>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<LeadContact> _leadContacts = new List<LeadContact>();

        public LeadStatus Status { get; set; }
        public LeadSource Source { get; set; }
        public string ExternalSource { get; set; }
        public string ExternalId { get; set; }
        public string Notes { get; set; }

        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string Zip { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent { get; set; }

        public DateTime? MoveFrom { get; set; }
        public DateTime? MoveTo { get; set; }

        public string Tags { get; set; }
        public string Cities { get; set; }
        public string Pets { get; set; }
        public string Bedrooms { get; set; }
        public string Bathrooms { get; set; }

        public int TenantId { get; set; }
        public long? CustomerId { get; set; }
        public long? AgentId { get; set; }
        public Guid? ContactId { get; set; }
        public virtual User Customer { get; set; }
        public virtual User Agent { get; set; }
        public virtual IReadOnlyCollection<RecommendedListing> RecommendedListings => _recommendedListings.AsReadOnly();
        public virtual IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();
        public virtual IReadOnlyCollection<LeadContact> LeadContacts => _leadContacts.AsReadOnly();

        public void AddContact(LeadContact contact)
        {
            LeadContacts.ToList();
            _leadContacts.Add(contact);
        }

        public void RemoveContact(LeadContact contact)
        {
            LeadContacts.ToList();
            _leadContacts.Remove(contact);
        }

        public void AddRecommendedListing(RecommendedListing recommendedListing)
        {
            Check.NotNull(recommendedListing, nameof(recommendedListing));

            _recommendedListings.Add(recommendedListing);
        }

        public void DeleteRecommendedListing(RecommendedListing recommendedListing)
        {
            Check.NotNull(recommendedListing, nameof(recommendedListing));

            // ReSharper disable once InconsistentNaming
            var _recommendedListing = _recommendedListings.First(f => f.Id == recommendedListing.Id);
            _recommendedListings.Remove(_recommendedListing);
        }
    }
}
