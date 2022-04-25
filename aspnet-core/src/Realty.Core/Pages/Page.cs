using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Controls;
using Realty.Storage;

namespace Realty.Pages
{
    public class Page: FullAuditedEntity<Guid>, IMustHaveTenant, IHaveFile
    {
        private List<Control> _controls = new List<Control>();

        protected Page()
        {
        }

        public Page(int index, File file)
        {
            Number = index;
            File = file;
        }

        [Range(Constants.NumberMinValue, Constants.NumberMaxValue)]
        public int Number { get; set; }

        public virtual File File { get; set; }

        public int TenantId { get; set; }

        public virtual IReadOnlyCollection<Control> Controls => _controls.AsReadOnly();

        public Page Clone(bool forNextSigning = false) 
        {
            var file = new File(new UploadFileResult()
            {
                ContentType = this.File.ContentType,
                Name = this.File.Name,
                Path = this.File.Path,
                Id = this.File.ExternalId,
            });
            var clonedPage = new Page(Number, file);

            if (!forNextSigning)
            {
                Controls.ToList();
                foreach (var control in this._controls)
                {
                    clonedPage.AddControl(control.Clone());
                }
            }

            return clonedPage;
        }
        public void UpdateFile(Storage.File file)
        {
            this.File = file;
        }

        public void RemoveControl(Control control)
        {
            Check.NotNull(control, nameof(control));

            if (control.Id == Guid.Empty)
                throw new ArgumentNullException(nameof(control.Id));

            _controls.Remove(control);
        }

        public void AddControl(Control control)
        {
            Check.NotNull(control, nameof(control));

            if (control.Id != Guid.Empty)
                throw new ArgumentException("Id should be empty", nameof(control.Id));

            _controls.Add(control);
        }
    }
}
