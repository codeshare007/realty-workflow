using Abp.Dependency;

namespace Realty.Signings
{
    public interface ISigningRequestValidatingFactory
    {
        SigningRequestValidatingService Create(Signing signing);
    }
}
