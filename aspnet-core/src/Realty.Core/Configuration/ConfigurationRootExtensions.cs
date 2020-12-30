using Microsoft.Extensions.Configuration;

namespace Realty.Configuration
{
    public static class ConfigurationRootExtensions
    {
        public static string GetFromSettings(this IConfigurationRoot configuration,
            string name,
            string defaultValue = null) =>
            GetFromSettings<string>(configuration, name, defaultValue);

        public static T GetFromSettings<T>(this IConfigurationRoot configuration,
            string name,
            T defaultValue = default(T)) =>
            configuration.GetValue(NormalizeName(name), defaultValue);

        private static string NormalizeName(string name) => name.Replace(oldChar: '.', newChar: ':');
    }
}
