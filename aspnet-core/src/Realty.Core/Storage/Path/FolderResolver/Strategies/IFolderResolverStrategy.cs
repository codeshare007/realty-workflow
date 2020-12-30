using Abp.Domain.Entities;
using Realty.Common;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public interface IFolderResolverStrategy: IDomainStrategy
    {
        bool IsApplied(IEntity<long> entity);
        string GetPath();
    }
}
