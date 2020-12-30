using Abp.Dependency;

namespace Realty.Web.Authentication.External
{
    public class ExternalLoginInfoManagerFactory : ITransientDependency
    {
        private readonly IIocManager _iocManager;

        public ExternalLoginInfoManagerFactory(IIocManager iocManager)
        {
            _iocManager = iocManager;
        }

        public IDisposableDependencyObjectWrapper<IExternalLoginInfoManager> GetExternalLoginInfoManager(string loginProvider)
        {
            if (loginProvider == "WsFederation")
            {
                return _iocManager.ResolveAsDisposable<WsFederationExternalLoginInfoManager>();
            }

            return _iocManager.ResolveAsDisposable<DefaultExternalLoginInfoManager>();
        }
    }
}