using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Abp;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Runtime.Session;

namespace Realty.Authorization.Users.Profile
{
    public class GravatarProfileImageService : IProfileImageService, ITransientDependency
    {
        private readonly UserManager _userManager;
        private readonly IAbpSession _abpSession;

        public GravatarProfileImageService(
            UserManager userManager,
            IAbpSession abpSession)
        {
            _userManager = userManager;
            _abpSession = abpSession;
        }

        public async Task<string> GetProfilePictureContentForUser(UserIdentifier userIdentifier)
        {
            var user = await _userManager.GetUserAsync(userIdentifier);
            using (var client = new HttpClient())
            {
                using (var response = await client.GetAsync($"https://www.gravatar.com/avatar/{GetMd5Hash(user.EmailAddress)}"))
                {
                    var imageBytes = await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
                    return Convert.ToBase64String(imageBytes);
                }
            }
        }
        
        private static string GetMd5Hash(string input)
        {
            // Convert the input string to a byte array and compute the hash.
            var data = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            var sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data
            // and format each one as a hexadecimal string.
            foreach (var t in data)
            {
                sBuilder.Append(t.ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }
    }
}