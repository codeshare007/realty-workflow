using Abp.Dependency;
using Realty.Common;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public interface IFolderResolverStrategy: IDomainStrategy, ITransientDependency
    {
        bool IsApplied(IHaveFiles entity);
        string GetPath();
    }
}
