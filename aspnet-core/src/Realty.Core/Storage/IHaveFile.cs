using Abp.Domain.Entities;

namespace Realty.Storage
{
    public interface IHaveFile: IMustHaveTenant
    {
        File File { get; }
    }
}
