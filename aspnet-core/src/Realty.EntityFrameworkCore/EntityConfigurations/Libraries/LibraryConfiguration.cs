using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Libraries;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Libraries
{
    public class LibraryConfiguration: IEntityTypeConfiguration<Library>, IEntityTypeConfiguration
    {
        private const string TableName = "Libraries";
        public void Configure(EntityTypeBuilder<Library> builder)
        {
            builder.ToTable(TableName);

            builder.HasMany(e => e.Forms)
                .WithOne()
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Attachments)
                .WithOne()
                .OnDelete(DeleteBehavior.ClientCascade);
        }
    }
}
