using Realty.Libraries;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public class LibraryFolderResolverStrategy: IFolderResolverStrategy
    {
        private Library _library;
        
        public bool IsApplied(IHaveFiles parent)
        {
            if (!(parent is Library library)) return false;
            _library = library;
            return true;
        }
        
        public string GetPath() => $"Libraries/{_library.Id}";
    }
}
