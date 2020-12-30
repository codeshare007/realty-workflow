using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Realty.AmazonS3.Api;
using Realty.AmazonS3.Helpers;
using Realty.Storage;

namespace Realty.AmazonS3
{
    public class AmazonS3StorageHandler: IExternalStorageHandler, ITransientDependency
    {
        private readonly IAmazonClient _amazonClient;
        
        public AmazonS3StorageHandler(IAmazonClient amazonClient) => _amazonClient = amazonClient;

        public async Task<UploadFileResult> UploadFileAsync(UploadFileRequest request)
        {
            if (FileHelper.IsStreamValid(request.Stream)) 
                throw new ArgumentException("Stream is not valid.");
            if (FileHelper.IsPathValid(request.Path))
                throw new ArgumentException($"Path '{request.Path}' is not valid.");

            return await _amazonClient.UploadFileAsync(request);
        }

        public async Task DeleteFileAsync(DeleteFileRequest request, bool suppressNotFound = true) =>
            await _amazonClient.DeleteFileAsync(request, suppressNotFound);

        public async Task<GetFileResult> GetFileAsync(GetFileRequest request) =>
            await _amazonClient.GetFileAsync(request);
    }
}
