namespace Realty.Url
{
    public interface IAppUrlService
    {
        string CreateEmailActivationUrlFormat(int? tenantId);

        string CreatePasswordResetUrlFormat(int? tenantId);

        string CreateEmailActivationUrlFormat(string tenancyName);

        string CreatePublicSigingUrlFormat(string tenancyName, long? participantId);

        string CreatePasswordResetUrlFormat(string tenancyName);
    }
}
