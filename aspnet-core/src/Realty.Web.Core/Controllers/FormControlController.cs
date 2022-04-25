using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Abp;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Security;
using Abp.Timing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Realty.Attachments;
using Realty.Authorization;
using Realty.Controls.Input;
using Realty.Forms;
using Realty.Libraries;
using Realty.Signings;
using Realty.Signings.AccessRequests;
using Realty.Signings.Input;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.Web.Controllers
{
    public class FormControlController : RealtyControllerBase
    {
        private readonly IRepository<Library, Guid> _libraryRepository;
        private readonly IRepository<Transaction, Guid> _transactionRepository;
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly PermissionChecker _permissionChecker;
        private readonly IRepository<SigningRequest, Guid> _signingRequestRepository;
        private readonly ISigningRequestValidatingFactory _signingRequestValidatingFactory;
        private readonly IRepository<File, Guid> _fileRepository;

        public FormControlController(
            IRepository<Library, Guid> libraryRepository, 
            IRepository<Transaction, Guid> transactionRepository, 
            IRepository<Signing, Guid> signingRepository,
            PermissionChecker permissionChecker, 
            IRepository<SigningRequest, Guid> signingRequestRepository, 
            ISigningRequestValidatingFactory signingRequestValidatingFactory, 
            IRepository<File, Guid> fileRepository)
        {
            _libraryRepository = libraryRepository;
            _transactionRepository = transactionRepository;
            _signingRepository = signingRepository;
            _permissionChecker = permissionChecker;
            _signingRequestRepository = signingRequestRepository;
            _signingRequestValidatingFactory = signingRequestValidatingFactory;
            _fileRepository = fileRepository;
        }

        [HttpPost]
        public async Task UpdateControlValueAsync([FromBody]ControlValueInput input)
        {
            Check.NotNull(input.ControlId, nameof(input.ControlId));
            
            IHaveForms parent = null;
            if (input.LibraryId.HasValue && _permissionChecker.IsGranted(AbpSession.UserId.Value, AppPermissions.Pages_LibraryForms_Create))
            {
                parent = await _libraryRepository
                    .GetAsync(input.LibraryId.Value);
            }
            else if (input.TransactionId.HasValue && _permissionChecker.IsGranted(AbpSession.UserId.Value, AppPermissions.Pages_Transactions))
            {
                parent = await _transactionRepository
                    .GetAll()
                    .WhereIf(!_permissionChecker.IsGranted(AbpSession.UserId.Value, AppPermissions.Pages_Transactions_AccessAll),
                        i => i.AgentId == AbpSession.UserId.Value)
                    .Where(i => i.Id == input.TransactionId.Value)
                    .FirstOrDefaultAsync();

            }
            else if (input.SigningId.HasValue && _permissionChecker.IsGranted(AbpSession.UserId.Value, AppPermissions.Pages_Signings))
            {
                parent = await _signingRepository
                    .GetAll()
                    .WhereIf(!_permissionChecker.IsGranted(AbpSession.UserId.Value, AppPermissions.Pages_Signings_AccessAll),
                        i => i.AgentId == AbpSession.UserId.Value)
                    .Where(i => i.Id == input.SigningId.Value && i.Status != SigningStatus.Completed && i.Status != SigningStatus.Rejected)
                    .FirstOrDefaultAsync();

            } else if (!string.IsNullOrEmpty(input.ParticipantCode))
            {
                var parameters = SimpleStringCipher.Instance.Decrypt(input.ParticipantCode);
                var query = HttpUtility.ParseQueryString(parameters);

                if (query["id"] != null)
                {
                    var requestId = Guid.Parse(query["id"]);
                    var request = await _signingRequestRepository.GetAsync(requestId);
                    Check.NotNull(request, nameof(request));

                    var signing = await _signingRepository
                        .GetAll()
                        .Where(s => s.Id == request.SigningId && s.Status != SigningStatus.Completed && s.Status != SigningStatus.Rejected)
                        .Include(s => s.Participants)
                        .FirstOrDefaultAsync();

                    Check.NotNull(signing, nameof(signing));

                    _signingRequestValidatingFactory.Create(signing).Validate(request);

                    parent = signing;
                }
            }

            Check.NotNull(parent, nameof(parent));

            var form = parent.Forms.Where(f => f.Id == input.FormId).FirstOrDefault();
            Check.NotNull(form, nameof(form));
            
            var page = form.Pages.Where(f => f.Id == input.PageId).FirstOrDefault();
            Check.NotNull(page, nameof(page));
            
            var control = page.Controls.Where(f => f.Id == input.ControlId).FirstOrDefault();
            Check.NotNull(control, nameof(control));

            control.SetValue(input.Value, Request.HttpContext.Connection.RemoteIpAddress.ToString(), Clock.Now);
            control.Value.TenantId = form.TenantId;

            if (parent is Library)
            {
                await _libraryRepository.UpdateAsync(parent as Library);
            } else if (parent is Transaction)
            {
                await _transactionRepository.UpdateAsync(parent as Transaction);
            } else if (parent is Signing)
            {
                await _signingRepository.UpdateAsync(parent as Signing);
            }
        } //TODO:[FromBody] 

        [HttpPost]
        public async Task<Guid?> CreateAttachmentAsync([FromBody]CreateSigningAttachmentInput input) //TODO:[FromBody] 
        {
            if (!string.IsNullOrEmpty(input.ParticipantCode))
            {
                var parameters = SimpleStringCipher.Instance.Decrypt(input.ParticipantCode);
                var query = HttpUtility.ParseQueryString(parameters);

                if (query["id"] != null)
                {
                    var requestId = Guid.Parse(query["id"]);
                    var request = await _signingRequestRepository
                        .GetAll()
                        .Include(s => s.Participant)
                        .Where(r => r.Id == requestId)
                        .FirstOrDefaultAsync();
                    Check.NotNull(request, nameof(request));

                    var signing = await _signingRepository
                        .GetAll()
                        .Where(s => s.Id == request.SigningId && s.Status != SigningStatus.Completed && s.Status != SigningStatus.Rejected)
                        .Include(s => s.Participants)
                        .FirstOrDefaultAsync();

                    Check.NotNull(signing, nameof(signing));

                    _signingRequestValidatingFactory.Create(signing).Validate(request);

                    var file = await _fileRepository.GetAsync(input.Attachment.FileId);
                    var attachment = ObjectMapper.Map<Attachment>(input.Attachment);
                    attachment.File = file;
                    attachment.SigningParticipant = request.Participant;

                    signing.AddAttachment(attachment);
                    await _signingRepository.UpdateAsync(signing);

                    return attachment.Id;
                }
            }

            return (Guid?)null;
        }
    }
}