using System.IO;

namespace Realty.Storage
{
    public class UploadFileRequest: FileRequest
    {
        public string ContentType { get; set; }

        public Stream Stream { get; set; }
    }
}
