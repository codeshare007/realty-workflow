using System.ComponentModel.DataAnnotations;

namespace Realty.Libraries.Input
{
    public class CreateLibraryInput
    {
        [MaxLength(Constants.NameMaxLength), MinLength(Constants.NameMinLength)]
        public string Name { get; set; }
    }
}
