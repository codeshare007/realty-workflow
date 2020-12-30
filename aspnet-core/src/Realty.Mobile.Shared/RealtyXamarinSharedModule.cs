using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty
{
    [DependsOn(typeof(RealtyClientModule), typeof(AbpAutoMapperModule))]
    public class RealtyXamarinSharedModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Localization.IsEnabled = false;
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyXamarinSharedModule).GetAssembly());
        }
    }
}