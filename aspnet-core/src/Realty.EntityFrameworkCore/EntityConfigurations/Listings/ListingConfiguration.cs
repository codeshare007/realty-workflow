using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Authorization.Users;
using Realty.Contacts;
using Realty.Listings;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Listings
{
    public class ListingConfiguration : IEntityTypeConfiguration<Listing>, IEntityTypeConfiguration
    {
        private const string TableName = "Listings";
        public void Configure(EntityTypeBuilder<Listing> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.OwnsOne(e => e.MoveInCosts, config =>
            {
                config.Property(e => e.IsFirstMonthRequired);
                config.Property(e => e.IsLastMonthRequired);
                config.Property(e => e.PetDeposit);
                config.Property(e => e.Fee);
                config.Property(e => e.KeyDeposit);
                config.Property(e => e.SecurityDeposit);
                config.Property(e => e.ApplicationFee);
            });

            builder.OwnsOne(e => e.Parking, config =>
            {
                config.Property(e => e.Availability);
                config.Property(e => e.Type);
            });

            builder.HasMany(e => e.ListingDetails)
                .WithOne()
                .HasForeignKey("ListingId")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
