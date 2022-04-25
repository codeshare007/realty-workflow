using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.TransactionPaymentTrackers;

namespace Realty.EntityConfigurations.Transactions
{
    public class TransactionPaymentTrackerConfiguration : IEntityTypeConfiguration<TransactionPaymentTracker>, IEntityTypeConfiguration
    {
        private const string TableName = "TransactionPaymentTrackers";
        public void Configure(EntityTypeBuilder<TransactionPaymentTracker> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Payments)
                .WithOne()
                .HasForeignKey("TransactionPaymentTrackerId")
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.AdditionalFees)
                .WithOne()
                .HasForeignKey("TransactionPaymentTrackerId")
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
