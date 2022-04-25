using System;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Forms.Jobs
{
    [Serializable]
    internal class CreateSignedPdfDocumentsBackgroundJobArgs
    {
        public Guid SigningId { get; set; }

        public CreateSignedPdfDocumentsBackgroundJobArgs()
        {
        }

        public CreateSignedPdfDocumentsBackgroundJobArgs(Signing signing)
        {
            SigningId = signing.Id;
        }
    }
}
