using Abp.Extensions;

namespace Realty.Configuration
{
    public class AzureKeyVaultConfiguration
    {
        public bool IsEnabled { get; set; }

        public string KeyVaultName { get; set; }

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }

        public string AzureADApplicationId { get; set; }

        public string AzureADCertThumbprint { get; set; }

        public bool UsesCertificate()
        {
            return !AzureADApplicationId.IsNullOrEmpty() && !AzureADCertThumbprint.IsNullOrEmpty();
        }

        public bool UsesManagedIdentity()
        {
            return !ClientId.IsNullOrEmpty() && !ClientSecret.IsNullOrEmpty();
        }
    }
}