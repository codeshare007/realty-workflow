using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Authorization.Users;
using Realty.Contacts;
using Realty.Leads;
using Realty.MultiTenancy;

namespace Realty.EntityConfigurations.Leads
{
    public class LeadConfiguration : IEntityTypeConfiguration<Lead>, IEntityTypeConfiguration
    {
        private const string TableName = "Leads";
        public void Configure(EntityTypeBuilder<Lead> builder)
        {
            builder.ToTable(TableName);

            builder.HasOne<Tenant>()
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<User>(e => e.Agent)
                .WithMany()
                .HasForeignKey(e => e.AgentId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<User>(e => e.Customer)
                .WithMany()
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Contact>(e => e.Contact)
                .WithMany()
                .HasForeignKey(e => e.ContactId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.RecommendedListings)
                .WithOne(e => e.Lead)
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
