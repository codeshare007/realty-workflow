using System;
using Abp.Dependency;

namespace Realty.Core.Dependency
{
    public static class DependencyResolver
    {
        public static IIocManager IocManager => ApplicationBootstrapper.AbpBootstrapper.IocManager;

        public static T Resolve<T>()
        {
            return ApplicationBootstrapper.AbpBootstrapper.IocManager.Resolve<T>();
        }

        public static object Resolve(Type type)
        {
            try
            {
                return ApplicationBootstrapper.AbpBootstrapper.IocManager.Resolve(type);

            }
            catch (System.Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}