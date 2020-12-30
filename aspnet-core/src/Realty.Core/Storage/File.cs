using System;
using System.Collections.Generic;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Forms;
using Realty.Pages;

namespace Realty.Storage
{
    public class File: FullAuditedEntity<Guid>, IMustHaveTenant
    {
        private List<Form> _forms = new List<Form>();
        private List<Page> _pages = new List<Page>();

        protected File()
        {
        }

        public File(UploadFileResult input)
        {
            Name = input.Name;
            Path = input.Path;
            ExternalId = input.Id;
            ContentType = input.ContentType;
        }

        public string Name { get; private set; }

        public string Path { get; private set; }

        public string ExternalId { get; private set; }

        public string ContentType { get; private set; }

        public int TenantId { get; set; }

        public virtual IReadOnlyCollection<Form> Forms => _forms.AsReadOnly();

        public virtual IReadOnlyCollection<Page> Pages => _pages.AsReadOnly();
    }
}
