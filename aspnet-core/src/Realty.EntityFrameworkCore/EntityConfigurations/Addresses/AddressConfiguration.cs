using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Contacts;

namespace Realty.EntityConfigurations.Addresses
{
    public class AddressConfiguration: IEntityTypeConfiguration<Address>, IEntityTypeConfiguration
    {
        private const string TableName = "Addresses";
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.ToTable(TableName);
        }
    }
}
