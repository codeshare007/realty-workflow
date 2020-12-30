namespace Realty.DashboardCustomization.Definitions
{
    public class WidgetFilterDefinition
    {
        public string Id { get; }

        public string Name { get; }

        public WidgetFilterDefinition(
            string id,
            string name)
        {
            Id = id;
            Name = name;
        }
    }
}
