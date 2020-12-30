using System.Collections.Generic;

namespace Realty.Forms
{
    public interface IHaveForms
    {
        IReadOnlyCollection<Form> Forms { get; }

        void SetProcessing(Form form);

        void SetReady(Form form);

        void Add(Form form);

        void Delete(Form form);
    }
}
