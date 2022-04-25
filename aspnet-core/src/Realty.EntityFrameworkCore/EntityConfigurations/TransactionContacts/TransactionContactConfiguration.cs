using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.Transactions;

namespace Realty.EntityConfigurations.TransactionContacts
{
    public class TransactionContactConfiguration : IEntityTypeConfiguration<TransactionParticipant>, IEntityTypeConfiguration
    {
        private const string TableName = "TransactionParticipants";
        public void Configure(EntityTypeBuilder<TransactionParticipant> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
