using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Realty.Dto;

namespace Realty.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
