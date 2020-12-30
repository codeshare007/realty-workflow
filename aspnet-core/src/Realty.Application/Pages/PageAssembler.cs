using System;
using System.Linq;
using Abp.Dependency;
using Realty.Controls;
using Realty.Controls.Input;
using Realty.Forms;
using Realty.Pages.Input;

namespace Realty.Pages
{
    public class PageAssembler: ITransientDependency
    {
        public void Map(PageInput input, Page page)
        {
            // Order is important!
            DeleteControls(input, page);
            UpdateControls(input, page);
            AddControls(input, page);
        }


        private void DeleteControls(PageInput input, Page page)
        {
            bool IsNotEmptyGuid(ControlInput c) => c.Id != Guid.Empty;

            var expected = input.Controls.Where(IsNotEmptyGuid).Select(c => c.Id).ToList();

            var toBeRemoved = page.Controls.Where(c => !expected.Contains(c.Id)).ToList();

            foreach (var control in toBeRemoved)
            {
                page.RemoveControl(control);
            }
        }

        private void AddControls(PageInput pageInput, Page page)
        {
            var expectedNew = pageInput.Controls.Where(c => c.Id == Guid.Empty);

            foreach (var input in expectedNew)
            {
                var control = new Control(input.Type, ControlLayer.Form, string.Empty);
                control.SetPosition(input.Position.Top, input.Position.Left);
                control.SetSize(input.Size.Width, input.Size.Height);
                control.SetFont(input.Font.SizeInPx);
                control.SetParticipant(input.ParticipantId);
                page.AddControl(control);
            }
        }

        private void UpdateControls(PageInput pageInput, Page page)
        {
            bool IsNotEmptyGuid(ControlInput c) => c.Id != Guid.Empty;

            var expected = pageInput.Controls.Where(IsNotEmptyGuid).Select(c => c.Id).ToList();

            var toBeUpdated = page.Controls.Where(c => expected.Contains(c.Id)).ToList();

            foreach (var control in toBeUpdated)
            {
                var input = pageInput.Controls.First(c => c.Id == control.Id);

                control.SetType(input.Type);
                control.SetPosition(input.Position.Top, input.Position.Left);
                control.SetSize(input.Size.Width, input.Size.Height);
                control.SetFont(input.Font.SizeInPx);
                control.SetParticipant(input.ParticipantId);
            }
        }
    }
}
