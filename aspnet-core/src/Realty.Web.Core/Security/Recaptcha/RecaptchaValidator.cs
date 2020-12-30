using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Json;
using Abp.UI;
using Microsoft.AspNetCore.Http;
using Realty.Security.Recaptcha;
using Owl.reCAPTCHA;
using Owl.reCAPTCHA.v3;

namespace Realty.Web.Security.Recaptcha
{
    public class RecaptchaValidator : RealtyServiceBase, IRecaptchaValidator, ITransientDependency
    {
        public const string RecaptchaResponseKey = "g-recaptcha-response";

        private readonly IreCAPTCHASiteVerifyV3 _reCAPTCHASiteVerifyV3;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RecaptchaValidator(IreCAPTCHASiteVerifyV3 reCAPTCHASiteVerifyV3, IHttpContextAccessor httpContextAccessor)
        {
            _reCAPTCHASiteVerifyV3 = reCAPTCHASiteVerifyV3;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task ValidateAsync(string captchaResponse)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                throw new Exception("RecaptchaValidator should be used in a valid HTTP context!");
            }

            if (captchaResponse.IsNullOrEmpty())
            {
                throw new UserFriendlyException(L("CaptchaCanNotBeEmpty"));
            }

            var response = await _reCAPTCHASiteVerifyV3.Verify(new reCAPTCHASiteVerifyRequest
            {
                Response = captchaResponse,
                RemoteIp = _httpContextAccessor.HttpContext.Connection?.RemoteIpAddress?.ToString()
            });

            if (!response.Success || response.Score < 0.5)
            {
                Logger.Warn(response.ToJsonString());
                throw new UserFriendlyException(L("IncorrectCaptchaAnswer"));
            }
        }
    }
}
