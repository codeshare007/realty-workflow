using System.Threading.Tasks;
using JetBrains.Annotations;

namespace Realty.Storage
{
    public interface IExternalStorageHandler
    {
        Task<GetFileResult> GetFileAsync([NotNull] GetFileRequest request);
        Task<UploadFileResult> UploadFileAsync([NotNull] UploadFileRequest request);
        Task DeleteFileAsync([NotNull] DeleteFileRequest request, bool suppressNotFound = true);
    }
}
