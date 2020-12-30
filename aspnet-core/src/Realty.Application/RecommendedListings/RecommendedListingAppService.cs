using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Realty.Leads;
using System;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Realty.RecommendedListings.Dto;
using Realty.RecommendedListings.Input;
using Realty.Listings;
using Realty.Transactions;

namespace Realty.RecommendedListings
{
    [AbpAuthorize(AppPermissions.Pages_Leads)]
    public class RecommendedListingAppService : RealtyAppServiceBase, IRecommendedListingAppService
    {
        private readonly IRepository<RecommendedListing, Guid> _recommendedListingRepository;
        private readonly IRepository<Lead, Guid> _leadRepository;
        private readonly IRepository<Listing, Guid> _listingRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;

        public RecommendedListingAppService(
            IRepository<RecommendedListing, Guid> recommendedListingRepository,
            IRepository<Lead, Guid> leadRepository,
            IRepository<Listing, Guid> listingRepository, 
            IRepository<Transaction, Guid> transactionRepository)
        {
            _recommendedListingRepository = recommendedListingRepository;
            _leadRepository = leadRepository;
            _listingRepository = listingRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<PagedResultDto<RecommendedListingListDto>> GetListAsync(GetRecommendedListingsInput input)
        {
            var query = _recommendedListingRepository.GetAll()
                .Include(c => c.Listing)
                .Where(c => c.LeadId == input.LeadId);

            query = await AddCheckAccess(query);

            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll)) {
                var user = await GetCurrentUserAsync();
                query = query.Where(c => c.Lead.AgentId == user.Id);
            }

            var listingCount = await query.CountAsync();

            var listings = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var listingListDtos = ObjectMapper.Map<List<RecommendedListingListDto>>(listings);
            return new PagedResultDto<RecommendedListingListDto>(
                listingCount,
                listingListDtos
                );
        }

        public async Task<Guid> CreateTransactionAsync(Guid Id)
        {
            var query = _recommendedListingRepository.GetAll()
                .Include(c => c.Listing)
                .Include(c => c.Lead)
                .ThenInclude(c => c.Contact)
                .Where(c => c.Id == Id);

            query = await AddCheckAccess(query);

            var recommendation = await query.FirstOrDefaultAsync();

            if (recommendation != null)
            {
                var user = await GetCurrentUserAsync();

                var transaction = new Transaction()
                {
                    AgentId = user.Id,
                    CustomerId = recommendation.Lead.CustomerId,
                    LeadId = recommendation.Lead.Id,
                    ListingId = recommendation.ListingId,
                    Name = $"Transaction from lead {recommendation.Lead.ExternalSource}"
                };

                await _transactionRepository.InsertAndGetIdAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                transaction.AddContact(recommendation.Lead.Contact);
                await _transactionRepository.InsertOrUpdateAndGetIdAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                return transaction.Id;
            }

            return Guid.Empty;
        }

        public async Task<bool> CreateAsync(CreateRecommendedListingInput input)
        {
            var result = false;
            var hasAccessToLead = PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll);

            if (!hasAccessToLead) 
            {
                var user = await GetCurrentUserAsync();
                hasAccessToLead = await _leadRepository
                    .GetAll()
                    .AnyAsync(s => s.Id == input.LeadId && s.AgentId == user.Id);
            }

            if (hasAccessToLead) 
            {
                var displayOrder = _recommendedListingRepository.GetAll()
                    .Where(r => r.LeadId == input.LeadId)
                    .OrderByDescending(r => r.DisplayOrder)
                    .Select(r => r.DisplayOrder)
                    .FirstOrDefault();

                foreach (var yglListingId in input.YglListingIds) 
                {
                    if (!_recommendedListingRepository.GetAll().Any(r => r.LeadId == input.LeadId && r.Listing.YglID == yglListingId)) {
                        var listingId = await _listingRepository
                            .GetAll()
                            .Where(l => l.YglID == yglListingId)
                            .Select(l => l.Id)
                            .FirstOrDefaultAsync();

                        if (listingId != Guid.Empty) {
                            var recommendedListing = new RecommendedListing()
                            {
                                ListingId = listingId,
                                LeadId = input.LeadId,
                                DisplayOrder = ++displayOrder
                            };

                            await _recommendedListingRepository.InsertAsync(recommendedListing);
                            await CurrentUnitOfWork.SaveChangesAsync();
                        }
                    }
                }
                result = true;
            }

            return result;
        }

        public async Task<bool> MoveAsync(MoveRecommendedListingInput input)
        {
            var result = false;
            var dbEntity = await GetById(input.Id);

            if (dbEntity != null)
            {
                var recommendations = await _recommendedListingRepository
                    .GetAll()
                    .Where(s => s.LeadId == dbEntity.LeadId)
                    .OrderBy(s => s.DisplayOrder)
                    .ToListAsync();

                for (var i = 0; i < recommendations.Count; i++)
                {
                    var currentItem = recommendations[i];
                    if (currentItem.Id == input.Id) 
                    {
                        RecommendedListing neighboringItem = null;

                        if (i >= 0 && input.Direction == MoveDirection.Up)
                        {
                            neighboringItem = recommendations[i - 1];
                            
                        }
                        else if (i < recommendations.Count && input.Direction == MoveDirection.Down) 
                        {
                            neighboringItem = recommendations[i + 1];
                        }

                        if (neighboringItem != null) 
                        {
                            var currentDisplayOrder = currentItem.DisplayOrder;
                            currentItem.DisplayOrder = neighboringItem.DisplayOrder;
                            neighboringItem.DisplayOrder = currentDisplayOrder;

                            await _recommendedListingRepository.UpdateAsync(currentItem);
                            await _recommendedListingRepository.UpdateAsync(neighboringItem);
                            result = true;
                        }

                        break;
                    }    
                }
            }

            return result;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var result = false;

            var item = await GetById(id);
            if (item != null)
            {
                await _recommendedListingRepository.DeleteAsync(item);
                result = true;
            }

            return result;
        }

        private async Task<RecommendedListing> GetById(Guid id) 
        {
            var query = _recommendedListingRepository.GetAll()
                .Where(s => s.Id == id);

            query = await AddCheckAccess(query);

            return query.FirstOrDefault();
        }

        private async Task<IQueryable<RecommendedListing>> AddCheckAccess(IQueryable<RecommendedListing> query) 
        {
            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll)) 
            {
                var user = await GetCurrentUserAsync();
                query = query.Where(s => s.Lead.AgentId == user.Id);
            }

            return query;
        }
    }
}
