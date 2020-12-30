using System;
using System.Collections.Generic;
using System.Text;

namespace Realty.Listings
{
    public enum Pet
    {
        CatsAllowed,
        CatsNegotiable,
        NoCat,
        DogsAllowed,
        SmallDogsOnly,
        DogsNegotiable,
        NoDog
    }

    public enum Status
    {
        OnMarket,
        Pending,
        OffMarket
    }

    public enum Fee
    {
        NoFreePaid,
        Percent25,
        Percent50,
        Percent75,
        OneMonth,
        OneAndHalfMonth,
        CoBroke,
        Negotiable,
        Other,
    }

    public enum Media
    {
        Photos,
        VirtualTours
    }
}
