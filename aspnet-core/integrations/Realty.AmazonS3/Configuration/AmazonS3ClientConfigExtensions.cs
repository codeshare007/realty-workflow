using Abp.Configuration.Startup;

namespace Realty.AmazonS3.Configuration
{
    public static class AmazonS3ClientConfigExtensions
    {
        public static AmazonS3ClientConfig AmazonS3Client(this IModuleConfigurations moduleConfigurations) =>
            moduleConfigurations.AbpConfiguration.Get<AmazonS3ClientConfig>();
    }
}
