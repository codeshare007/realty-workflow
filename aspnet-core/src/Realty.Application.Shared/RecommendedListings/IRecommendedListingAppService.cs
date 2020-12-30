using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.RecommendedListings.Dto;
using Realty.RecommendedListings.Input;

namespace Realty.RecommendedListings
{
    public interface IRecommendedListingAppService : ITransientDependency
    {
        Task<PagedResultDto<RecommendedListingListDto>> GetListAsync(GetRecommendedListingsInput input);
        Task<bool> CreateAsync(CreateRecommendedListingInput input);
        Task<bool> MoveAsync(MoveRecommendedListingInput input);
        Task<bool> DeleteAsync(Guid id);
    }
}
