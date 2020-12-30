using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Realty.Common.Dto;
using Realty.Listings.Dto;
using Microsoft.EntityFrameworkCore;
using Abp.Extensions;
using System.Linq;

namespace Realty.Listings
{
    public class ListingAppService : RealtyAppServiceBase
    {
        private readonly IRepository<Listing, Guid> _listingRepository;
        public ListingAppService(IRepository<Listing, Guid> listingRepository)
        {
            _listingRepository = listingRepository;
        }

        [HttpPost]
        public async Task<ListingListResponse> GetListing(GetListingInput input)
        {
            ListingListResponse response = new ListingListResponse();
            var tenant = GetCurrentTenant();
            input.JglKey = tenant.JglKey;

            var jglResponse = await ListingManager.SearchListing(input);
            if (response != null)
            {
                if (jglResponse.Listings != null)
                {
                    response.Listing = ObjectMapper.Map<List<ListingResposeDto>>(jglResponse.Listings.Listing);
                }

                response.TotalCount = Convert.ToInt32(jglResponse.Total);
            }

            return response;
        }

        public List<KeyValuePair<Guid, string>> Search(SearchInput input)
        {
            var leads = _listingRepository.GetAll()
                .WhereIf(!input.Filter.IsNullOrEmpty(), u => u.ExternalID.Contains(input.Filter))
                .Take(10)
                .ToList();

            return ObjectMapper.Map<List<KeyValuePair<Guid, string>>>(leads);
        }

        //public async Task<UsersFilterDto> GetUsersFilters(Guid publicId)
        //{
        //    var user = await UserManager.Users.FirstOrDefaultAsync(p => p.PublicId == publicId);
        //    var filters = _usersFilterRepository.GetAll().Include(t => t.Features)
        //        .Include(t => t.Pets)
        //        .Include(t => t.Statuses)
        //        .Include(t => t.Features)
        //        .Include(t => t.Media)
        //        .Include(t => t.Fees)
        //        .Include(t => t.Parking).Where(m => m.UserId == user.Id).FirstOrDefaultAsync();

        //    return ObjectMapper.Map<UsersFilterDto>(filters);
        //}

        //public async Task UpdateFilters(UsersFilterDto input)
        //{
        //    var filters = ObjectMapper.Map<UsersFilters>(input);
        //    await _usersFilterRepository.InsertOrUpdateAsync(filters);
        //}
    }
}
