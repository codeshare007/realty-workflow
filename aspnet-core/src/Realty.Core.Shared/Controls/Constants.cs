using static System.Int32;

namespace Realty.Controls
{
    public static class Constants
    {
        public const int TitleMaxLength = 256;
        public const int PlaceholderMaxLength = 256;
        public const int ValueMaxLength = 2048;

        public static class Position
        {
            public const int TopMinValue = 0;
            public const int TopMaxValue = MaxValue;

            public const int LeftMinValue = 0;
            public const int LeftMaxValue = MaxValue;
        }

        public static class Size
        {
            public const int WidthMinValue = 0;
            public const int WidthMaxValue = MaxValue;

            public const int HeightMinValue = 0;
            public const int HeightMaxValue = MaxValue;
        }

        public static class Font
        {
            public const int SizeMinValue = 1;
            public const int SizeMaxValue = 124;
        }

        public enum TextPositionType 
        {
            Center = 0,
            Left = 1,
            Right = 2
        }
    }
}
