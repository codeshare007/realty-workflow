namespace Realty.Web.DashboardCustomization
{
    public class WidgetViewDefinition : ViewDefinition
    {
        public byte DefaultWidth { get; }

        public byte DefaultHeight { get; }

        public WidgetViewDefinition(
            string id,
            string viewFile,
            string javascriptFile = null,
            string cssFile = null,
            byte defaultWidth = 12,
            byte defaultHeight = 10) : base(id, viewFile, javascriptFile, cssFile)
        {
            DefaultWidth = defaultWidth;
            DefaultHeight = defaultHeight;
        }
    }
}
