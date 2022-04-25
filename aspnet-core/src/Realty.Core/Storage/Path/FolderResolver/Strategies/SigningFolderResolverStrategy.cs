using Realty.Signings;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public class SigningFolderResolverStrategy: IFolderResolverStrategy
    {
        private Signing _signing;
        
        public bool IsApplied(IHaveFiles parent)
        {
            if (!(parent is Signing signing)) return false;
            _signing = signing;
            return true;
        }

        public string GetPath() => $"Signings/{_signing.Id}";
    }
}
