using Abp.Domain.Entities;
using Realty.Forms;

namespace Realty.Storage.Path.FolderResolver.Strategies
{
    public class FormFolderResolverStrategy: IFolderResolverStrategy
    {
        private Form _form;

        public bool IsApplied(IEntity<long> entity)
        {
            if (entity is Form form)
            {
                _form = form;
                return true;
            }

            return false;
        }

        public string GetPath()
        {
            return $"Forms/{_form.Id}";
        }
    }
}
