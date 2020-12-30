using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Realty.Web.Helpers
{
    public static class FileFormatHelper
    {
        public static ImageFormat GetRawImageFormat(byte[] fileBytes)
        {
            using var ms = new MemoryStream(fileBytes);
            var fileImage = Image.FromStream(ms);
            return fileImage.RawFormat;
        }

        public static bool IsImageContentType(IFormFile file)
        {
            if (file == null)
                return false;
            var fileFormat = file.ContentType;
            var imageTypes = new[] { "image/png", "image/jpg", "image/jpeg" };
            return imageTypes.Contains(fileFormat);
        }

        public static bool IsPdfContentType(IFormFile file)
        {
            if (file == null)
                return false;
            var fileFormat = file.ContentType;
            var fileType = "application/pdf";
            return fileType == fileFormat;
        }
    }
}
