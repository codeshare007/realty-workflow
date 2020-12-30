using System;
using System.IO;
using System.Threading.Tasks;
using Abp;
using Abp.Domain.Repositories;

namespace Realty.Storage
{
    public class FileStorageService: RealtyDomainServiceBase, IFileStorageService
    {
        private readonly IExternalStorageHandler _storageHandler;
        private readonly IStoragePathResolver _storagePathResolver;
        private readonly IRepository<File, Guid> _fileRepository;

        public FileStorageService(
            IStoragePathResolver storagePathResolver,
            IExternalStorageHandler storageHandler, 
            IRepository<File, Guid> fileRepository)
        {
            _storagePathResolver = storagePathResolver;
            _storageHandler = storageHandler;
            _fileRepository = fileRepository;
        }

        public async Task<File> UploadFile(int tenantId, string fileName, string contentType, byte[] bytes)
        {
            Check.NotNull(bytes, nameof(bytes));
            Check.NotNullOrEmpty(fileName, nameof(fileName));

            var path = await _storagePathResolver.GetPath(tenantId);

            UploadFileResult response;
            await using (var memoryStream = new MemoryStream(bytes))
            {
                var input = new UploadFileRequest
                {
                    ContentType = contentType,
                    Path = path,
                    Name = fileName,
                    Stream = memoryStream
                };

                response = await _storageHandler.UploadFileAsync(input);
                memoryStream.Close();
            }

            var file = new File(response);
            
            await _fileRepository.InsertAsync(file);
            await UnitOfWorkManager.Current.SaveChangesAsync();

            return file;
        }

        public async Task DeleteFile(Guid fileId)
        {
            var file = await _fileRepository.GetAsync(fileId);
            if (file == null)
                throw new FileNotFoundException("Storage item with specified Id was not found.");

            var input = new DeleteFileRequest
            {
                Id = file.ExternalId,
                Path = file.Path,
                Name = file.Name
            };
            
            await _storageHandler.DeleteFileAsync(input, true);
            await _fileRepository.DeleteAsync(file);
        }

        public async Task<Tuple<byte[], File>> GetFile(Guid fileId)
        {
            var file = await _fileRepository.GetAsync(fileId);
            if (file == null)
                throw new FileNotFoundException("Storage item with specified Id was not found.");

            var input = new GetFileRequest
            {
                Id = file.ExternalId,
                Path = file.Path,
                Name = file.Name
            };

            var result = await _storageHandler.GetFileAsync(input);
            return new Tuple<byte[], File>(result.Bytes, file);
        }
    }
}
