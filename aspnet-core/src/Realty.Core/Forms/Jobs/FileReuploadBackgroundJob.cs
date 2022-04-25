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
    internal class FileReuploadBackgroundJob : 
        AsyncBackgroundJob<FileReuploadBackgroundJobArgs>, 
        ITransientDependency
    {
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IRepository<Storage.File, Guid> _fileRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IBackgroundJobManager _jobManager;

        public FileReuploadBackgroundJob(
            IFileStorageService fileStorageService,
            IRepository<Storage.File, Guid> fileRepository, 
            IRepository<Transaction, Guid> transactionRepository, 
            IRepository<Signing, Guid> signingRepository, 
            IRepository<Library, Guid> libraryRepository, 
            IBackgroundJobManager jobManager)
        {
            _fileStorageService = fileStorageService;
            _fileRepository = fileRepository;
            _transactionRepository = transactionRepository;
            _signingRepository = signingRepository;
            _libraryRepository = libraryRepository;
            _jobManager = jobManager;
        }

        [UnitOfWork]
        protected override async Task ExecuteAsync(FileReuploadBackgroundJobArgs args)
        {
            var entity = await GetEntityAsync(Type.GetType(args.ParentType), args.ParentId);
            
            var fileInfo = await _fileStorageService.GetFile(args.FileId);
            Check.NotNull(fileInfo, nameof(fileInfo));
            var file = fileInfo.Item2;
            
            var result = await _fileStorageService.Upload(entity, file.Name, file.ContentType, fileInfo.Item1);
            file.Update(result);

            await UpdateEntityAsync(file);
            await CurrentUnitOfWork.SaveChangesAsync();
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

        private async Task UpdateEntityAsync(Storage.File entity)
        {
            await _fileRepository.UpdateAsync(entity);
        }
    }
}
