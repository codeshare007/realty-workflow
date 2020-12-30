namespace Realty.Configuration.Dto
{
    public class ThemeSubHeaderSettingsDto
    {
        public bool FixedSubHeader { get; set; }

        public string SubheaderStyle { get; set; }

        /// <summary>
        /// A value between 1-6
        /// </summary>
        public int SubheaderSize { get; set; }

        public string TitleStlye { get; set; }
        
        public string ContainerStyle { get; set; }

        public ThemeSubHeaderSettingsDto()
        {
            SubheaderSize = 2;
        }
    }
}
