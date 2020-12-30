using Abp.Dependency;
using Castle.MicroKernel.Registration;

namespace Realty.AmazonS3.Configuration
{
    public class AmazonS3ClientConfigRegistrar
    {
        public static void Register(IIocManager iocManager) =>
            iocManager.IocContainer
                .Register(
                    new ComponentRegistration<AmazonS3ClientConfig>()
                        .UsingFactoryMethod(() => new AmazonS3ClientConfig())
                        .LifestyleSingleton()
                );
    }
}
