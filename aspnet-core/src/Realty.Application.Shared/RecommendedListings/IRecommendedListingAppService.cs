using System;
using System.Collections.Generic;
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
        Task<Guid> CreateTransactionAsync(string name, Guid id);

        Task<List<RecommendedPublicListingDto>>GetPublicRecommendationListAsync(GetPublicRecommendationListInput input);
        Task<RecommendedPublicListingDto> GetPublicRecommendationAsync(GetPublicRecommendationInput input);
        Task RequestTourAsync(RequestTourInput input);
        Task AskQuestionAsync(AskQuestionInput input);
        Task<RecommendedListingDto> GetRecommendedListingAsync(GetRecommendedListingInput input);
        Task SendRecommendedListings(SendRecommendedListingsInput input);
    }
}
