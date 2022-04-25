using System;
using System.Collections.Generic;
using System.Text;
using Realty.Dto;

namespace Realty.Listings.Dto
{
    public class GetListingInput : PagedAndSortedInputDto
    {
        public string JglKey { get; set; }
        public string StreetName { get; set; }
        public string StreetNumber { get; set; }
        public string Zip { get; set; }
        public decimal? MinimalRent { get; set; }
        public decimal? MaximalRent { get; set; }
        public int? PageIndex { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public string ID { get; set; }
        public string Unit { get; set; }
        public List<string> Media { get; set; }
        public List<string> Status { get; set; }
        public List<string> Pets { get; set; }
        public List<string> Bathrooms { get; set; }
        public List<string> Bedrooms { get; set; }
        public List<string> Cities { get; set; }
    }
}
