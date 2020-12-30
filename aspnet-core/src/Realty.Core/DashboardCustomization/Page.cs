using System;
using System.Collections.Generic;

namespace Realty.DashboardCustomization
{
    public class Page
    {
        public string Id { get; set; }

        //Page name is not a localized string. because every user define their page with the page name they want
        public string Name { get; set; }

        public List<Widget> Widgets { get; set; }

        public Page()
        {
            Id = "Page" + Guid.NewGuid().ToString().Replace("-", "");
        }
    }
}
