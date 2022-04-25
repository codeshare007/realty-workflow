using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Contacts;
using Realty.Controls;
using Realty.Forms;
using Realty.MultiTenancy;
using Realty.Signings;

namespace Realty.EntityConfigurations.Controls
{
    public class ControlConfiguration: IEntityTypeConfiguration, IEntityTypeConfiguration<Control>
    {
        private const string TableName = "Controls";

        public void Configure(EntityTypeBuilder<Control> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.ClientNoAction);

            builder.HasOne<SigningParticipant>()
                .WithMany()
                .HasForeignKey(e => e.ParticipantId)
                .OnDelete(DeleteBehavior.ClientNoAction);

            builder.HasOne<ParticipantMappingItem>()
                .WithMany()
                .HasForeignKey(e => e.ParticipantMappingItemId)
                .OnDelete(DeleteBehavior.ClientNoAction);

            builder.OwnsOne(e => e.Position, config =>
            {
                config.Property(e => e.Left);
                config.Property(e => e.Top);
            });

            builder.OwnsOne(e => e.Size, config =>
            {
                config.Property(e => e.Height);
                config.Property(e => e.Width);
            });

            builder.OwnsOne(e => e.Font, config =>
            {
                config.Property(e => e.SizeInPx);
            });

            builder.HasOne(e => e.Value)
                .WithOne()
                .HasForeignKey<Control>("ControlValueId")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
