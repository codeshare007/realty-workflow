using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Realty.Signings.Dto;
using Realty.Signings.Input;
using Abp.Application.Services.Dto;
using System.Linq.Dynamic.Core;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Realty.Authorization;
using Abp.Extensions;
using Realty.Authorization.Users;
using Realty.Forms.Dto;
using Abp.Domain.Uow;

namespace Realty.Signings
{
    [AbpAuthorize(AppPermissions.Pages_Signings)]
    public class SigningAppService : RealtyAppServiceBase, ISigningAppService
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<User, long> _userRepository;

        public SigningAppService(
            IRepository<Signing, Guid> signingRepository,
            IRepository<User, long> userRepository, 
            IUnitOfWorkManager unitOfWorkManager)
        {
            _signingRepository = signingRepository;
            _userRepository = userRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }


        [AbpAllowAnonymous]
        public async Task<SigningFormDto> GetForSigningAsync(GetForSigningInput input)
        {
            using (_unitOfWorkManager.Current.SetTenantId(input.TenantId))
            {
                var signing = await _signingRepository.GetAsync(input.SigningId);

                if (signing != null) {
                    var formDtos = signing.Forms
                    .Select(form => ObjectMapper.Map<FormEditDto>(form))
                    .ToArray();

                    return new SigningFormDto(signing.Id, signing.Name, formDtos);
                }
            }

            return null;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<PagedResultDto<SigningListDto>> GetAllAsync(GetSigningsInput input)
        {
            var query = _signingRepository.GetAll()
                .WhereIf(input.TransactionId.HasValue, u => u.TransactionId == input.TransactionId)
                .WhereIf(input.AgentId.HasValue, u => u.AgentId.HasValue && u.Agent.PublicId == input.AgentId)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                        u => u.Name.Contains(input.Filter) || u.Notes.Contains(input.Filter));

            if (!PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll)) {
                var user = await GetCurrentUserAsync();
                query = query.Where(u => u.AgentId == user.Id);
            }

            var signingCount = await query.CountAsync();

            var signings = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var signingListDtos = ObjectMapper.Map<List<SigningListDto>>(signings);
            return new PagedResultDto<SigningListDto>(
                signingCount,
                signingListDtos
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Create)]
        public async Task<Guid> CreateAsync(CreateSigningInput input)
        {
            var signing = ObjectMapper.Map<Signing>(input);
            var tenant = await GetCurrentTenantAsync();
            signing.TenantId = tenant.Id;

            if (input.AgentId.HasValue)
            {
                signing.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            await _signingRepository.InsertAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();
            return signing.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings)]
        public async Task<SigningEditDto> GetForEditAsync(Guid input)
        {
            var form = await _signingRepository.GetAsync(input);
            var dto = ObjectMapper.Map<SigningEditDto>(form);
            return dto;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Edit)]
        public async Task<Guid> UpdateAsync(UpdateSigningInput input)
        {
            var signing = await _signingRepository
                .GetAll()
                .Where(t => t.Id == input.Signing.Id)
                //add validation
                .FirstOrDefaultAsync();

            signing.Name = input.Signing.Name;
            signing.Notes = input.Signing.Notes;
            
            if (input.Signing.AgentId.HasValue)
            {
                signing.AgentId = await _userRepository
                    .GetAll()
                    .Where(u => u.PublicId == input.Signing.AgentId)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            }

            await _signingRepository.UpdateAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();
            return signing.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Signings_Delete)]
        public async Task DeleteAsync(Guid id)
        {
            var user = await GetCurrentUserAsync();
            var signing = await _signingRepository.GetAsync(id);

            if (signing != null && 
                (PermissionChecker.IsGranted(AppPermissions.Pages_Signings_AccessAll) || signing.AgentId == user.Id)) {
                await _signingRepository.DeleteAsync(signing);
            }
        }
    }
}
