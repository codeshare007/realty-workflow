using System;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Forms.Jobs
{
    [Serializable]
    internal class FormRefreshPageFilesBackgroundJobArgs
    {
        public string ParentType { get; set;  }

        public Guid ParentId { get; set; }
        public Guid FormId { get; set; }

        public FormRefreshPageFilesBackgroundJobArgs()
        {
        }

        public FormRefreshPageFilesBackgroundJobArgs(Library library, Guid formId)
        {
            ParentType = typeof(Library).FullName;
            ParentId = library.Id;
            FormId = formId;
        }

        public FormRefreshPageFilesBackgroundJobArgs(Signing signing, Guid formId)
        {
            ParentType = typeof(Signing).FullName;
            ParentId = signing.Id;
            FormId = formId;
        }

        public FormRefreshPageFilesBackgroundJobArgs(Transaction transaction, Guid formId)
        {
            ParentType = typeof(Transaction).FullName;
            ParentId = transaction.Id;
            FormId = formId;
        }
    }
}
