using Abp.Dependency;
using Castle.MicroKernel;
using Castle.MicroKernel.Registration;

namespace Realty.Common
{
    /// <summary>
    /// Registers handler selectors by convention.
    /// </summary>
    /// <seealso cref="Abp.Dependency.IConventionalDependencyRegistrar" />
    public class HandlerSelectorsRegistrar : IConventionalDependencyRegistrar
    {
        public void RegisterAssembly(IConventionalRegistrationContext context)
        {
            context.IocManager.IocContainer.Register(
                Classes.FromAssembly(context.Assembly)
                    .BasedOn<IHandlerSelector>()
                    .WithService.AllInterfaces()
                    .LifestyleTransient()
            );
        }
    }
}
