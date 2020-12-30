using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Abp;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Auditing;
using Abp.UI;
using Abp.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Realty.Dto;
using Realty.Storage;
using Realty.Web.Helpers;

namespace Realty.Web.Controllers
{
    [AbpMvcAuthorize]
    public class FileController : RealtyControllerBase
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly IFileStorageService _fileStorageService;
        private readonly StorageExceptionHandler _exceptionHandler;

        public FileController(
            ITempFileCacheManager tempFileCacheManager,
            IBinaryObjectManager binaryObjectManager, IFileStorageService fileStorageService, StorageExceptionHandler exceptionHandler)
        {
            _tempFileCacheManager = tempFileCacheManager;
            _binaryObjectManager = binaryObjectManager;
            _fileStorageService = fileStorageService;
            _exceptionHandler = exceptionHandler;
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

        [HttpPost]
        public async Task<JsonResult> UploadFileAsync()
        {
            var file = Request.Form.Files.First();
            ValidateFile(file);

            byte[] bytes;

            await using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                bytes = stream.ToArray();
            }

            Check.NotNull(AbpSession.TenantId, nameof(AbpSession.TenantId));
            Debug.Assert(AbpSession.TenantId != null, "AbpSession.TenantId != null");

            var result = await _fileStorageService.UploadFile(AbpSession.TenantId.Value, file.FileName, file.ContentType, bytes);

            return Json(new AjaxResponse(new
            {
                id = result.Id,
                fileName = result.Name
            }));
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

        public async Task DeleteFileAsync(Guid fileId)
        {
            try
            {
                await _fileStorageService.DeleteFile(fileId);
            }
            catch (FileNotFoundException exception)
            {
                _exceptionHandler.Process(exception);
            }
        }

        private void ValidateFile(IFormFile file)
        {
            if (file == null)
            {
                throw new UserFriendlyException(L("File_Empty_Error"));
            }

            if (file.Length > 10485760) //10MB
            {
                throw new UserFriendlyException(L("File_SizeLimit_Error"));
            }

            if (!FileFormatHelper.IsPdfContentType(file))
            {
                throw new UserFriendlyException(L("File_Invalid_Type_Error"));
            }
        }
    }
}