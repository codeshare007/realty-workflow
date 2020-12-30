using Abp.MultiTenancy;
using Realty.Url;

namespace Realty.Web.Url
{
    public class AngularAppUrlService : AppUrlServiceBase
    {
        public override string PublicSigningRoute => "signing";
        public override string EmailActivationRoute => "account/confirm-email";

        public override string PasswordResetRoute => "account/reset-password";

        public AngularAppUrlService(
                IWebUrlService webUrlService,
                ITenantCache tenantCache
            ) : base(
                webUrlService,
                tenantCache
            )
        {

        }
    }
}