using Abp.Events.Bus.Entities;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;
using System;

namespace Realty.Forms.Events
{
    public class FormStatusChangedEventData: EntityEventData<Form>
    {
        // Library, Signing or Transaction
        public IHaveForms Parent { get; }

        public FormStatusChangedEventData(Library library, Form form) : base(form)
        {
            Parent = library;
        }

        public FormStatusChangedEventData(Signing signing, Form form) : base(form)
        {
            Parent = signing;
        }

        public FormStatusChangedEventData(Transaction transaction, Form form) : base(form)
        {
            Parent = transaction;
        }
    }
}
