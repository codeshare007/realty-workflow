using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.TransactionPaymentTrackers;

namespace Realty.EntityConfigurations.Payments
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>, IEntityTypeConfiguration
    {
        private const string TableName = "Payments";
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
