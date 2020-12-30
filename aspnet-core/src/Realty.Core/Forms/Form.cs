using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Pages;
using Realty.Storage;

namespace Realty.Forms
{
    public class Form: FullAuditedEntity<Guid>, IMustHaveTenant
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Page> _pages = new List<Page>();
        
        public Form()
        {
            Status = FormStatus.New;
        }

        [MaxLength(Constants.NameMaxLength)]
        public string Name { get; set; }
        public virtual File File { get; set; }
        public int TenantId { get; set; }
        public FormStatus Status { get; private set; }
        public virtual IReadOnlyCollection<Page> Pages => _pages.AsReadOnly();
        
        public void AddPage(Page page)
        {
            _pages.Add(page);
        }

        public Page GetPage(int index)
        {
            return _pages[index];
        }

        internal void SetStatus(FormStatus status)
        {
            Status = status;
        }
    }
}
