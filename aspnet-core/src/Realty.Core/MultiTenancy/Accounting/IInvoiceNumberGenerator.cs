using System.Threading.Tasks;
using Abp.Dependency;

namespace Realty.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}