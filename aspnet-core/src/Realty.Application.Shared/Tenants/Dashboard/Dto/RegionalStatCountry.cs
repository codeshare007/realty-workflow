﻿using System.Collections.Generic;

namespace Realty.Tenants.Dashboard.Dto
{
    public class RegionalStatCountry
    {
        public string CountryName { get; set; }

        public decimal Sales { get; set; }

        public List<int> Change { get; set; }

        public decimal AveragePrice { get; set; }

        public decimal TotalPrice { get; set; }
    }
}