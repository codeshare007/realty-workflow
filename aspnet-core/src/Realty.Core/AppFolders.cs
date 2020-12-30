using Abp.Dependency;

namespace Realty
{
    public class AppFolders : IAppFolders, ISingletonDependency
    {
        public string SampleProfileImagesFolder { get; set; }

        public string WebLogsFolder { get; set; }

        public string LocalDocumentsFolder { get; set; }
    }
}