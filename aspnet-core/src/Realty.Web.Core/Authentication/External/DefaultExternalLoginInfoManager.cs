using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.Extensions;
using Microsoft.AspNetCore.Identity;

namespace Realty.Web.Authentication.External
{
    public class DefaultExternalLoginInfoManager : IExternalLoginInfoManager
    {
        public virtual string GetUserNameFromClaims(List<Claim> claims)
        {
            return claims.First(c => c.Type == ClaimTypes.Email)?.Value.ToMd5();
        }

        public virtual string GetUserNameFromExternalAuthUserInfo(ExternalAuthUserInfo userInfo)
        {
            return userInfo.EmailAddress.ToMd5();
        }

        public (string name, string surname) GetNameAndSurnameFromClaims(List<Claim> claims, IdentityOptions identityOptions)
        {
            string name = null;
            string surname = null;

            var givenNameClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName);
            if (givenNameClaim != null && !givenNameClaim.Value.IsNullOrEmpty())
            {
                name = givenNameClaim.Value;
            }

            var surnameClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname);
            if (surnameClaim != null && !surnameClaim.Value.IsNullOrEmpty())
            {
                surname = surnameClaim.Value;
            }

            if (name == null || surname == null)
            {
                var nameClaim = claims.FirstOrDefault(c => c.Type == identityOptions.ClaimsIdentity.UserNameClaimType);
                if (nameClaim != null)
                {
                    var nameSurName = nameClaim.Value;
                    if (!nameSurName.IsNullOrEmpty())
                    {
                        var lastSpaceIndex = nameSurName.LastIndexOf(' ');
                        if (lastSpaceIndex < 1 || lastSpaceIndex > (nameSurName.Length - 2))
                        {
                            name = surname = nameSurName;
                        }
                        else
                        {
                            name = nameSurName.Substring(0, lastSpaceIndex);
                            surname = nameSurName.Substring(lastSpaceIndex);
                        }
                    }
                }
            }

            return (name, surname);
        }
    }
}