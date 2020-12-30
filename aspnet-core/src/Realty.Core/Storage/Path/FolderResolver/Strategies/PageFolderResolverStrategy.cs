using Abp.Domain.Entities;
using Realty.Pages;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public class PageFolderResolverStrategy: IFolderResolverStrategy
    {
        private Page _page;
        public bool IsApplied(IEntity<long> entity)
        {
            if (entity is Page formPage)
            {
                _page = formPage;
                return true;
            }

            return false;
        }

        public string GetPath()
        {
            return "";
            // Add virtual Form in Page.cs
            //return $"Forms/{_page.Form.Id}";
        }
    }
}
