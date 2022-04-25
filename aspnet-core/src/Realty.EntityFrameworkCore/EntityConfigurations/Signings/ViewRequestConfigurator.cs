using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.MultiTenancy;
using Realty.Signings.AccessRequests;

namespace Realty.EntityConfigurations.Signings
{
    public class ViewRequestConfigurator: IEntityTypeConfiguration<ViewRequest>, IEntityTypeConfiguration
    {
        private const string TableName = "ViewRequests";

        public void Configure(EntityTypeBuilder<ViewRequest> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.ClientNoAction);

            builder.HasOne(e => e.Participant)
                .WithMany()
                .HasForeignKey("ParticipantId")
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
