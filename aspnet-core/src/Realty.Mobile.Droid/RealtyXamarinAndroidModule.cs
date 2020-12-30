using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty
{
    [DependsOn(typeof(RealtyXamarinSharedModule))]
    public class RealtyXamarinAndroidModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyXamarinAndroidModule).GetAssembly());
        }
    }
}