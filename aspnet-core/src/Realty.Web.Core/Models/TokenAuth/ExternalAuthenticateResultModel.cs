namespace Realty.Web.Models.TokenAuth
{
    public class ExternalAuthenticateResultModel
    {
        public string AccessToken { get; set; }

        public string EncryptedAccessToken { get; set; }

        public int ExpireInSeconds { get; set; }

        public bool WaitingForActivation { get; set; }

        public string ReturnUrl { get; set; }

        public string RefreshToken { get; set; }

        public int RefreshTokenExpireInSeconds { get; set; }
    }
}