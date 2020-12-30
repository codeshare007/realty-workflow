namespace Realty
{
    public interface IAppFolders
    {
        string SampleProfileImagesFolder { get; }

        string WebLogsFolder { get; set; }

        string LocalDocumentsFolder { get; set; }
    }
}