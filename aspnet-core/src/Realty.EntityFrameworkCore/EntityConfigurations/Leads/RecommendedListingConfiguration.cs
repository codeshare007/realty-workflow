using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Leads;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Leads
{
    public class RecommendedListingConfiguration : IEntityTypeConfiguration<RecommendedListing>, IEntityTypeConfiguration
    {
        private const string TableName = "RecommendedListing";
        public void Configure(EntityTypeBuilder<RecommendedListing> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Lead)
                .WithMany(e => e.RecommendedListings)
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Listing)
                .WithMany(e => e.RecommendedListings)
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
