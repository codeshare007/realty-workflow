using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Forms;
using Realty.MultiTenancy;
using Realty.Pages;

namespace Realty.EntityConfigurations.Pages
{
    public class PageConfiguration: IEntityTypeConfiguration<Page>, IEntityTypeConfiguration
    {
        private const string TableName = "Pages";

        public void Configure(EntityTypeBuilder<Page> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.ClientNoAction);

            builder.HasOne(e => e.File)
                .WithMany(e => e.Pages)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Form>()
                .WithMany(e => e.Pages)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Controls)
                .WithOne()
                .HasForeignKey("PageId")
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
