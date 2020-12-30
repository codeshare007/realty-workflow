using System.IO;
using System.Net;
using System.Threading.Tasks;
using Abp.Timing;
using Amazon;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;
using Realty.AmazonS3.Configuration;
using Realty.Storage;

namespace Realty.AmazonS3.Api
{
    public class AmazonClient: IAmazonClient
    {
        private readonly IAmazonS3 _client;
        private readonly string _bucketName;

        public AmazonClient(AmazonS3ClientConfig config)
        {
            var chain = new CredentialProfileStoreChain();
            if (chain.TryGetAWSCredentials(config.Profile, out var credentials))
            {
                _client = new AmazonS3Client(credentials, RegionEndpoint.GetBySystemName(config.Region));
            }

            _bucketName = config.Bucket;
        }

        public async Task<UploadFileResult> UploadFileAsync(UploadFileRequest input)
        {
            var extension = Path.GetExtension(input.Name);
            var newFileName = $"{Clock.Now:ddMMyyyyHHmmss}-{Path.GetFileNameWithoutExtension(input.Name)}.{extension}";
            var key = Path.Combine(input.Path, newFileName);

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                ContentType = input.ContentType,
                InputStream = input.Stream,
                CannedACL = S3CannedACL.Private,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.None,
                StorageClass = S3StorageClass.Standard
            };

            var response = await _client.PutObjectAsync(request);

            return new UploadFileResult
            {
                Name = newFileName,
                Id = response.ETag,
                Path = input.Path,
                ContentType = input.ContentType
            };
        }

        public async Task<GetFileResult> GetFileAsync(GetFileRequest input)
        {
            var key = Path.Combine(input.Path, input.Name);

            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                EtagToMatch = input.Id
            };

            try
            {
                var response = await _client.GetObjectAsync(request);
                MemoryStream stream;
                await using (stream = new MemoryStream())
                {
                    await response.ResponseStream.CopyToAsync(stream);
                    response.ResponseStream.Close();
                }
                return new GetFileResult(stream.ToArray());
            }
            catch (AmazonS3Exception ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                    throw new FileNotFoundException();
                throw;
            }
        }

        public async Task DeleteFileAsync(DeleteFileRequest input, bool suppressNotFound)
        {
            var key = Path.Combine(input.Path, input.Name);

            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            if (await Exists(key, input.Id, _bucketName))
            {
                await _client.DeleteObjectAsync(request);
            } else if (!suppressNotFound)
                throw new FileNotFoundException();
        }

        
        private async Task<bool> Exists(string key, string tag, string bucketName)
        {
            try
            {
                var request = new GetObjectMetadataRequest
                {
                    BucketName = bucketName,
                    Key = key,
                    EtagToMatch = tag
                };

                await _client.GetObjectMetadataAsync(request);
                return true;
            }

            catch (AmazonS3Exception ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                    return false;

                //status wasn't not found, so throw the exception
                throw;
            }
        }
    }
}
