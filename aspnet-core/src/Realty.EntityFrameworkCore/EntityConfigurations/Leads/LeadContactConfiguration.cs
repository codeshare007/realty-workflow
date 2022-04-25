using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Leads;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.TransactionContacts
{
    public class LeadContactConfiguration : IEntityTypeConfiguration<LeadContact>, IEntityTypeConfiguration
    {
        private const string TableName = "LeadContacts";
        public void Configure(EntityTypeBuilder<LeadContact> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(l=> l.Lead)
                .WithMany(l => l.LeadContacts)
                .HasForeignKey(a=> a.LeadId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
