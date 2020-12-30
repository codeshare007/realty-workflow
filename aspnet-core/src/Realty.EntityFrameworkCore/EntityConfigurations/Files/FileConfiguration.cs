using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.Storage;

namespace Realty.EntityConfigurations.Files
{
    public class FileConfiguration: IEntityTypeConfiguration<File>, IEntityTypeConfiguration
    {
        private const string TableName = "Files";

        public void Configure(EntityTypeBuilder<File> builder)
        {
            builder.ToTable(TableName);

            builder.HasMany(e => e.Forms)
                .WithOne(e => e.File)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.Pages)
                .WithOne(e => e.File)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
