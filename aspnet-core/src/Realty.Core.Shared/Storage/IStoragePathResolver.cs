using System.Threading.Tasks;
using Abp.Dependency;

namespace Realty.Storage
{
    public interface IStoragePathResolver: ITransientDependency
    {
        //Task<string> GetPath<T>(T entity) where T : IEntity<long>, IMustHaveTenant;
        Task<string> GetPath(int tenantId);
    }
}
