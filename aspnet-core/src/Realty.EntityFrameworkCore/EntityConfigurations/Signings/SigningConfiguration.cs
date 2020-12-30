using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Authorization.Users;
using Realty.MultiTenancy;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.EntityConfigurations.Signings
{
    public class SigningConfiguration: IEntityTypeConfiguration<Signing>, IEntityTypeConfiguration
    {
        private const string TableName = "Signings";
        public void Configure(EntityTypeBuilder<Signing> builder)
        {
            builder.ToTable(TableName);

            builder.HasMany(e => e.Forms)
                .WithOne()
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<User>(e => e.Agent)
                .WithMany()
                .HasForeignKey(e => e.AgentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Transaction>(e => e.Transaction)
                .WithMany()
                .HasForeignKey(e => e.TransactionId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
