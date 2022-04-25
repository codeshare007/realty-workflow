using Abp.Dependency;
using Realty.Storage.Path.FolderResolver.Strategies;

namespace Realty.Storage.Path.FolderResolver
{
    public interface IFolderResolverFactory: ITransientDependency
    {
        IFolderResolverStrategy GetStrategyFor(IHaveFiles entity);
    }
}
