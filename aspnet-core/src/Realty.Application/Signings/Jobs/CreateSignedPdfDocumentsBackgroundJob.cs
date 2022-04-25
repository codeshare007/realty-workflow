using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.ObjectMapping;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using Microsoft.Extensions.Configuration;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using PdfSharp.Pdf.Security;
using Realty.Configuration;
using Realty.Contacts.Dto;
using Realty.Forms.Dto;
using Realty.Forms.Jobs;
using Realty.Signings.Dto;
using Realty.Storage;
using Shark.PdfConvert;

namespace Realty.Signings.Jobs
{
    internal class CreateSignedPdfDocumentsBackgroundJob : 
        AsyncBackgroundJob<CreateSignedPdfDocumentsBackgroundJobArgs>, 
        ITransientDependency
    {
        private const string SIGNING_SUMMARY_CACHE = "SIGNING_SUMMARY_CACHE";

        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IAbpSession _session;
        private readonly ICacheManager _cacheManager;
        private readonly IConfigurationRoot _appConfiguration;
        private readonly IObjectMapper _objectMapper;

        public CreateSignedPdfDocumentsBackgroundJob(
            IRepository<Signing, Guid> signingRepository, 
            IFileStorageService fileStorageService,
            IAbpSession session, 
            ICacheManager cacheManager,
            IAppConfigurationAccessor configurationAccessor,
            IObjectMapper objectMapper, 
            IUnitOfWorkManager unitOfWorkManager)
        {
            _signingRepository = signingRepository;
            _fileStorageService = fileStorageService;
            _session = session;
            _cacheManager = cacheManager;
            this._appConfiguration = configurationAccessor.Configuration;
            _objectMapper = objectMapper;
        }

        [UnitOfWork]
        protected override async Task ExecuteAsync(CreateSignedPdfDocumentsBackgroundJobArgs args)
        {
            var signing = await _signingRepository.GetAsync(args.SigningId);

            using (UnitOfWorkManager.Current.SetTenantId(signing.TenantId))
            using (_session.Use(signing.TenantId, signing.CreatorUserId))
            {
                if (signing.SigningRequests.All(s => s.Status != SigningRequestStatus.Completed))
                {
                    throw new InvalidOperationException("Signing request status is out of range.");
                }

                var formDto = signing.Forms
                    .Select(form => _objectMapper.Map<FormEditDto>(form))
                    .ToArray();

                var participantDto = signing
                    .Participants
                    .Select(participant => _objectMapper.Map<ContactListDto>(participant))
                    .ToArray();

                var tempFiles = new List<string>();
                var pdfTempFolder = _appConfiguration["App:PdfTempFolder"] ?? "C:\\temp\\";
                var baseUrl = (_appConfiguration["App:ServerRootAddress"] ?? "http://localhost:22745/")
                    .EnsureEndsWith('/').Replace("{TENANCY_NAME}.", string.Empty);
                string fileNamePath = null;

                foreach (var form in signing.Forms)
                {
                    var signingForm = new SigningFormEditDto(signing.Id, signing.Name,
                        formDto.Where(f => f.Id == form.Id).ToArray(), participantDto);

                    var newCacheKey = Guid.NewGuid();
                    await _cacheManager
                        .GetCache(SIGNING_SUMMARY_CACHE)
                        .SetAsync(newCacheKey.ToString("N"), signingForm);

                    fileNamePath = $"{GetFilePath(form.Id, form.Name, pdfTempFolder)}.pdf";

                    PdfConvert.Convert(new PdfConversionSettings
                    {
                        Title = "Realty Workflow Signature",
                        Margins = new PdfPageMargins() {Bottom = 0, Left = 0, Right = 0, Top = 0},
                        Orientation = PdfPageOrientation.Portrait,
                        Size = PdfPageSize.A4,
                        ContentUrl = $"{baseUrl}Printsigning/PrintForms?id={newCacheKey}",
                        OutputPath = fileNamePath
                    });

                    tempFiles.Add(fileNamePath);

                    var signedFileName = $"{NormalizeFileName(form.Name)}-signed.pdf";

                    var signedFile = await UploadFile(signing, fileNamePath, signedFileName);
                    form.AddSignedFile(signedFile);
                }

                fileNamePath = $"{GetFilePath(signing.Id, signing.Name, pdfTempFolder)}-signed.pdf";

                using (PdfDocument outPdf = new PdfDocument())
                {
                    foreach (var file in tempFiles)
                    {
                        using (PdfDocument documentPdf = PdfReader.Open(file, PdfDocumentOpenMode.Import))
                        {
                            for (int i = 0; i < documentPdf.PageCount; i++)
                            {
                                outPdf.AddPage(documentPdf.Pages[i]);
                            }
                        }
                    }

                    PdfSecuritySettings securitySettings = outPdf.SecuritySettings;

                    // Setting one of the passwords automatically sets the security level to 
                    // PdfDocumentSecurityLevel.Encrypted128Bit.
                    securitySettings.UserPassword = "";
                    securitySettings.OwnerPassword = "s";

                    // Don't use 40 bit encryption unless needed for compatibility reasons
                    //securitySettings.DocumentSecurityLevel = PdfDocumentSecurityLevel.Encrypted40Bit;

                    // Restrict some rights.
                    securitySettings.PermitAccessibilityExtractContent = false;
                    securitySettings.PermitAnnotations = false;
                    securitySettings.PermitAssembleDocument = false;
                    securitySettings.PermitExtractContent = false;
                    securitySettings.PermitFormsFill = true;
                    securitySettings.PermitModifyDocument = true;
                    // securitySettings.PermitPrint = false;
                    // securitySettings.PermitFullQualityPrint = false;

                    outPdf.Save(fileNamePath);

                    tempFiles.Add(fileNamePath);
                }

                var signedFinalFile = await UploadFile(signing, fileNamePath, $"{NormalizeFileName(signing.Name)}-signed.pdf");
                signing.AddSignedFile(signedFinalFile);

                foreach (var file in tempFiles)
                {
                    System.IO.File.Delete(file);
                }

                await _signingRepository.UpdateAsync(signing);
                await UnitOfWorkManager.Current.SaveChangesAsync();
            }
        }

        private string NormalizeFileName(string fileName)
        {
            return fileName.Replace("/", "_").Replace(" ", "_").Replace(".", "_");
        }

        private string GetFilePath(Guid id, string fileName, string pdfTempFolder)
        {
            var directoryPath = $"{pdfTempFolder}{id.ToString("N")}";
            var directory = new DirectoryInfo(directoryPath);
            if (!directory.Exists)
            {
                directory.Create();
            }
            
            return $"{directoryPath}\\{NormalizeFileName(fileName)}";
        }

        protected async Task<Storage.File> UploadFile(Signing signing, string filePath, string fileName)
        {
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return await _fileStorageService.UploadFileFor(signing, fileName,
                "application/pdf", fileBytes);
        }
    }
}
