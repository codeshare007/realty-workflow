namespace Realty.Debugging
{
    public static class DebugHelper
    {
        public static bool IsDebug
        {
            get
            {
#pragma warning disable
#if DEBUG
                return true;
#endif
                return false;
#pragma warning restore
            }
        }

        public static bool IsProduction
        {
            get
            {
#pragma warning disable
#if RELEASE
                return true;
#endif
                return false;
#pragma warning restore
            }
        }
    }
}
