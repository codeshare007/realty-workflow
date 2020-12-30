using Realty.UiCustomization.Dto;

namespace Realty.Sessions.Dto
{
    public class GetCurrentLoginInformationsOutput
    {
        public UserLoginInfoDto User { get; set; }
        
        public UserLoginInfoDto ImpersonatorUser { get; set; }

        public TenantLoginInfoDto Tenant { get; set; }
        
        public TenantLoginInfoDto ImpersonatorTenant { get; set; }

        public ApplicationInfoDto Application { get; set; }

        public UiCustomizationSettingsDto Theme { get; set; }
    }
}