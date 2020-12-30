using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using Realty.Authorization.Users;
using Realty.MultiTenancy;

namespace Realty.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}