using System.Threading.Tasks;
using Realty.Sessions.Dto;

namespace Realty.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}
