using System.IO;
using System.Linq;
using Abp;
using Abp.Dependency;
using Abp.UI;
using Castle.Core.Logging;
using Microsoft.AspNetCore.Hosting;
using Realty.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Realty.Web.Configuration
{
    public class AppConfigurationWriter : IAppConfigurationWriter, ISingletonDependency
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ILogger Logger { get; set; }

        public AppConfigurationWriter(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            Logger = NullLogger.Instance;
        }

        public void Write(string key, string value)
        {
            if (!File.Exists("appsettings.json"))
            {
                throw new UserFriendlyException("appsettings.json file does not exist");
            }
            Writenternal("appsettings.json", key, value);

            if (File.Exists($"appsettings.{_webHostEnvironment.EnvironmentName}.json"))
            {
                Writenternal($"appsettings.{_webHostEnvironment.EnvironmentName}.json", key, value);
            }
        }

        protected virtual void Writenternal(string filename, string key, string value)
        {
            Check.NotNullOrWhiteSpace(key, nameof(key));
            Check.NotNull(value, nameof(value));

            var jsonFile = JObject.Parse(File.ReadAllText(filename));

            var objectNames = key.Split(":").ToList();
            if (objectNames.Count == 1)
            {
                objectNames.Clear();
            }
            else
            {
                key = objectNames.Last();
                objectNames.RemoveAt(objectNames.Count - 1);
            }

            var jobj = jsonFile;

            foreach (var objectName in objectNames)
            {
                jobj = (JObject) jobj[objectName];
                if (jobj == null)
                {
                    Logger.Error($"Key {key} does not exist!");
                    return;
                }
            }

            var jProperty = jobj.Property(key);
            if (jProperty == null)
            {
                Logger.Error($"Key {key} does not exist!");
                return;
            }

            jProperty.Value.Replace(value);

            using (var file = File.CreateText(filename))
            {
                using (var writer = new JsonTextWriter(file))
                {
                    writer.Formatting = Formatting.Indented;
                    jsonFile.WriteTo(writer);
                }
            }
        }
    }
}
