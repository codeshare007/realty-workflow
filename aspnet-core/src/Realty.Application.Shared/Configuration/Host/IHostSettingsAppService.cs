﻿using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.Configuration.Host.Dto;

namespace Realty.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}
