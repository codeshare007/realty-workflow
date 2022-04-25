using System.Threading.Tasks;
using Abp.Dependency;

namespace Realty.Storage
{
    public interface IStoragePathResolver: ITransientDependency
    {
        Task<string> GetPathFor(IHaveFiles entity);
    }
}
