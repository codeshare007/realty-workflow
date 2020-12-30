using Abp.Domain.Entities;

namespace Realty.Storage
{
    public class UploadFileResult: Entity<string>
    {
        public UploadFileResult()
        {
        }
        
        public string Path { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }
    }
}
