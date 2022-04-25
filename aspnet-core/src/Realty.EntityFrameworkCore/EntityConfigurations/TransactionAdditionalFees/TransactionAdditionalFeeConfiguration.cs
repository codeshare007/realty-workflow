using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.TransactionPaymentTrackers;

namespace Realty.EntityConfigurations.TransactionAdditionalFees
{
    public class TransactionAdditionalFeeConfiguration : IEntityTypeConfiguration<TransactionAdditionalFee>, IEntityTypeConfiguration
    {
        private const string TableName = "TransactionAdditionalFees";
        public void Configure(EntityTypeBuilder<TransactionAdditionalFee> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
