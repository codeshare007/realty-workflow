using System.Linq;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureKeyVault;

namespace Realty.Configuration
{
    public class AppAzureKeyVaultConfigurer
    {
        public void Configure(IConfigurationBuilder builder, IConfigurationRoot config)
        {
            var azureKeyVaultConfiguration = config.GetSection("Configuration:AzureKeyVault").Get<AzureKeyVaultConfiguration>();

            if (azureKeyVaultConfiguration == null || !azureKeyVaultConfiguration.IsEnabled)
            {
                return;
            }

            var azureKeyVaultUrl = $"https://{azureKeyVaultConfiguration.KeyVaultName}.vault.azure.net/";

            if (azureKeyVaultConfiguration.UsesCertificate())
            {
                using (var store = new X509Store(StoreLocation.CurrentUser))
                {
                    store.Open(OpenFlags.ReadOnly);
                    var certs = store.Certificates.Find(
                        X509FindType.FindByThumbprint,
                        azureKeyVaultConfiguration.AzureADCertThumbprint,
                        false
                    );

                    builder.AddAzureKeyVault(
                        azureKeyVaultUrl,
                        azureKeyVaultConfiguration.AzureADApplicationId,
                        certs.OfType<X509Certificate2>().Single());

                    store.Close();
                }
            }
            else if (azureKeyVaultConfiguration.UsesManagedIdentity())
            {
                builder.AddAzureKeyVault(
                    azureKeyVaultUrl,
                    azureKeyVaultConfiguration.ClientId,
                    azureKeyVaultConfiguration.ClientSecret, new DefaultKeyVaultSecretManager());
            }
        }
    }
}
