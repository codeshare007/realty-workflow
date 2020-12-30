using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Controls;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Controls
{
    public class ControlValueConfiguration: IEntityTypeConfiguration<ControlValue>, IEntityTypeConfiguration
    {
        private const string TableName = "ControlValues";
        public void Configure(EntityTypeBuilder<ControlValue> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.ClientNoAction);
        }
    }
}
