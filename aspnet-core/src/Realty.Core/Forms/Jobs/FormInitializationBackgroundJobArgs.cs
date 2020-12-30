using System;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Forms.Jobs
{
    [Serializable]
    internal class FormInitializationBackgroundJobArgs
    {
        public string ParentType { get; set;  }

        public Guid ParentId { get; set; }

        public Guid FormId { get; set; }

        public FormInitializationBackgroundJobArgs()
        {
        }

        public FormInitializationBackgroundJobArgs(Library library, Form form)
        {
            ParentType = typeof(Library).FullName;
            ParentId = library.Id;
            FormId = form.Id;
        }

        public FormInitializationBackgroundJobArgs(Signing signing, Form form)
        {
            ParentType = typeof(Signing).FullName;
            ParentId = signing.Id;
            FormId = form.Id;
        }

        public FormInitializationBackgroundJobArgs(Transaction transaction, Form form)
        {
            ParentType = typeof(Transaction).FullName;
            ParentId = transaction.Id;
            FormId = form.Id;
        }
    }
}
