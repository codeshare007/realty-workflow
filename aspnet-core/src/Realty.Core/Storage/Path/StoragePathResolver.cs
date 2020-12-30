using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Realty.MultiTenancy;
using Realty.Storage.Path.FolderResolver;

namespace Realty.Storage.Path
{
    public class StoragePathResolver: IStoragePathResolver, ITransientDependency
    {
        //private readonly IFolderResolverFactory _folderResolverFactory;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public StoragePathResolver(
            IFolderResolverFactory folderResolverFactory, 
            IRepository<Tenant> tenantRepository, 
            IUnitOfWorkManager unitOfWorkManager)
        {
            //_folderResolverFactory = folderResolverFactory;
            _tenantRepository = tenantRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task<string> GetPath(int tenantId)
        {
            using (_unitOfWorkManager.Current.SetTenantId(null))
            {
                var tenant = await _tenantRepository.GetAsync(tenantId);
                return $"{tenant.TenancyName}/";
            }
        }
    }
}
