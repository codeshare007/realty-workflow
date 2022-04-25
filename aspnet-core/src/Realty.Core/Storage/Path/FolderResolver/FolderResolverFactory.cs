using Realty.Storage.Path.FolderResolver.Strategies;
using System.Linq;


namespace Realty.Storage.Path.FolderResolver
{
    public class FolderResolverFactory: IFolderResolverFactory
    {
        private readonly IFolderResolverStrategy[] _strategies;

        public FolderResolverFactory(IFolderResolverStrategy[] strategies)
        {
            _strategies = strategies;
        }

        public IFolderResolverStrategy GetStrategyFor(IHaveFiles entity)
        {
            return _strategies.FirstOrDefault(r => r.IsApplied(entity));
        }
    }
}
