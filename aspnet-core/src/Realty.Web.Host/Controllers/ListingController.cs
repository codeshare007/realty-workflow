using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using PayPalHttp;
using Realty.Authorization.Users.Profile;
using Realty.Listings;
using Realty.Storage;
using HttpClient = System.Net.Http.HttpClient;

namespace Realty.Web.Controllers
{
    public class ListingController : RealtyControllerBase
    {
        private IRepository<Listing, Guid> _listingRepository;
        public ListingController(IRepository<Listing, Guid> listingRepository)
        {
            _listingRepository = listingRepository;
        }

        [HttpGet]
        public async Task GetFirstPhoto(Guid listingId)
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MustHaveTenant, AbpDataFilters.MayHaveTenant))
            {
                var listing = await _listingRepository.GetAll()
                    .Where(l => l.Id == listingId)
                    .Include(l => l.ListingDetails)
                    .FirstOrDefaultAsync();

                if (listing != null && listing.Photo != null && listing.Photo.Count > 0)
                {
                    var _httpClient = new HttpClient();
                    var response = await _httpClient.GetAsync(listing.Photo[0]);
                    var contentBytes = await response.Content.ReadAsByteArrayAsync();

                    Response.StatusCode = (int)response.StatusCode;
                    Response.ContentType = response.Content.Headers.ContentType.ToString();
                    Response.ContentLength = response.Content.Headers.ContentLength;

                    await Response.Body.WriteAsync(contentBytes);
                    return;
                }
            }
            
            Response.StatusCode = 404;
        }
    }
}