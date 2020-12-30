using System.ComponentModel.DataAnnotations;

namespace Realty.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
