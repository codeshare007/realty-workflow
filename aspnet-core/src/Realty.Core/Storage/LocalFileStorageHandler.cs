using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Timing;
using Newtonsoft.Json.Serialization;
using Realty.Storage.Exceptions;

namespace Realty.Storage
{
    public class LocalFileStorageHandler : IExternalStorageHandler
    {
        private readonly IAppFolders _appFolders;
        
        public LocalFileStorageHandler(IAppFolders appFolders)
        {
            _appFolders = appFolders;
            EnsureDocumentFolderExists();
        }

        public async Task<UploadFileResult> UploadFileAsync(UploadFileRequest request)
        {
            if (request.Stream == null || request.Stream.Length == 0) throw new ArgumentNullException(nameof(request.Stream));
            if (request.Path == null) throw new ArgumentNullException(nameof(request.Path));
            if (request.Path.IndexOf('/') < 0 || request.Path.LastIndexOf('/') == request.Path.Length)
                throw new ArgumentException($"Value of {nameof(request.Path)} is not valid.", nameof(request.Path));

            var folder = CreateFolder(request.Path);
            var key = $"{Clock.Now:ddMMyyyyHHmmss}-{request.Name}";

            await using (var stream = System.IO.File.Create(System.IO.Path.Combine(folder, key)))
            {
                await request.Stream.CopyToAsync(stream);
                stream.Flush();
            }

            return new UploadFileResult
            {
                Id = Guid.NewGuid().ToString("D"),
                Name = key,
                Path = folder,
                ContentType = request.ContentType
            };
        }

        public async Task DeleteFileAsync(DeleteFileRequest request, bool suppressNotFound = true)
        {
            var files = Directory.GetFiles(_appFolders.LocalDocumentsFolder, request.Name, SearchOption.AllDirectories);
            if (!files.Any())
            {
                if (!suppressNotFound) throw new FileNotFoundException("Requested file not found.");
            }

            System.IO.File.Delete(files.First());
        }

        public async Task<GetFileResult> GetFileAsync(GetFileRequest request)
        {
            var files = Directory.GetFiles(_appFolders.LocalDocumentsFolder, request.Name, SearchOption.AllDirectories);
            if (!files.Any()) throw new FileNotFoundException("Requested file not found.");
            MemoryStream memoryStream;
            await using (var fileStream = System.IO.File.OpenRead(files.First()))
            await using (memoryStream = new MemoryStream())
            {
                await fileStream.CopyToAsync(memoryStream);
            }
            return new GetFileResult(memoryStream.ToArray());;
        }

        private void EnsureDocumentFolderExists()
        {
            try
            {
                var directory = new DirectoryInfo(_appFolders.LocalDocumentsFolder);
                if (!directory.Exists)
                {
                    Directory.CreateDirectory(_appFolders.LocalDocumentsFolder);
                }
            }
            catch (Exception exception)
            {
                throw new StorageConnectionException(exception.Message);
            }
        }

        private string CreateFolder(string path)
        {
            if (string.IsNullOrEmpty(path))
                throw new ArgumentException("Path argument is null or not starts with /", nameof(path));

            var pathSplit = path.TrimStart('/').TrimEnd('/').Split('/');

            if (pathSplit.Any(i => string.IsNullOrEmpty(i.Trim())))
                throw new ArgumentException("Path argument is not valid.", nameof(path));

            var index = 0;
            var parentFolderPath = _appFolders.LocalDocumentsFolder;

            while (index < pathSplit.Length)
            {
                var newFolderPath = System.IO.Path.Combine(parentFolderPath, pathSplit[index]);
                if (!Directory.Exists(newFolderPath))
                {
                    Directory.CreateDirectory(newFolderPath);
                }
                parentFolderPath = newFolderPath;
                ++index;
            }
            return parentFolderPath;
        }
    }
}
