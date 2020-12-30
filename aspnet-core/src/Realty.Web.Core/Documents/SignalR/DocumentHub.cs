using Abp.AspNetCore.SignalR.Hubs;
using Abp.RealTime;
using Castle.Windsor;
using Realty.Documents;

namespace Realty.Web.Documents.SignalR
{
    public class DocumentHub: OnlineClientHubBase
    {
        private readonly IWindsorContainer _windsorContainer;
        
        private bool _isCallByRelease;

        public DocumentHub(
            IWindsorContainer windsorContainer, 
            IOnlineClientManager<DocumentChannel> onlineClientManager,
            IOnlineClientInfoProvider clientInfoProvider) : base(onlineClientManager, clientInfoProvider)
        {
            _windsorContainer = windsorContainer;
        }

        public void Register()
        {
            Logger.Debug("A client is registered: " + Context.ConnectionId);
        }

        protected override void Dispose(bool disposing)
        {
            if (_isCallByRelease)
            {
                return;
            }
            base.Dispose(disposing);
            if (disposing)
            {
                _isCallByRelease = true;
                _windsorContainer.Release(this);
            }
        }
    }
}
