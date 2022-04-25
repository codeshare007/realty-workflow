using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Facilities.TypedFactory;
using Castle.MicroKernel.Registration;
using Realty.Authorization;
using Realty.AutoMapping;
using Realty.Signings;
using Realty.Storage.Interceptors;

namespace Realty
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(RealtyApplicationSharedModule),
        typeof(RealtyCoreModule)
        )]
    public class RealtyApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);

            // Add document storage interceptor
            StorageConnectionInterceptorRegistrar.Initialize(Abp.Dependency.IocManager.Instance);

            IocManager.IocContainer.AddFacility<TypedFactoryFacility>();
            IocManager.IocContainer.Register(
                Component.For<ISigningRequestValidatingFactory>().AsFactory()
            );
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyApplicationModule).GetAssembly());
        }
    }
}