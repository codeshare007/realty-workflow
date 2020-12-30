using Microsoft.EntityFrameworkCore;

namespace Realty.EntityConfigurations
{
    public interface IEntityTypeConfigurationWithModelBuilder : IEntityTypeConfiguration
    {
        void Configure(ModelBuilder builder);
    }
}
