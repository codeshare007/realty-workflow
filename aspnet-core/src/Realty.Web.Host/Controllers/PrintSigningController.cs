using System;
using Abp.Linq.Extensions;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Realty.Authorization;
using Realty.Configuration;
using Realty.Signings;
using Realty.Signings.Dto;
using Shark.PdfConvert;
using Microsoft.EntityFrameworkCore;
using Realty.Forms.Dto;
using Realty.Contacts.Dto;
using Realty.Transactions;

namespace Realty.Web.Controllers
{
    public class PrintSigningController : RealtyControllerBase
    {
        private readonly ICacheManager _cacheManager;
        private const string SIGNING_SUMMARY_CACHE = "SIGNING_SUMMARY_CACHE";
        private readonly IConfigurationRoot _appConfiguration;
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<Libraries.Library, Guid> _libraryRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        public readonly IAbpSession _abpSession;

        public PrintSigningController(
            ICacheManager cacheManager,
            IAppConfigurationAccessor configurationAccessor,
            IRepository<Signing, Guid> signingRepository,
            IAbpSession abpSession,
            IRepository<Libraries.Library, Guid> libraryRepository, 
            IRepository<Transaction, Guid> transactionRepository)
        {
            _cacheManager = cacheManager;
            this._appConfiguration = configurationAccessor.Configuration;
            _signingRepository = signingRepository;
            _abpSession = abpSession;
            _libraryRepository = libraryRepository;
            _transactionRepository = transactionRepository;
        }

        [IgnoreAntiforgeryToken]
        [AbpAuthorize(AppPermissions.Pages_Transactions)]
        public async Task<IActionResult> PrintTransactionForm(Guid id, Guid formId)
        {
            var form = await _transactionRepository
                .GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Transactions_AccessAll),
                    l => l.AgentId == _abpSession.UserId)
                .Where(l => l.Id == id)
                .Include(l => l.Forms)
                .SelectMany(l => l.Forms)
                .FirstOrDefaultAsync(l => l.Id == formId);

            var formDto = new FormEditDto[] { ObjectMapper.Map<FormEditDto>(form) };
            var printForm = new SigningFormEditDto(form.Id, form.Name, formDto, new ContactListDto[0]);

            if (printForm != null)
            {
                return ExecutePrint(printForm);
            }

            return null;
        }

        [IgnoreAntiforgeryToken]
        [AbpAuthorize(AppPermissions.Pages_Library_Forms)]
        public async Task<IActionResult> PrintLibraryForm(Guid id)
        {
            var form = await _libraryRepository.GetAll()
                .Where(l => l.Forms.Any(f => f.Id == id))
                .Include(l => l.Forms)
                .SelectMany(l => l.Forms)
                .FirstOrDefaultAsync(l => l.Id == id);

            var formDto = new FormEditDto[] { ObjectMapper.Map<FormEditDto>(form) };
            var printForm = new SigningFormEditDto(form.Id, form.Name, formDto, new ContactListDto[0]);

            if (printForm != null)
            {
                return ExecutePrint(printForm);
            }

            return null;
        }

        [IgnoreAntiforgeryToken]
        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<IActionResult> PrintSigning(Guid id)
        {
            var signing = await _signingRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll),
                    l => l.AgentId == _abpSession.UserId)
                .FirstOrDefaultAsync(s => s.Id == id);

            var formDto = signing.Forms
                .Select(form => ObjectMapper.Map<FormEditDto>(form))
                .ToArray();

            var participantDto = signing
                .Participants
                .Select(participant => ObjectMapper.Map<ContactListDto>(participant))
                .ToArray();

            var signingForm = new SigningFormEditDto(signing.Id, signing.Name, formDto, participantDto);

            if (signingForm != null)
            {
                return ExecutePrint(signingForm);
            }

            return null;
        }

        public ViewResult PrintForms(Guid id)
        {
            var signingForms = _cacheManager
                .GetCache(SIGNING_SUMMARY_CACHE)
                .GetOrDefault<string, SigningFormEditDto>(id.ToString("N"));

            ViewBag.ServerRootAddress = (_appConfiguration["App:ServerRootAddress"] ?? "http://localhost:4300/").EnsureEndsWith('/').Replace("{TENANCY_NAME}.", string.Empty);

            return View(signingForms);
        }



        private IActionResult ExecutePrint(SigningFormEditDto form)
        {
            if (form != null)
            {
                var newCacheKey = Guid.NewGuid();
                _cacheManager
                    .GetCache(SIGNING_SUMMARY_CACHE)
                    .Set(newCacheKey.ToString("N"), form);

                var pdfTempFolder = _appConfiguration["App:PdfTempFolder"] ?? "C:\\temp\\";
                var baseUrl = (_appConfiguration["App:ServerRootAddress"] ?? "http://localhost:22745/").EnsureEndsWith('/').Replace("{TENANCY_NAME}.", string.Empty);

                var fileName = $"{pdfTempFolder}{form.Id.ToString("N")}\\{form.Name}.pdf";
                var directory = new DirectoryInfo($"{pdfTempFolder}{form.Id.ToString("N")}");
                if (!directory.Exists)
                {
                    directory.Create();
                }

                PdfConvert.Convert(new PdfConversionSettings
                {
                    Title = "Realty Workflow Signature",
                    Margins = new PdfPageMargins() { Bottom = 0, Left = 0, Right = 0, Top = 0 },
                    Orientation = PdfPageOrientation.Portrait,
                    Size = PdfPageSize.A4,
                    ContentUrl = $"{baseUrl}Printsigning/PrintForms?id={newCacheKey}",
                    OutputPath = fileName
                });

                byte[] fileBytes = System.IO.File.ReadAllBytes(fileName);

                return File(fileBytes, "application/pdf", fileName.Substring(fileName.LastIndexOf('\\') + 1));
            }

            return null;
        }
    }
}
