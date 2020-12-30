using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty
{
    [DependsOn(typeof(RealtyXamarinSharedModule))]
    public class RealtyXamarinIosModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyXamarinIosModule).GetAssembly());
        }
    }
}