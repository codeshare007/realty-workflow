using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.ObjectMapping;
using Abp.Threading;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Microsoft.EntityFrameworkCore;
using Realty.Listings.Dto;
using Realty.MultiTenancy;

namespace Realty.Listings
{
    public class ListingYglSyncWorker : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private const int CheckPeriodAsMilliseconds = 15 * 60 * 1000; //15 minutes
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IRepository<Listing, Guid> _listingRepository;
        private readonly IObjectMapper _objectMapper;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public ListingYglSyncWorker(
            AbpTimer timer,
            IRepository<Listing, Guid> listingRepository,
            IRepository<Tenant> tenantRepository,
            IObjectMapper objectMapper,
            IUnitOfWorkManager unitOfWorkManager)
            : base(timer)
        {
            _tenantRepository = tenantRepository;
            _listingRepository = listingRepository;
            _objectMapper = objectMapper;
            _unitOfWorkManager = unitOfWorkManager;

            Timer.Period = CheckPeriodAsMilliseconds;
            Timer.RunOnStart = true;

            LocalizationSourceName = RealtyConsts.LocalizationSourceName;
        }

        protected override void DoWork()
        {
            List<Tenant> tenants = null;
            using (var uow = _unitOfWorkManager.Begin())
            {
                tenants = _tenantRepository
                    .GetAll()
                    .Where(t => t.JglKey != null && t.JglKey.Length > 0)
                    .ToList();

                uow.Complete();
            }

            foreach (var tenant in tenants) 
            {
                //var key = "jsapfasmasdfajfasfdij22089fj0af0asdufsad";
                AsyncHelper.RunSync(() => SyncData(tenant.Id, tenant.JglKey, 1));
            }
        }

        private async Task SyncData(int tenantId, string jglKey, int page) {
            var input = new GetListingInput();
            input.Sorting = "updateDate DESC";
            input.MaxResultCount = 100;
            input.PageIndex = page;
            input.JglKey = jglKey; 
            
            try 
            {
                using (var uow = _unitOfWorkManager.Begin())
                {
                    using (CurrentUnitOfWork.SetTenantId(tenantId))
                    {
                        var jglResponse = await ListingManager.SearchListing(input);

                        if (jglResponse != null && jglResponse.Listings != null && jglResponse.Listings.Listing != null && jglResponse.Listings.Listing.Count > 0)
                        {
                            foreach (var listing in jglResponse.Listings.Listing)
                            {
                                var dbEntity = await _listingRepository.GetAll()
                                    .Where(l => l.Source == ListingSource.YGL)
                                    .Where(l => l.YglID == listing.ID)
                                    .FirstOrDefaultAsync();

                                DateTime updateDate;
                                if (DateTime.TryParse(listing.UpdateDate, out updateDate))
                                {
                                    if (dbEntity == null)
                                    {
                                        dbEntity = new Listing();
                                    }

                                    if (dbEntity.UpdateDate != updateDate)
                                    {
                                        _objectMapper.Map(listing, dbEntity);
                                        MapListings(listing, dbEntity);

                                        await _listingRepository.InsertOrUpdateAsync(dbEntity);
                                    }
                                    else
                                    {
                                        uow.Complete();
                                        return;
                                    }
                                }
                            }
                            await CurrentUnitOfWork.SaveChangesAsync();
                        }

                        uow.Complete();
                    }
                }

                await SyncData(tenantId, jglKey, ++page);
            }
            catch (Exception ex) 
            { 

            }
        }

        private void MapListings(JGLListing source, Listing destination)
        {
            if (source.Videos != null && source.Videos.Video != null)
            {
                foreach (var item in source.Videos.Video)
                {
                    destination.AddListingDetail(new ListingDetail()
                    {
                        Type = ListingDetailType.Video,
                        Data = item
                    });
                }
            }

            if (source.VirtualTours != null && source.VirtualTours.VirtualTour != null)
            {
                foreach (var item in source.VirtualTours.VirtualTour)
                {
                    destination.AddListingDetail(new ListingDetail()
                    {
                        Type = ListingDetailType.Photos360,
                        Data = item
                    });
                }
            }

            if (source.Photos != null && source.Photos.Photo != null)
            {
                foreach (var item in source.Photos.Photo)
                {
                    destination.AddListingDetail(new ListingDetail()
                    {
                        Type = ListingDetailType.Photo,
                        Data = item
                    });
                }
            }

            if (source.RentIncludes != null && source.RentIncludes.RentInclude != null)
            {
                foreach (var item in source.RentIncludes.RentInclude)
                {
                    destination.AddListingDetail(new ListingDetail()
                    {
                        Type = ListingDetailType.RentInclude,
                        Data = item
                    });
                }
            }

            if (source.Features != null && source.Features.Feature != null)
            {
                foreach (var item in source.Features.Feature)
                {
                    destination.AddListingDetail(new ListingDetail()
                    {
                        Type = ListingDetailType.Feature,
                        Data = item
                    });
                }
            }

            if (source.Tags != null && source.Tags.Tag != null)
            {
                foreach (var item in source.Tags.Tag)
                {
                    destination.AddListingDetail(new ListingDetail()
                    {
                        Type = ListingDetailType.Tag,
                        Data = item
                    });
                }
            }
        }
    }
}
