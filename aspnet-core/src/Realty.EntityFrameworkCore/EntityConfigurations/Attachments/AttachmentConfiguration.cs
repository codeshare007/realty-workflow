using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Attachments;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Attachments
{
    public class AttachmentConfiguration: IEntityTypeConfiguration<Attachment>, IEntityTypeConfiguration
    {
        private const string TableName = "Attachments";
        public void Configure(EntityTypeBuilder<Attachment> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.File)
                .WithOne()
                .HasForeignKey<Attachment>("FileId")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
