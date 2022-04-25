using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.Transactions;

namespace Realty.EntityConfigurations.Transactions
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>, IEntityTypeConfiguration
    {
        private const string TableName = "Transactions";
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Agent)
                .WithMany()
                .HasForeignKey(e => e.AgentId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Customer)
                .WithMany()
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Lead)
                .WithMany(e => e.Transactions)
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Listing)
                .WithMany(e => e.Transactions)
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.TransactionParticipants)
                .WithOne(a=> a.Transaction)
                .HasForeignKey(a=> a.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Forms)
                .WithOne()
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasMany(e => e.Attachments)
                .WithOne()
                .OnDelete(DeleteBehavior.ClientCascade);
        }
    }
}
