using Abp.Domain.Entities;
using System.Collections.Generic;
using Realty.Storage;

namespace Realty.Forms
{
    public interface IHaveForms: IHaveFiles
    {
        IReadOnlyCollection<Form> Forms { get; }

        void SetProcessing(Form form);

        void SetReady(Form form);

        void Add(Form form);

        void Delete(Form form);
    }
}
