using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Abp.Dependency;
using MvvmHelpers;
using Realty.Localization;
using Realty.Models.NavigationMenu;
using Realty.Services.Permission;
using Realty.Views;

namespace Realty.Services.Navigation
{
    public class MenuProvider : ISingletonDependency, IMenuProvider
    {
        /* For more icons:
            https://material.io/icons/
        */
        private static IEnumerable<NavigationMenuItem> MenuItems => new Collection<NavigationMenuItem>
        {
            new NavigationMenuItem
            {
                Title = L.Localize("Tenants"),
                Icon = "Tenants.png",
                ViewType = typeof(TenantsView),
                RequiredPermissionName = PermissionKey.Tenants,
            },
            new NavigationMenuItem
            {
                Title = L.Localize("Users"),
                Icon = "UserList.png",
                ViewType = typeof(UsersView),
                RequiredPermissionName = PermissionKey.Users,
            },
            new NavigationMenuItem
            {
                Title = L.Localize("MySettings"),
                Icon = "Settings.png",
                ViewType = typeof(MySettingsView)
            }
            
            /*This is a sample menu item to guide how to add a new item.
                        ,new NavigationMenuItem
                        {
                            Title = "Sample View",
                            Icon = "MyIcon.png",
                            TargetType = typeof(_SampleView),
                            Order = 10
                        }
                    */
        };

        public ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions)
        {
            var authorizedMenuItems = new ObservableRangeCollection<NavigationMenuItem>();
            foreach (var menuItem in MenuItems)
            {
                if (menuItem.RequiredPermissionName == null)
                {
                    authorizedMenuItems.Add(menuItem);
                    continue;
                }

                if (grantedPermissions != null &&
                    grantedPermissions.ContainsKey(menuItem.RequiredPermissionName))
                {
                    authorizedMenuItems.Add(menuItem);
                }
            }

            return authorizedMenuItems;
        }
    }
}