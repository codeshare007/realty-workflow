using System.Threading.Tasks;
using Realty.Authorization.Accounts.Dto;

namespace Realty.Authorization.Accounts
{
    public class ProxyAccountAppService : ProxyAppServiceBase, IAccountAppService
    {
        public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
        {
            return await ApiClient.PostAnonymousAsync<IsTenantAvailableOutput>(GetEndpoint(nameof(IsTenantAvailable)), input);
        }

        public async Task<int?> ResolveTenantId(ResolveTenantIdInput input)
        {
            return await ApiClient.PostAnonymousAsync<int?>(GetEndpoint(nameof(ResolveTenantId)), input);
        }

        public async Task<RegisterOutput> Register(RegisterInput input)
        {
            return await ApiClient.PostAnonymousAsync<RegisterOutput>(GetEndpoint(nameof(Register)), input);
        }

        public async Task SendPasswordResetCode(SendPasswordResetCodeInput input)
        {
            await ApiClient.PostAnonymousAsync(GetEndpoint(nameof(SendPasswordResetCode)), input);
        }

        public async Task<ResetPasswordOutput> ResetPassword(ResetPasswordInput input)
        {
            return await ApiClient.PostAnonymousAsync<ResetPasswordOutput>(GetEndpoint(nameof(ResetPassword)), input);
        }

        public async Task SendEmailActivationLink(SendEmailActivationLinkInput input)
        {
            await ApiClient.PostAnonymousAsync(GetEndpoint(nameof(SendEmailActivationLink)), input);
        }

        public async Task ActivateEmail(ActivateEmailInput input)
        {
            await ApiClient.PostAnonymousAsync(GetEndpoint(nameof(ActivateEmail)), input);
        }

        public async Task<ImpersonateOutput> Impersonate(ImpersonateInput input)
        {
            return await ApiClient.PostAsync<ImpersonateOutput>(GetEndpoint(nameof(Impersonate)), input);
        }

        public async Task<ImpersonateOutput> BackToImpersonator()
        {
            return await ApiClient.PostAnonymousAsync<ImpersonateOutput>(GetEndpoint(nameof(BackToImpersonator)));
        }

        public async Task<SwitchToLinkedAccountOutput> SwitchToLinkedAccount(SwitchToLinkedAccountInput input)
        {
            return await ApiClient.PostAnonymousAsync<SwitchToLinkedAccountOutput>(GetEndpoint(nameof(SwitchToLinkedAccount)));
        }
    }
}