namespace Realty.Communications
{
    public static class CommunicationSettingNames
    {
        public static class Imap
        {
            public const string IsEnabled = "App.User.Communications.Imap.IsEnabled";

            public const string Host = "App.User.Communications.Imap.Host";

            public const string Port = "App.User.Communications.Imap.Port";

            public const string Domain = "App.User.Communications.Imap.Domain";

            public const string UserName = "App.User.Communications.Imap.UserName";

            public const string Password = "App.User.Communications.Imap.Password";

            public const string EnableSsl = "App.User.Communications.Imap.EnableSsl";
        }

        public static class Smtp
        {
            public const string IsEnabled = "App.User.Communications.Smtp.IsEnabled";

            public const string Host = "App.User.Communications.Smtp.Host";

            public const string Port = "App.User.Communications.Smtp.Port";

            public const string UserName = "App.User.Communications.Smtp.UserName";

            public const string Password = "App.User.Communications.Smtp.Password";

            public const string Domain = "App.User.Communications.Smtp.Domain";

            public const string EnableSsl = "App.User.Communications.Smtp.EnableSsl";

            public const string UseDefaultCredentials = "App.User.Communications.Smtp.UseDefaultCredentials";
        }
    }
}
