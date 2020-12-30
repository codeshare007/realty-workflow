using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization;
using Realty.Forms.Dto;
using Realty.Storage;
using Realty.Signings;
using Realty.Forms;
using Realty.Signings.Dto;
using Realty.Signings.Input;
using Realty.Url;
using Abp.Runtime.Security;
using System.Web;

namespace Realty.SigningForms
{
    [AbpAuthorize(AppPermissions.Pages_Signings)]
    public class SigningFormAppService : RealtyAppServiceBase, ISigningFormAppService
    {
        public IAppUrlService AppUrlService { get; set; }
        
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IRepository<File, Guid> _fileRepository;
        private readonly FormAssembler _formAssembler;

        public SigningFormAppService(
            IRepository<Signing, Guid> signingRepository,
            IRepository<File, Guid> fileRepository,
            FormAssembler formAssembler)
        {
            _signingRepository = signingRepository;
            _fileRepository = fileRepository;
            _formAssembler = formAssembler;

            AppUrlService = NullAppUrlService.Instance;
        }

        public async Task<PagedResultDto<SigningFormListDto>> GetAllAsync(GetSigningFormsInput input)
        {
            var query = _signingRepository.GetAll()
                .Where(t => t.Id == input.Id)
                .SelectMany(t => t.Forms)
                .WhereIf(!input.Filter.IsNullOrEmpty(), f => f.Name.Contains(input.Filter));

            var totalCount = await query.CountAsync();

            var forms = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();

            var dto = ObjectMapper
                .Map<List<FormListDto>>(forms)
                .Select(formDto => new SigningFormListDto(input.Id, formDto))
                .ToList();

            return new PagedResultDto<SigningFormListDto>(totalCount, dto);
        }

        public async Task<Guid> CreateAsync(CreateSigningFormInput input)
        {
            var signing = await _signingRepository.GetAsync(input.Id);
            var form = ObjectMapper.Map<Form>(input.Form);

            form.File = await _fileRepository.GetAsync(input.Form.FileId);

            signing.Add(form);

            await _signingRepository.UpdateAsync(signing);
            await CurrentUnitOfWork.SaveChangesAsync();

            return form.Id;
        }

        public async Task<SigningFormEditDto> GetForEditAsync(GetSigningFormForEditInput input)
        {
            var signing = await _signingRepository.GetAsync(input.Id);

            var formDtos = signing.Forms
                .Select(form => ObjectMapper.Map<FormEditDto>(form))
                .ToArray();

            

            return new SigningFormEditDto(signing.Id, signing.Name, formDtos, GetPublicSigningLink(signing));
        }

        public async Task UpdateAsync(UpdateSigningFormInput input)
        {
            Check.NotNull(input.Id, nameof(input.Id));

            var signing = await _signingRepository.GetAsync(input.Id);
            
            foreach (var form in signing.Forms) {
                var formInput = input.Forms.FirstOrDefault(f => f.Id == form.Id);

                _formAssembler.Map(formInput, form);
            }
            
            await _signingRepository.UpdateAsync(signing);
        }

        public async Task DeleteAsync(DeleteSigningFormInput input)
        {
            // DO NOT OPTIMIZE REQUESTS
            var signing = await _signingRepository.GetAsync(input.Id);
            var form = signing.Forms.First(f => f.Id == input.Form.Id);

            signing.Delete(form);

            await _signingRepository.UpdateAsync(signing);
        }

        private string GetPublicSigningLink(Signing signing)
        {
            var publicLink = AppUrlService.CreatePublicSigingUrlFormat(signing.Tenant.Name, null);

            publicLink = publicLink.Replace("{signingId}", signing.Id.ToString());
            publicLink = publicLink.Replace("{tenantId}", signing.TenantId.ToString());
            publicLink = EncryptQueryParameters(publicLink);

            return publicLink;
        }

        /// <summary>
        /// Returns link with encrypted parameters
        /// </summary>
        /// <param name="link"></param>
        /// <param name="encrptedParameterName"></param>
        /// <returns></returns>
        private string EncryptQueryParameters(string link, string encrptedParameterName = "c")
        {
            if (!link.Contains("?"))
            {
                return link;
            }

            var basePath = link.Substring(0, link.IndexOf('?'));
            var query = link.Substring(link.IndexOf('?')).TrimStart('?');

            return basePath + "?" + encrptedParameterName + "=" + HttpUtility.UrlEncode(SimpleStringCipher.Instance.Encrypt(query));
        }
    }
}
