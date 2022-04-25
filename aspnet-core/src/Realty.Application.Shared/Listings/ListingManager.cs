using Abp.Extensions;
using Realty.Listings.Dto;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Realty.Listings
{
    public static class ListingManager
	{
        public static async Task<YGLResponse> SearchListing(GetListingInput input)
        {
            var _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://www.yougotlistings.com/");
            var requestBody = new FormUrlEncodedContent(PopulateRequestBody(input));

            YGLResponse response = null;
            var res = await _httpClient.PostAsync("api/rentals/search.php", requestBody);
            if (res.IsSuccessStatusCode)
            {
                var responsestring = await res.Content.ReadAsStringAsync();
                XmlSerializer serializer = new XmlSerializer(typeof(YGLResponse));
                using (var sr = new StringReader(responsestring))
                {
                    response = (YGLResponse)serializer.Deserialize(sr);
                }
            }

            return response;
        }

        private static List<KeyValuePair<string, string>> PopulateRequestBody(GetListingInput input)
        {
            var requestBody = new List<KeyValuePair<string, string>>();
            requestBody.Add(new KeyValuePair<string, string>("key", input.JglKey));
            if (input.AvailableFrom.HasValue)
            {
                requestBody.Add(new KeyValuePair<string, string>("avail_from", input.AvailableFrom.Value.ToString("MM/dd/yyyy")));
            }
            if (input.AvailableTo.HasValue)
            {
                requestBody.Add(new KeyValuePair<string, string>("avail_to", input.AvailableTo.Value.ToString("MM/dd/yyyy")));
            }
            if (!input.StreetName.IsNullOrEmpty())
            {
                requestBody.Add(new KeyValuePair<string, string>("street_name", input.StreetName.ToString()));
            }
            if (!input.StreetNumber.IsNullOrEmpty())
            {
                requestBody.Add(new KeyValuePair<string, string>("street_number", input.StreetNumber.ToString()));
            }
            if (input.MinimalRent.HasValue)
            {
                requestBody.Add(new KeyValuePair<string, string>("min_rent", input.MinimalRent.ToString()));
            }
            if (input.MaximalRent.HasValue)
            {
                requestBody.Add(new KeyValuePair<string, string>("max_rent", input.MaximalRent.ToString()));
            }
            if (input.Cities != null && input.Cities.Count > 0)
            {
                requestBody.Add(new KeyValuePair<string, string>("city_neighborhood", string.Join(",", input.Cities.Select(c => c.Replace(" - ", ":")))));
            }
            if (input.Bathrooms != null && input.Bathrooms.Count > 0)
            {
                requestBody.Add(new KeyValuePair<string, string>("baths", string.Join(",", input.Bathrooms)));
            }
            if (input.Bedrooms != null && input.Bedrooms.Count > 0)
            {
                requestBody.Add(new KeyValuePair<string, string>("beds", string.Join(",", input.Bedrooms)));
            }
            if (!input.ID.IsNullOrEmpty())
            {
                requestBody.Add(new KeyValuePair<string, string>("listing_id", input.ID.ToString()));
            }
            if (!input.Zip.IsNullOrEmpty())
            {
                requestBody.Add(new KeyValuePair<string, string>("zip", input.Zip.ToString()));
            }

            requestBody.Add(new KeyValuePair<string, string>("include_mls", "1"));
            requestBody.Add(new KeyValuePair<string, string>("include_ygl_network", "1"));
            requestBody.Add(new KeyValuePair<string, string>("include_data_entry", "1"));
            requestBody.Add(new KeyValuePair<string, string>("include_internal", "1"));
            requestBody.Add(new KeyValuePair<string, string>("include_move_in_costs", "1"));
            requestBody.Add(new KeyValuePair<string, string>("detail_level", "2"));
            
            requestBody.Add(new KeyValuePair<string, string>("page_count", input.MaxResultCount.ToString()));
            var pageIndex = input.PageIndex.HasValue ? input.PageIndex.Value : (input.SkipCount / input.MaxResultCount);
            //requestBody.Add(new KeyValuePair<string, string>("page_index", pageIndex.ToString()));
            requestBody.Add(new KeyValuePair<string, string>("page_index", pageIndex.ToString()));
            if (!input.Sorting.IsNullOrEmpty())
            {
                if (!input.Sorting.Contains("DESC"))
                {
                    requestBody.Add(new KeyValuePair<string, string>("sort_dir", "asc"));
                    requestBody.Add(new KeyValuePair<string, string>("sort_name", input.Sorting.Split(' ')[0]));
                }
                else if (input.Sorting.Contains("DESC"))
                {
                    requestBody.Add(new KeyValuePair<string, string>("sort_dir", "desc"));
                    requestBody.Add(new KeyValuePair<string, string>("sort_name", input.Sorting.Split(' ')[0]));
                }
            }

            if (input.Status != null && input.Status.Count > 0)
            {
                requestBody.Add(new KeyValuePair<string, string>("statuses", string.Join(",", input.Status)));
            }
            if (input.Media != null && input.Media.Count > 0)
            {
                requestBody.Add(new KeyValuePair<string, string>("media", string.Join(",", input.Media)));
            }
            if (input.Pets != null && input.Pets.Count > 0)
            {
                if (input.Pets.Count == 1)
                {
                    requestBody.Add(new KeyValuePair<string, string>("pets", input.Pets.FirstOrDefault()));
                }
                else
                {
                    requestBody.Add(new KeyValuePair<string, string>("pets", "friendly"));
                }
            }

            return requestBody;
        }
    }
}