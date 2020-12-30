using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty
{
    [DependsOn(typeof(RealtyCoreSharedModule))]
    public class RealtyApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyApplicationSharedModule).GetAssembly());
        }
    }
}