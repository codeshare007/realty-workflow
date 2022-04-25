using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Abp;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.AspNetZeroCore.Net;
using Abp.Domain.Uow;
using Abp.Runtime.Session;
using IronPdf;
using Realty.Libraries;
using Realty.Pages;
using Realty.Signings;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.Forms.Jobs
{
    internal class FormRefreshPageFilesBackgroundJob : 
        AsyncBackgroundJob<FormRefreshPageFilesBackgroundJobArgs>, 
        ITransientDependency
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IAbpSession _session;
        
        public FormRefreshPageFilesBackgroundJob(
            IRepository<Transaction, Guid> transactionRepository, 
            IRepository<Signing, Guid> signingRepository, 
            IRepository<Library, Guid> libraryRepository,
            IFileStorageService fileStorageService,
            IAbpSession session)
        {
            _transactionRepository = transactionRepository;
            _signingRepository = signingRepository;
            _libraryRepository = libraryRepository;
            _fileStorageService = fileStorageService;
            _session = session;
        }

        [UnitOfWork]
        protected override async Task ExecuteAsync(FormRefreshPageFilesBackgroundJobArgs args)
        {
            var entity = await GetEntityAsync(Type.GetType(args.ParentType), args.ParentId);
            var form = GetFormAsync(entity, args.FormId);
            Check.NotNull(form.File, nameof(form.File));

            if (form.File.ContentType != MediaTypeNames.Application.Pdf)
            {
                throw new ArgumentOutOfRangeException(nameof(form.File.ContentType));
            }
            
            entity.SetProcessing(form);
            await UpdateEntityAsync(entity);
            await CurrentUnitOfWork.SaveChangesAsync();
            
            var result = await _fileStorageService.GetFile(form.File.Id);

            var pdfDocument = new PdfDocument(result.Item1);
            var bitmaps = pdfDocument.ToBitmap(DPI: 150);

            using (CurrentUnitOfWork.SetTenantId(form.TenantId))
            using (_session.Use(form.TenantId, form.CreatorUserId))
            {
                for (var pageIndex = 0; pageIndex < bitmaps.Length; ++pageIndex)
                {
                    var image = await BitmapToBytes(bitmaps[pageIndex], ImageFormat.Png);
                    var file = await GetFile(entity, form.Id.ToString("N"), pageIndex, image);
                    form.Pages
                        .Where(p => p.Number == pageIndex)
                        .FirstOrDefault()
                        .UpdateFile(file);
                }

                entity.SetReady(form);
                await UpdateEntityAsync(entity);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }

        private async Task<IHaveForms> GetEntityAsync(Type type, Guid id)
        {
            return type switch
            {
                Type _ when type == typeof(Library) => await _libraryRepository.GetAsync(id),
                Type _ when type == typeof(Transaction) => await _transactionRepository.GetAsync(id),
                Type _ when type == typeof(Signing) => await _signingRepository.GetAsync(id),
                _ => throw new ArgumentOutOfRangeException(nameof(type))
            };
        }

        private static Form GetFormAsync(IHaveForms entity, Guid formId)
        {
            return entity.Forms.First(f => f.Id == formId);
        }

        private async Task UpdateEntityAsync(IHaveForms entity)
        {
            switch (entity)
            {
                case Library library:
                    await _libraryRepository.UpdateAsync(library);
                    break;
                case Transaction transaction:
                    await _transactionRepository.UpdateAsync(transaction);
                    break;
                case Signing signing:
                    await _signingRepository.UpdateAsync(signing);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(entity));
            }
        }

        private async Task<Storage.File> GetFile(IHaveFiles parent, string formId, int pageIndex, byte[] bytes)
        {
            var fileName = $"{formId}_page_{pageIndex}.png";
            var contentType = MimeTypeNames.ImagePng;
            return await _fileStorageService.UploadFileFor(parent, fileName, contentType, bytes);
        }

        private async Task<byte[]> BitmapToBytes(Bitmap bitmap, ImageFormat outputFormat)
        {
            byte[] imageBytes;
            await using var stream = new MemoryStream();
            bitmap.Save(stream, outputFormat);
            imageBytes = stream.ToArray();
            stream.Close();

            return imageBytes;
        }
    }
}
