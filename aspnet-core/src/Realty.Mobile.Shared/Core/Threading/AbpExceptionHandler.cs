using System.Net;
using System.Threading.Tasks;
using Abp.Web.Models;
using Acr.UserDialogs;
using Castle.Core.Internal;
using Flurl.Http;
using Realty.ApiClient;
using Realty.Core.Dependency;
using Realty.Extensions;
using Realty.Localization;

namespace Realty.Core.Threading
{
    public class AbpExceptionHandler
    {
        public async Task<bool> HandleIfAbpResponseAsync(FlurlHttpException httpException)
        {
            AjaxResponse ajaxResponse = await httpException.GetResponseJsonAsync<AjaxResponse>();
            if (ajaxResponse == null)
            {
                return false;
            }

            if (!ajaxResponse.__abp)
            {
                return false;
            }

            if (ajaxResponse.Error == null)
            {
                return false;
            }

            if (IsUnauthroizedResponseForSessionTimoutCase(httpException, ajaxResponse))
            {
                return true;
            }

            UserDialogs.Instance.HideLoading();


            if (string.IsNullOrEmpty(ajaxResponse.Error.Details))
            {
                UserDialogs.Instance.Alert(ajaxResponse.Error.GetConsolidatedMessage(), L.Localize("Error"));
            }
            else
            {
                UserDialogs.Instance.Alert(ajaxResponse.Error.Details, ajaxResponse.Error.GetConsolidatedMessage());
            }

            return true;
        }

        /// <summary>
        /// AuthenticationHttpHandler handles unauthorized responses and reauthenticates if there's a valid refresh token.
        /// When the refresh token expires, the application logsout and forces user to re-enter credentials
        /// That's why the last unauthorized exception can be suspended.
        /// </summary>
        private static bool IsUnauthroizedResponseForSessionTimoutCase(FlurlHttpException httpException, AjaxResponse ajaxResponse)
        {
            if (httpException.Call.Response.StatusCode != HttpStatusCode.Unauthorized)
            {
                return false;
            }

            var accessTokenManager = DependencyResolver.Resolve<IAccessTokenManager>();
            var appContext = DependencyResolver.Resolve<IApplicationContext>();

            var errorMsg = appContext.Configuration.Localization.Localize("CurrentUserDidNotLoginToTheApplication", "Abp");

            if (accessTokenManager.IsUserLoggedIn)
            {
                return false;
            }

            if (!ajaxResponse.Error.Message.EqualsText(errorMsg))
            {
                return false;
            }

            return true;
        }
    }
}