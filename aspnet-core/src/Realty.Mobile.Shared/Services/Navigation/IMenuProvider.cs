using System.Collections.Generic;
using MvvmHelpers;
using Realty.Models.NavigationMenu;

namespace Realty.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}