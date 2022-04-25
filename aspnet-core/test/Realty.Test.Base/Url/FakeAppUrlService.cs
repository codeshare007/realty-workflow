using Realty.Url;

namespace Realty.Test.Base.Url
{
    public class FakeAppUrlService : IAppUrlService
    {
        public string CreateEmailActivationUrlFormat(int? tenantId)
        {
            return "http://test.com/";
        }

        public string CreatePasswordResetUrlFormat(int? tenantId)
        {
            return "http://test.com/";
        }

        public string CreateEmailActivationUrlFormat(string tenancyName)
        {
            return "http://test.com/";
        }

        public string CreatePasswordResetUrlFormat(string tenancyName)
        {
            return "http://test.com/";
        }

        public string CreateSigningReviewUrlFormat(string tenancyName)
        {
            return "http://test.com/";
        }
    }
}
