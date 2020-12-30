using System.Collections.Generic;
using Abp.MultiTenancy;

namespace Realty.DashboardCustomization.Definitions
{
    public class WidgetDefinition
    {
        public string Id { get; }

        public string Name { get; }

        public MultiTenancySides Side { get; }

        public List<string> Permissions { get; }

        public List<string> UsedWidgetFilters { get; }

        public string Description { get; }

        public WidgetDefinition(
            string id,
            string name,
            MultiTenancySides side = MultiTenancySides.Tenant | MultiTenancySides.Host,
            List<string> usedWidgetFilters = null,
            List<string> permissions = null,
            string description = null)
        {
            Id = id;
            Name = name;
            Side = side;
            Permissions = permissions ?? new List<string>();
            UsedWidgetFilters = usedWidgetFilters;
            Description = description;
        }
    }
}
