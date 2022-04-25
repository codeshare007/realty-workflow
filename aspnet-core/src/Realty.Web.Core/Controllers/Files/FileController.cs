using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Abp;
using Abp.UI;
using Abp.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Realty.Storage;
using Realty.Web.Helpers;

namespace Realty.Web.Controllers.Files
{
    public abstract class FileController : RealtyControllerBase
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly StorageExceptionHandler _exceptionHandler;
        
        protected FileController(
            IFileStorageService fileStorageService, 
            StorageExceptionHandler exceptionHandler
        )
        {
            _fileStorageService = fileStorageService;
            _exceptionHandler = exceptionHandler;
        }

        [HttpPost]
        public async Task<JsonResult> UploadFileAsync(Guid? entityId)
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

            if (!entityId.HasValue)
            {
                entityId = Guid.Parse(Request.Form["EntityId"].First());
            }

            var parent = await GetParentAsync(entityId.Value);
            if (parent == null)
            {
                throw new UserFriendlyException("User do not have access to upload file.");
            }

            var result = await _fileStorageService.UploadFileFor(parent, file.FileName, file.ContentType, bytes);

            return Json(new AjaxResponse(new
            {
                id = result.Id,
                fileName = result.Name
            }));
        }

        protected abstract Task<IHaveFiles> GetParentAsync(Guid entityId);

        public async Task DeleteFileAsync(Guid fileId)
        {
            try
            {
                var parent = await GetParentAsync(Guid.Parse(Request.Form["EntityId"].First()));
                if (parent == null)
                {
                    throw new UserFriendlyException("User do not have access to remove file.");
                }

                await _fileStorageService.DeleteFile(fileId);
            }
            catch (FileNotFoundException exception)
            {
                _exceptionHandler.Process(exception);
            }
        }

        protected virtual void ValidateFile(IFormFile file)
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