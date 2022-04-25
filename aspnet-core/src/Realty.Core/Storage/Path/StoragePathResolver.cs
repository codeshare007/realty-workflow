using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Realty.MultiTenancy;
using Realty.Storage.Path.FolderResolver;

namespace Realty.Storage.Path
{
    public class StoragePathResolver: IStoragePathResolver
    {
        private readonly IFolderResolverFactory _folderResolverFactory;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public StoragePathResolver(
            IFolderResolverFactory folderResolverFactory, 
            IRepository<Tenant> tenantRepository, 
            IUnitOfWorkManager unitOfWorkManager)
        {
            _folderResolverFactory = folderResolverFactory;
            _tenantRepository = tenantRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task<string> GetPathFor(IHaveFiles entity)
        {
            using (_unitOfWorkManager.Current.SetTenantId(null))
            {
                var tenant = await _tenantRepository.GetAsync(entity.TenantId);
                var folderStrategy = _folderResolverFactory.GetStrategyFor(entity);

                return $"{tenant.TenancyName}/{folderStrategy.GetPath()}/";
            }
        }
    }
}
