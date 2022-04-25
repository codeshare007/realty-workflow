using System.Collections.Generic;
using Abp.Runtime.Validation;

namespace Realty.Authorization.Users.Dto
{
    public class GetUsersToExcelInput: IShouldNormalize, IGetUsersInput
    {
        public string Filter { get; set; }

        public List<string> Permissions { get; set; }

        public int[] Roles { get; set; }
        public string RoleName { get; set; }

        public bool OnlyLockedUsers { get; set; }

        public string Sorting { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "Name,Surname";
            }
        }
    }
}
