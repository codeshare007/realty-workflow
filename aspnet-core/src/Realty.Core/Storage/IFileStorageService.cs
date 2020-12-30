using System;
using System.Threading.Tasks;
using Abp.Domain.Services;

namespace Realty.Storage
{
    public interface IFileStorageService : IDomainService
    {
        Task<Tuple<byte[],File>> GetFile(Guid fileId);

        Task<File> UploadFile(int tenantId, string fileName, string contentType, byte[] bytes);
        
        Task DeleteFile(Guid fileId);
    }
}
