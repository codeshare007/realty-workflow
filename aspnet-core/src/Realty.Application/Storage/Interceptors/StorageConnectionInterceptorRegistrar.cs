using System;
using Abp.Dependency;
using Castle.Core;
using Castle.MicroKernel;
using Realty.Libraries;

namespace Realty.Storage.Interceptors
{
    internal class StorageConnectionInterceptorRegistrar
    {
        public static void Initialize(IIocManager iocManager)
        {
            iocManager.IocContainer.Kernel.ComponentRegistered += Kernel_ComponentRegistered;
        }

        private static void Kernel_ComponentRegistered(string key, IHandler handler)
        {
            if (ShouldIntercept(handler.ComponentModel.Implementation))
            {
                handler.ComponentModel.Interceptors.AddFirst(new InterceptorReference(typeof(StorageConnectionInterceptor)));
            }
        }

        private static bool ShouldIntercept(Type type)
        {
            if (type == typeof(LibraryFormAppService))
            {
                return true;
            }

            return false;
        }
    }
}
