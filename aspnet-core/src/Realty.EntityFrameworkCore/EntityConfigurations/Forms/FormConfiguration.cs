using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Forms;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Forms
{
    public class FormConfiguration: IEntityTypeConfiguration<Form>, IEntityTypeConfiguration
    {
        private const string TableName = "Forms";
        public void Configure(EntityTypeBuilder<Form> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.Pages)
                .WithOne()
                .HasForeignKey("FormId")
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.File)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
