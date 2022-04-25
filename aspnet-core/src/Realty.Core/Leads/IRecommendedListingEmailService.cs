using System.Threading.Tasks;

namespace Realty.Leads
{
    public interface IRecommendedListingEmailService
    {
        Task SendRecommendedListingsAsync(Lead lead, string mainEmail, string[] ccEmails, string subject, string body);
        Task NotifyAgentAboutRecommendedListingAsync(Lead lead, RecommendedListing listing);
    }
}
