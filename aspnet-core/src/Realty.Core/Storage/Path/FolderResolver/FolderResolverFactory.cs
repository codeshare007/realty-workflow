using Realty.Storage.Path.FolderResolver.Strategies;
using System.Linq;
using Abp.Domain.Entities;

namespace Realty.Storage.Path.FolderResolver
{
    public class FolderResolverFactory: IFolderResolverFactory
    {
        private readonly IFolderResolverStrategy[] _strategies;

        public FolderResolverFactory(IFolderResolverStrategy[] strategies)
        {
            _strategies = strategies;
        }

        public IFolderResolverStrategy GetStrategy(IEntity<long> entity)
        {
            return _strategies.FirstOrDefault(r => r.IsApplied(entity));
        }
    }
}
