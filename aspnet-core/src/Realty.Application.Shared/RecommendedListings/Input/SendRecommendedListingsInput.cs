using System;

namespace Realty.RecommendedListings.Input
{
    public class SendRecommendedListingsInput
    {
        public Guid Id { get; set; }
        public string EmailAddress { get; set; }
        public string[] CCEmailAddresses { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
