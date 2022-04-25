using System;
using System.Web;
using Abp.Application.Services.Dto;
using Abp.Runtime.Security;
using Abp.Runtime.Validation;

namespace Realty.Signings.Input
{
    public class CompleteSigningRequestInput: EntityDto<Guid>, IShouldNormalize
    {
        /// <summary>
        /// Encrypted values for {SigningRequestId}
        /// </summary>
        public string c { get; set; }

        public void Normalize()
        {
            ResolveParameters();
        }

        protected virtual void ResolveParameters()
        {
            if (!string.IsNullOrEmpty(c))
            {
                var parameters = SimpleStringCipher.Instance.Decrypt(c);
                var query = HttpUtility.ParseQueryString(parameters);

                if (query["id"] != null)
                {
                    Id = Guid.Parse(query["id"]);
                }
            }
        }
    }
}
