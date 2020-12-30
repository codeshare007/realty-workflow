using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Realty.EntityFrameworkCore
{
    public static class RealtyDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<RealtyDbContext> builder, string connectionString)
        {
            Configure(builder);
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<RealtyDbContext> builder, DbConnection connection)
        {
            Configure(builder);
            builder.UseSqlServer(connection);
        }

        private static void Configure(DbContextOptionsBuilder<RealtyDbContext> builder)
        {
            builder.UseLazyLoadingProxies();

#if (DEBUG)
            builder.EnableSensitiveDataLogging();
#endif
        }
    }
}