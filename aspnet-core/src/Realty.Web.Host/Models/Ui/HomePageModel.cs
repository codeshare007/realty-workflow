using Realty.Sessions.Dto;

namespace Realty.Web.Models.Ui
{
    public class HomePageModel
    {
        public bool IsMultiTenancyEnabled { get; set; }

        public GetCurrentLoginInformationsOutput LoginInformation { get; set; }

        public string GetShownLoginName()
        {
            var userName = "<span id=\"HeaderCurrentUserName\">" + LoginInformation.User.UserName + "</span>";

            if (!IsMultiTenancyEnabled)
            {
                return userName;
            }

            return LoginInformation.Tenant == null
                ? "<span class='tenancy-name'>.\\</span>" + userName
                : "<span class='tenancy-name'>" + LoginInformation.Tenant.TenancyName + "\\" + "</span>" + userName;
        }
    }
}
