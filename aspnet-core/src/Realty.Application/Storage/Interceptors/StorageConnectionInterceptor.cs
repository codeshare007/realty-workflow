using System.Threading.Tasks;
using Abp.Threading;
using Castle.DynamicProxy;
using Realty.Common;
using Realty.Storage.Exceptions;

namespace Realty.Storage.Interceptors
{
    internal class StorageConnectionInterceptor : IInterceptor
    {
        private readonly StorageExceptionHandler _storageExceptionHandler;

        public StorageConnectionInterceptor(StorageExceptionHandler storageExceptionHandler)
        {
            _storageExceptionHandler = storageExceptionHandler;
        }

        public void Intercept(IInvocation invocation)
        {
            if (invocation.Method.IsAsync() && invocation.Method.ReturnType == typeof(Task))
            {
                invocation.Proceed();
                invocation.ReturnValue = InternalAsyncHelper.AwaitTaskWithFinally<StorageConnectionException>(
                    (Task)invocation.ReturnValue,
                    exception => _storageExceptionHandler.Process(exception)
                );
            }
            else if (invocation.Method.IsAsync())
            {
                invocation.Proceed();
                invocation.ReturnValue = InternalAsyncHelper.CallAwaitTaskWithFinallyAndGetResult<StorageConnectionException>(
                    invocation.Method.ReturnType.GenericTypeArguments[0],
                    invocation.ReturnValue,
                    exception => _storageExceptionHandler.Process(exception));
            }
            else
            {
                SyncStorageExceptionCheck(invocation);
            }
        }

        private void SyncStorageExceptionCheck(IInvocation invocation)
        {
            try
            {
                invocation.Proceed();
            }
            catch (StorageConnectionException ex)
            {
                _storageExceptionHandler.Process(ex);
            }
        }
    }
}
