using Abp.Dependency;
using Castle.MicroKernel.Registration;

namespace Realty.Common
{
    /// <summary>
    /// Registers domain strategies by convention.
    /// </summary>
    /// <seealso cref="Abp.Dependency.IConventionalDependencyRegistrar" />
    public class StrategyRegistrar : IConventionalDependencyRegistrar
    {
        public void RegisterAssembly(IConventionalRegistrationContext context)
        {
            context.IocManager.IocContainer.Register(
                Classes.FromAssembly(context.Assembly)
                    .IncludeNonPublicTypes()
                    .BasedOn<IDomainStrategy>()
                    .WithService.AllInterfaces()
                    .LifestyleTransient()
            );
        }
    }
}