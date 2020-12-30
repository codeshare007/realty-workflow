using Abp.Runtime.Security;
using Abp.Runtime.Validation;
using Realty.Signings.Dto;
using System;
using System.Web;

namespace Realty.Signings.Input
{
    public class GetForSigningInput : IShouldNormalize
    {
        public int TenantId { get; set; }
        public long? ParticipantId { get; set; }
        public Guid SigningId { get; set; }

        /// <summary>
        /// Encrypted values for {TenantId}, {ParticipantId} and {SigningId}
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

                if (query["tenantId"] != null)
                {
                    TenantId = Convert.ToInt16(query["tenantId"]);
                }

                if (query["participantId"] != null)
                {
                    ParticipantId = Convert.ToInt32(query["participantId"]);
                }

                if (query["signingId"] != null)
                {
                    SigningId = Guid.Parse(query["signingId"]);
                }
            }
        }
    }
}
