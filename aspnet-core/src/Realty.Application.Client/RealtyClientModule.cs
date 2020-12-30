using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty
{
    public class RealtyClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyClientModule).GetAssembly());
        }
    }
}
