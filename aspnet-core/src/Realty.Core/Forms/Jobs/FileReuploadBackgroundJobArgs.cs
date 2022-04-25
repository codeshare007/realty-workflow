using System;
using Realty.Libraries;
using Realty.Signings;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.Forms.Jobs
{
    [Serializable]
    internal class FileReuploadBackgroundJobArgs
    {
        public string ParentType { get; set;  }

        public Guid ParentId { get; set; }

        public Guid FileId { get; set; }

        public FileReuploadBackgroundJobArgs()
        {
        }

        public FileReuploadBackgroundJobArgs(Library library, File file)
        {
            ParentType = typeof(Library).FullName;
            ParentId = library.Id;
            FileId = file.Id;
        }

        public FileReuploadBackgroundJobArgs(Signing signing, File file)
        {
            ParentType = typeof(Signing).FullName;
            ParentId = signing.Id;
            FileId = file.Id;
        }

        public FileReuploadBackgroundJobArgs(Transaction transaction, File file)
        {
            ParentType = typeof(Transaction).FullName;
            ParentId = transaction.Id;
            FileId = file.Id;
        }
    }
}
