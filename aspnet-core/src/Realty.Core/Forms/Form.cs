using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Forms.Events;
using Realty.Pages;
using Realty.Storage;

namespace Realty.Forms
{
    public class Form: FullAuditedEntity<Guid>, IMustHaveTenant, IHaveFile
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Page> _pages = new List<Page>();
        private List<ParticipantMappingItem> _participantMappingItems = new List<ParticipantMappingItem>();
        
        public Form()
        {
            Status = FormStatus.New;
        }

        [MaxLength(Constants.NameMaxLength)]
        public string Name { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }

        public virtual File File { get; set; }
        //TODO: move outside
        public virtual File SignedFile { get; private set; }
        public int TenantId { get; set; }
        public FormStatus Status { get; private set; }
        public int DisplayOrder { get; private set; }
        public virtual IReadOnlyCollection<Page> Pages => _pages.AsReadOnly();
        public virtual IReadOnlyCollection<ParticipantMappingItem> ParticipantMappingItems => _participantMappingItems.AsReadOnly();

        public Form Clone(bool forNextSigning = false)
        {
            var clonedForm = new Form();
            clonedForm.SetStatus(FormStatus.Ready);
            clonedForm.Name = this.Name;
            clonedForm.Height = this.Height;
            clonedForm.Width = this.Width;

            var file = forNextSigning ? this.SignedFile : this.File;

            clonedForm.File = new File(new UploadFileResult()
            {
                ContentType = file.ContentType,
                Name = file.Name,
                Path = file.Path,
                Id = file.ExternalId,
            });

            Pages.ToList();
            foreach (var page in this._pages)
            {
                clonedForm.AddPage(page.Clone(forNextSigning));
            }

            return clonedForm;
        }

        public void AddSignedFile(Storage.File file)
        {
            SignedFile = new File(new UploadFileResult()
            {
                ContentType = file.ContentType,
                Name = file.Name,
                Path = file.Path,
                Id = file.ExternalId,
            });
        }

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

        public void SetDisplayOrder(int displayOrder)
        {
            DisplayOrder = displayOrder;
        }

        public void UpdateParticipantMappingItems(List<ParticipantMappingItem> participantMappingItem)
        {
            Check.NotNull(participantMappingItem, nameof(participantMappingItem));
            this.ParticipantMappingItems.ToList();

            //update items
            foreach (var item in this._participantMappingItems)
            {
                var inputItem = participantMappingItem.FirstOrDefault(p => p.Id == item.Id);

                if (inputItem != null)
                {
                    item.Name = inputItem.Name;
                    item.DisplayOrder = inputItem.DisplayOrder;
                }
            }

            //remove items
            var itemsToRemove = this._participantMappingItems
                .Where(p => participantMappingItem.All(i => i.Id != p.Id))
                .ToList();
            foreach (var item in itemsToRemove)
            {
                this._participantMappingItems.Remove(item);
            }

            //add items
            var itemsToAdd = participantMappingItem
                .Where(p => p.Id == Guid.Empty)
                .ToList();

            this._participantMappingItems.AddRange(itemsToAdd);
        }
    }
}
