using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Realty.Startup
{
    [DependsOn(typeof(RealtyCoreModule))]
    public class RealtyGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}