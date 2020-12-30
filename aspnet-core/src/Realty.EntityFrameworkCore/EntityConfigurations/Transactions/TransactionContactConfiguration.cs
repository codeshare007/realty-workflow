using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.Transactions;

namespace Realty.EntityConfigurations.Transactions
{
    public class TransactionContactConfiguration : IEntityTypeConfiguration<TransactionContact>, IEntityTypeConfiguration
    {
        private const string TableName = "TransactionContacts";
        public void Configure(EntityTypeBuilder<TransactionContact> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Transaction)
                .WithMany(e => e.TransactionContacts)
                .HasForeignKey(e => e.TransactionId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Contact)
                .WithMany()
                .HasForeignKey(e => e.ContactId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
