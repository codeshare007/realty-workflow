using System;
using Abp.Dependency;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.UI;
using Realty.Signings.AccessRequests;
using Realty.Signings.Exceptions;

namespace Realty.Signings
{
    public class SigningRequestValidatingService: ITransientDependency
    {
        private readonly Signing _signing;
        
        public ILocalizationManager LocalizationManager { get; set; }

        public SigningRequestValidatingService(Signing signing)
        {
            _signing = signing;

            LocalizationManager = NullLocalizationManager.Instance;
        }

        public void Validate(AccessRequest request)
        {
            switch (request)
            {
                case ViewRequest viewRequest:
                    ValidateRequest(_signing, viewRequest);
                    break;
                case SigningRequest signingRequest:
                    ValidateRequest(_signing, signingRequest);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(request));
            }
        }

        private void ValidateRequest(Signing signing, SigningRequest request)
        {
            try
            {
                signing.IsRequestValid(request, silently: false);
            }
            catch (AccessRequestExpiredException)
            {
                throw new UserFriendlyException(L("SigningAccessRequestExpiredException"));
            }
            catch (SigningRequestCompletedException)
            {
                throw new UserFriendlyException(L("SigningRequestCompletedException"));
            }
            catch (SigningCompletedException)
            {
                throw new UserFriendlyException(L("SigningCompletedException"));
            }
        }

        private void ValidateRequest(Signing signing, ViewRequest request)
        {
            try
            {
                signing.IsRequestValid(request, silently: false);
            }
            catch (AccessRequestExpiredException)
            {
                throw new UserFriendlyException(L("SigningAccessRequestExpiredException"));
            }
            catch (SigningCompletedException)
            {
                throw new UserFriendlyException(L("SigningCompletedException"));
            }
        }

        private string L(string key)
        {
            return LocalizationManager.GetSource(RealtyConsts.LocalizationSourceName).GetString(key);
        }
    }
}
