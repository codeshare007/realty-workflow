using System;
using System.Linq;
using Abp;
using Abp.Dependency;
using Realty.Forms.Input;
using Realty.Pages;
using Realty.Storage;

namespace Realty.Forms
{
    public class FormAssembler: ITransientDependency
    {
        private readonly PageAssembler _pageAssembler;

        public FormAssembler(PageAssembler pageAssembler)
        {
            _pageAssembler = pageAssembler;
        }
        
        public void Map(UpdateFormInput input, Form form)
        {
            Check.NotNull(input, nameof(input));
            Check.NotNull(form, nameof(form));

            if (input.Pages.Count != form.Pages.Count)
                throw new ArgumentOutOfRangeException(nameof(input.Pages));

            for (var index = 0; index < form.Pages.Count; ++index)
            {
                _pageAssembler.Map(input.Pages[index], form.GetPage(index));
            }
        }
    }
}
