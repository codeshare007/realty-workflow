using System;

namespace Realty.Storage.Exceptions
{
    public class StorageConnectionException : Exception
    {
        public StorageConnectionException(string message) : base(message)
        {
        }
    }
}
