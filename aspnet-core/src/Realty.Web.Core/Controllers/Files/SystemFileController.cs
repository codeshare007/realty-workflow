using System;
using System.Net;
using System.Threading.Tasks;
using Abp.Auditing;
using Abp.Authorization;
using Microsoft.AspNetCore.Mvc;
using Realty.Dto;
using Realty.Storage;

namespace Realty.Web.Controllers.Files
{
    public class SystemFileController: RealtyControllerBase
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly IBinaryObjectManager _binaryObjectManager;

        public SystemFileController(
            ITempFileCacheManager tempFileCacheManager,
            IBinaryObjectManager binaryObjectManager, 
            IFileStorageService fileStorageService)
        {
            _tempFileCacheManager = tempFileCacheManager;
            _binaryObjectManager = binaryObjectManager;
            _fileStorageService = fileStorageService;
        }

        [DisableAuditing]
        public ActionResult DownloadTempFile(FileDto file)
        {
            var fileBytes = _tempFileCacheManager.GetFile(file.FileToken);
            if (fileBytes == null)
            {
                return NotFound(L("RequestedFileDoesNotExists"));
            }

            return File(fileBytes, file.FileType, file.FileName);
        }

        [DisableAuditing]
        public async Task<ActionResult> DownloadBinaryFile(Guid id, string contentType, string fileName)
        {
            var fileObject = await _binaryObjectManager.GetOrNullAsync(id);
            if (fileObject == null)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            return File(fileObject.Bytes, contentType, fileName);
        }


        public async Task<ActionResult> GetFileAsync(Guid id)
        {
            var result = await _fileStorageService.GetFile(id);
            var bytes = result.Item1;
            var file = result.Item2;
            if (file == null)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            return File(bytes, file.ContentType, file.Name);
        }
    }
}
