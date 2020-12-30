using Abp.Runtime.Validation;
using Realty.Dto;
using System;

namespace Realty.RecommendedListings.Input
{
    public class GetRecommendedListingsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public string Filter { get; set; }

        public Guid LeadId { get; set; }
        
        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "DisplayOrder";
            }

            Filter = Filter?.Trim();
        }
    }
}
