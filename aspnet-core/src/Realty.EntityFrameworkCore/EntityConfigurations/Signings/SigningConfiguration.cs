using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Signings;

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

            builder.HasOne(e => e.Agent)
                .WithMany()
                .HasForeignKey(e => e.AgentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Transaction)
                .WithMany()
                .HasForeignKey(e => e.TransactionId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.Participants)
                .WithOne(a=> a.Signing)
                .HasForeignKey(a=> a.SigningId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Attachments)
                .WithOne()
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.OwnsOne(e => e.ExpirationSettings, entity =>
            {
                entity.Property(e => e.ExpirationDate);
            });

            builder.OwnsOne(e => e.ReminderSettings, entity =>
            {
                entity.Property(e => e.NextDispatchTime);
                entity.Property(e => e.DispatchingFrequency);
            });

            builder.HasMany(e => e.SigningRequests)
                .WithOne()
                .HasForeignKey(e => e.SigningId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.ViewRequests)
                .WithOne()
                .HasForeignKey(e => e.SigningId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.SignedFile)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
