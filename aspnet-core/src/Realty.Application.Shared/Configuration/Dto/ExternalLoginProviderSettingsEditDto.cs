using System.Collections.Generic;
using Realty.Authentication;

namespace Realty.Configuration.Dto
{
    public class ExternalLoginProviderSettingsEditDto
    {
        public FacebookExternalLoginProviderSettings Facebook { get; set; }
        
        public GoogleExternalLoginProviderSettings Google { get; set; }
        
        public TwitterExternalLoginProviderSettings Twitter { get; set; }
        
        public MicrosoftExternalLoginProviderSettings Microsoft { get; set; }
        
        public OpenIdConnectExternalLoginProviderSettings OpenIdConnect { get; set; }
        
        public List<JsonClaimMapDto> OpenIdConnectClaimsMapping { get; set; }
        
        public WsFederationExternalLoginProviderSettings WsFederation { get; set; }
        
        public List<JsonClaimMapDto> WsFederationClaimsMapping { get; set; }
    }
}
