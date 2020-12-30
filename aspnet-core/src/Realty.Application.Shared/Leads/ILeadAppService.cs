using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Leads.Dto;
using Realty.Leads.Input;

namespace Realty.Leads
{
    public interface ILeadAppService: ITransientDependency
    {
        Task<PagedResultDto<LeadListDto>> GetLeadsAsync(GetLeadsInput input);

        Task<Guid> CreateLeadAsync(CreateLeadInput input);

        Task<LeadEditDto> GetForEditAsync(Guid input);
    }
}
