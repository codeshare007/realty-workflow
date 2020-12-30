using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Realty.Configure;
using Realty.Startup;
using Realty.Test.Base;

namespace Realty.GraphQL.Tests
{
    [DependsOn(
        typeof(RealtyGraphQLModule),
        typeof(RealtyTestBaseModule))]
    public class RealtyGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(RealtyGraphQLTestModule).GetAssembly());
        }
    }
}