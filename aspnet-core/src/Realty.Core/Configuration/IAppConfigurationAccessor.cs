using Microsoft.Extensions.Configuration;

namespace Realty.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
