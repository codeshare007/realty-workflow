namespace Realty.Storage
{
    public class GetFileResult
    {
        public GetFileResult(byte[] bytes)
        {
            Bytes = bytes;
        }
        public byte[] Bytes { get; }
    }
}
