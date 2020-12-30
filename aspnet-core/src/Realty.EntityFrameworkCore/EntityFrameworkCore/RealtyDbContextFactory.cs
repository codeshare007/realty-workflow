using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Realty.Configuration;
using Realty.Web;

namespace Realty.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class RealtyDbContextFactory : IDesignTimeDbContextFactory<RealtyDbContext>
    {
        public RealtyDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<RealtyDbContext>();
            var configuration = AppConfigurations.Get(
                WebContentDirectoryFinder.CalculateContentRootFolder(),
                addUserSecrets: true
            );

            RealtyDbContextConfigurer.Configure(builder, configuration.GetConnectionString(RealtyConsts.ConnectionStringName));

            return new RealtyDbContext(builder.Options);
        }
    }
}