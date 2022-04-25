using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Realty.Leads;
using System;
using System.ComponentModel.DataAnnotations;
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
using Abp.Timing;
using Realty.TransactionPaymentTrackers;

namespace Realty.RecommendedListings
{
    [AbpAuthorize(AppPermissions.Pages_Leads)]
    public class RecommendedListingAppService : RealtyAppServiceBase, IRecommendedListingAppService
    {
        private readonly IRepository<Lead, Guid> _leadRepository;
        private readonly IRepository<Listing, Guid> _listingRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRecommendedListingEmailService _recommendedListingEmailService;

        public RecommendedListingAppService(
            IRepository<Lead, Guid> leadRepository,
            IRepository<Listing, Guid> listingRepository, 
            IRepository<Transaction, Guid> transactionRepository, 
            IRecommendedListingEmailService recommendedListingEmailService)
        {
            _leadRepository = leadRepository;
            _listingRepository = listingRepository;
            _transactionRepository = transactionRepository;
            _recommendedListingEmailService = recommendedListingEmailService;
        }

        public async Task<PagedResultDto<RecommendedListingListDto>> GetListAsync(GetRecommendedListingsInput input)
        {
            var query = GetLeads()
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .Where(l => l.Id == input.LeadId);

            var recommendedListingQuery = query
                .SelectMany(l => l.RecommendedListings);

            var recommendedListingCount = await recommendedListingQuery.CountAsync();

            var recommendedListings = await recommendedListingQuery
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var recommendedListingListDtos = ObjectMapper.Map<List<RecommendedListingListDto>>(recommendedListings);
            return new PagedResultDto<RecommendedListingListDto>(
                recommendedListingCount,
                recommendedListingListDtos
                );
        }

        [AbpAllowAnonymous]
        public async Task<List<RecommendedPublicListingDto>> GetPublicRecommendationListAsync(GetPublicRecommendationListInput input)
        {
            var lead = await _leadRepository.GetAll()
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.MoveInCosts)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.ListingDetails)
                .Where(l => l.Id == input.LeadId)
                .FirstOrDefaultAsync();

            return ObjectMapper.Map<List<RecommendedPublicListingDto>>(lead.RecommendedListings.OrderBy(r => r.DisplayOrder));
        }

        [AbpAllowAnonymous]
        public async Task<RecommendedPublicListingDto> GetPublicRecommendationAsync(GetPublicRecommendationInput input)
        {
            var lead = await _leadRepository.GetAll()
                .Include(l => l.Agent)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.MoveInCosts)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.ListingDetails)
                .Where(l => l.RecommendedListings.Any(r => r.Id == input.Id))
                .FirstOrDefaultAsync();

            if (lead != null)
            {
                var recommendedListing = lead
                    .RecommendedListings
                    .Where(r => r.Id == input.Id)
                    .FirstOrDefault();

                recommendedListing.LastViewDate = Clock.Now;
                await _leadRepository.UpdateAsync(lead);

                return ObjectMapper.Map<RecommendedPublicListingDto>(recommendedListing);
            }

            return null;
        }

        [AbpAllowAnonymous]
        public async Task RequestTourAsync(RequestTourInput input)
        {
            var lead = await _leadRepository.GetAll()
                .Include(l => l.Agent)
                .Include(l => l.LeadContacts)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .Where(l => l.RecommendedListings.Any(r => r.Id == input.Id))
                .FirstOrDefaultAsync();

            var recommendedListing = lead
                .RecommendedListings
                .Where(r => r.Id == input.Id)
                .FirstOrDefault();

            recommendedListing.SetRequestedTour(input.RequestedTourTime, input.RequestedTourDate);
            await _leadRepository.UpdateAsync(lead);

            await _recommendedListingEmailService.NotifyAgentAboutRecommendedListingAsync(lead, recommendedListing);
        }

        [AbpAllowAnonymous]
        public async Task AskQuestionAsync(AskQuestionInput input)
        {
            var lead = await _leadRepository.GetAll()
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .Where(l => l.RecommendedListings.Any(r => r.Id == input.Id))
                .FirstOrDefaultAsync();

            var recommendedListing = lead
                .RecommendedListings
                .Where(r => r.Id == input.Id)
                .FirstOrDefault();

            recommendedListing.SetLeadQuestion(input.Question);
            await _leadRepository.UpdateAsync(lead);
        }

        public async Task<RecommendedListingDto> GetRecommendedListingAsync(GetRecommendedListingInput input)
        {
            var lead = await GetLeads()
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.MoveInCosts)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.ListingDetails)
                .Where(l => l.RecommendedListings.Any(r => r.Id == input.Id))
                .FirstOrDefaultAsync();

            var recommendedListing = lead
                .RecommendedListings
                .Where(r => r.Id == input.Id)
                .FirstOrDefault();

            return ObjectMapper.Map<RecommendedListingDto>(recommendedListing);
        }

        public async Task SendRecommendedListings(SendRecommendedListingsInput input)
        {
            var lead = await GetLeads()
                .Include(l => l.Agent)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.MoveInCosts)
                .Include(l => l.RecommendedListings)
                .ThenInclude(l => l.Listing)
                .ThenInclude(l => l.ListingDetails)
                .Where(l => l.Id == input.Id)
                .FirstOrDefaultAsync();

            await _leadRepository.UpdateAsync(lead);

            var ccEmails = new List<string>();
            if (input.CCEmailAddresses != null)
            {
                ccEmails.AddRange(input.CCEmailAddresses);
            }

            if (lead.Agent != null)
            {
                ccEmails.Add(lead.Agent.EmailAddress);
            }

            await _recommendedListingEmailService.SendRecommendedListingsAsync(lead, input.EmailAddress, ccEmails.ToArray(), input.Subject, input.Body);
        }

        public async Task<Guid> CreateTransactionAsync(string name, Guid id)
        {
            var leadQuery = GetLeads()
                .Include(l => l.RecommendedListings)
                .Where(l => l.RecommendedListings.Any(r => r.Id == id));
            
            var recommendation = await leadQuery
                .SelectMany(l => l.RecommendedListings)
                .Include(c => c.Listing)
                .Include(c => c.Lead)
                .ThenInclude(c => c.LeadContacts)
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (recommendation != null)
            {
                var user = await GetCurrentUserAsync();

                var transaction = new Transaction()
                {
                    AgentId = user.Id,
                    CustomerId = recommendation.Lead.CustomerId,
                    LeadId = recommendation.Lead.Id,
                    ListingId = recommendation.ListingId,
                    Name = name ?? $"Transaction from lead",
                    PaymentTracker = new TransactionPaymentTracker()
                };

                transaction.LastModificationTime = Clock.Now;
                await _transactionRepository.InsertAndGetIdAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                foreach (var contact in recommendation.Lead.LeadContacts)
                {
                    transaction.AddParticipant(ObjectMapper.Map<TransactionParticipant>(contact));
                }

                await _transactionRepository.InsertOrUpdateAndGetIdAsync(transaction);
                await CurrentUnitOfWork.SaveChangesAsync();

                return transaction.Id;
            }

            return Guid.Empty;
        }

        public async Task<bool> CreateAsync(CreateRecommendedListingInput input)
        {
            var result = false;

            var lead = await GetLeads()
                        .Include(l => l.RecommendedListings)
                        .Where(l => l.Id == input.LeadId)
                        .FirstOrDefaultAsync();

            if (lead != null) 
            { 
                var displayOrder = lead.RecommendedListings
                    .OrderByDescending(r => r.DisplayOrder)
                    .Select(r => r.DisplayOrder)
                    .FirstOrDefault();

                foreach (var yglListingId in input.YglListingIds) 
                {
                    var listingId = await _listingRepository
                            .GetAll()
                            .Where(l => l.YglID == yglListingId)
                            .Select(l => l.Id)
                            .FirstOrDefaultAsync();

                    if (listingId != Guid.Empty && !lead.RecommendedListings.Any(r => r.ListingId == listingId)) {
                        
                        var recommendedListing = new RecommendedListing()
                        {
                            ListingId = listingId,
                            LeadId = input.LeadId,
                            DisplayOrder = ++displayOrder
                        };

                        lead.AddRecommendedListing(recommendedListing);
                    }
                }

                await _leadRepository.UpdateAsync(lead);
                await CurrentUnitOfWork.SaveChangesAsync();
                result = true;
            }

            return result;
        }

        public async Task<bool> MoveAsync(MoveRecommendedListingInput input)
        {
            var result = false;
            var lead = await GetLeads()
                .Include(l => l.RecommendedListings)
                .Where(l => l.RecommendedListings.Any(r => r.Id == input.Id))
                .FirstOrDefaultAsync();

            if (lead != null)
            {

                var recommendation = lead.RecommendedListings
                    .FirstOrDefault(r => r.Id == input.Id);

                if (recommendation != null)
                {
                    var orderedRecommendations = lead.RecommendedListings
                            .OrderBy(s => s.DisplayOrder)
                            .ToList();

                    for (var i = 0; i < orderedRecommendations.Count; i++)
                    {
                        var currentItem = orderedRecommendations[i];
                        if (currentItem.Id == input.Id)
                        {
                            RecommendedListing neighboringItem = null;

                            if (i >= 0 && input.Direction == MoveDirection.Up)
                            {
                                neighboringItem = orderedRecommendations[i - 1];

                            }
                            else if (i < orderedRecommendations.Count && input.Direction == MoveDirection.Down)
                            {
                                neighboringItem = orderedRecommendations[i + 1];
                            }

                            if (neighboringItem != null)
                            {
                                var currentDisplayOrder = currentItem.DisplayOrder;
                                currentItem.DisplayOrder = neighboringItem.DisplayOrder;
                                neighboringItem.DisplayOrder = currentDisplayOrder;

                                await _leadRepository.UpdateAsync(lead);
                                result = true;
                            }

                            break;
                        }
                    }
                }
            }

            return result;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var result = false;

            var lead = await GetLeads()
                .Include(l => l.RecommendedListings)
                .Where(l => l.RecommendedListings.Any(r => r.Id == id))
                .FirstOrDefaultAsync();

            if (lead != null)
            {
                var recommendation = lead.RecommendedListings
                    .FirstOrDefault(r => r.Id == id);

                if (recommendation != null)
                {
                    lead.DeleteRecommendedListing(recommendation);
                    await _leadRepository.UpdateAsync(lead);
                    result = true;
                }
            }

            return result;
        }
        
        private IQueryable<Lead> GetLeads()
        {
            var user = GetCurrentUser();

            return _leadRepository.GetAll()
                .WhereIf(!PermissionChecker.IsGranted(AppPermissions.Pages_Leads_AccessAll),
                    l => l.AgentId == user.Id);
        }
    }
}
