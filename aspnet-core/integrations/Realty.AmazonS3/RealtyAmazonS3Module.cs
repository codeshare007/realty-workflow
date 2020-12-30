using Abp.Modules;
using Abp.Reflection.Extensions;
using Realty.AmazonS3.Configuration;

namespace Realty.AmazonS3
{
    [DependsOn(typeof(RealtyCoreModule))]
    public class RealtyAmazonS3Module : AbpModule
    {
        public override void PreInitialize()
        {
            AmazonS3ClientConfigRegistrar.Register(IocManager);
        }

        public override void Initialize() =>
            IocManager.RegisterAssemblyByConvention(typeof(RealtyAmazonS3Module).GetAssembly());
    }
}
