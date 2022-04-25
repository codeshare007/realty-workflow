using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Abp;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Security;
using Abp.UI;
using Abp.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Realty.Signings;
using Realty.Signings.AccessRequests;
using Realty.Storage;

namespace Realty.Web.Controllers.Files
{
    [AbpMvcAuthorize]
    public class SigningFileController : FileController
    {
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<SigningRequest, Guid> _signingRequestRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly ISigningRequestValidatingFactory _signingRequestValidatingFactory;

        public SigningFileController(
            IFileStorageService fileStorageService, 
            StorageExceptionHandler exceptionHandler, 
            IRepository<Signing, Guid> repository,
            IRepository<SigningRequest, Guid> signingRequestRepository,
            ISigningRequestValidatingFactory signingRequestValidatingFactory
            ) : base(fileStorageService, exceptionHandler)
        {
            _signingRepository = repository;
            _signingRequestRepository = signingRequestRepository;
            _fileStorageService = fileStorageService;
            _signingRequestValidatingFactory = signingRequestValidatingFactory;
        }

        protected override async Task<IHaveFiles> GetParentAsync(Guid entityId)
        {
            //TODO: add check access to entity and check status
            return await _signingRepository.GetAsync(entityId);
        }

        [HttpPost]
        public async Task<JsonResult> UploadSigningRequestFileAsync()
        {
            var signingRequestCode = Request.Form["SigningRequestCode"].First();
            
            var parameters = SimpleStringCipher.Instance.Decrypt(signingRequestCode);
            var query = HttpUtility.ParseQueryString(parameters);
            
            Signing signing = null;
            if (query["id"] != null)
            {
                var requestId = Guid.Parse(query["id"]);
                var request = await _signingRequestRepository.GetAsync(requestId);
                Check.NotNull(request, nameof(request));

                signing = await _signingRepository
                    .GetAll()
                    .Where(s => s.Id == request.SigningId && s.Status != SigningStatus.Completed && s.Status != SigningStatus.Rejected)
                    .Include(s => s.Participants)
                    .FirstOrDefaultAsync();

                Check.NotNull(signing, nameof(signing));

                _signingRequestValidatingFactory.Create(signing).Validate(request);
            }
            Check.NotNull(signing, nameof(signing));

            using (AbpSession.Use(signing.TenantId, null))
            {
                return await UploadFileAsync(signing.Id);
            }
        }

        protected override void ValidateFile(IFormFile file)
        {
            if (file == null)
            {
                throw new UserFriendlyException(L("File_Empty_Error"));
            }

            if (file.Length > 50485760) //50MB
            {
                throw new UserFriendlyException(L("File_SizeLimit_Error"));
            }
        }
    }
}