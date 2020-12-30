using System.IO;
using Abp.Dependency;
using Abp.Localization;
using Abp.UI;
using Castle.Core.Logging;
using Realty.Storage.Exceptions;

namespace Realty.Storage
{
    public class StorageExceptionHandler : ITransientDependency
    {
        public ILogger Logger { get; set; }
        public ILocalizationManager LocalizationManager { get; set; }

        public StorageExceptionHandler()
        {
            Logger = NullLogger.Instance;
            LocalizationManager = NullLocalizationManager.Instance;
        }

        public void Process(StorageConnectionException exception)
        {
            if (exception != null)
            {
                Logger.Error(exception.Message, exception);
                var localizedMessage = LocalizationManager.GetString(RealtyConsts.LocalizationSourceName, "StorageHandler_ConnectionException_Message");

                throw new UserFriendlyException(localizedMessage);
            }
        }

        public void Process(FileNotFoundException exception)
        {
            if (exception != null)
            {
                Logger.Error(exception.Message, exception);
                var localizedMessage = LocalizationManager.GetString(RealtyConsts.LocalizationSourceName, "StorageHandler_NotExistsException_Message");

                throw new UserFriendlyException(localizedMessage);
            }
        }
    }
}
