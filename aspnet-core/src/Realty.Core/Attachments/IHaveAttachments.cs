using System.Collections.Generic;
using Realty.Storage;

namespace Realty.Attachments
{
    public interface IHaveAttachments: IHaveFiles
    {
        IReadOnlyCollection<Attachment> Attachments { get; }
    }
}
