using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Realty.MultiTenancy.Accounting.Dto;

namespace Realty.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
