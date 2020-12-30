using System.IO;

namespace Realty.AmazonS3.Helpers
{
    public static class FileHelper
    {
        //public static string GetContentType(string fileExtension)
        //{
        //    var contentType = string.Empty;
        //    switch (fileExtension)
        //    {
        //        case "bmp": contentType = "image/bmp"; break;
        //        case "jpeg": contentType = "image/jpeg"; break;
        //        case "jpg": contentType = "image/jpg"; break;
        //        case "gif": contentType = "image/gif"; break;
        //        case "tiff": contentType = "image/tiff"; break;
        //        case "png": contentType = "image/png"; break;
        //        case "plain": contentType = "text/plain"; break;
        //        case "rtf": contentType = "text/rtf"; break;
        //        case "msword": contentType = "application/msword"; break;
        //        case "zip": contentType = "application/zip"; break;
        //        case "mpeg": contentType = "audio/mpeg"; break;
        //        case "pdf": contentType = "application/pdf"; break;
        //        case "xgzip": contentType = "application/x-gzip"; break;
        //        case "xcompressed": contentType = "applicatoin/x-compressed"; break;
        //    }
        //    return contentType;
        //}

        public static bool IsPathValid(string path)
        {
            return path != null && path.IndexOf('/') >= 0 && path.LastIndexOf('/') != path.Length;
        }

        public static bool IsStreamValid(Stream stream)
        {
            return stream != null && stream.Length > 0;
        }
    }
}
