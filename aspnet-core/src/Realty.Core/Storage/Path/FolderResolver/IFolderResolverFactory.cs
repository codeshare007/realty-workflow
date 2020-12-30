using Abp.Dependency;
using Abp.Domain.Entities;
using Realty.Storage.Path.FolderResolver.Strategies;

namespace Realty.Storage.Path.FolderResolver
{
    public interface IFolderResolverFactory: ITransientDependency
    {
        IFolderResolverStrategy GetStrategy(IEntity<long> entity);
    }
}
