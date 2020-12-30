using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty
{
    public class RealtyCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyCoreSharedModule).GetAssembly());
        }
    }
}