using System.Threading.Tasks;
using Realty.Storage;

namespace Realty.AmazonS3.Api
{
    public interface IAmazonClient
    {
        Task<GetFileResult> GetFileAsync(GetFileRequest input);
        Task<UploadFileResult> UploadFileAsync(UploadFileRequest input);
        Task DeleteFileAsync(DeleteFileRequest input, bool suppressNotFound);
    }
}