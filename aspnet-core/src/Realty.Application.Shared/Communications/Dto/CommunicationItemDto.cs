using System;

namespace Realty.Communications.Dto
{
    public class CommunicationItemDto
    {
        public long? UserId { get; set; }

        public string Sender { get; set; }
        
        public string SenderName { get; set; }

        public string Receiver { get; set; }
        
        public string ReceiverName { get; set; }

        public string Subject { get; set; }

        public string Message { get; set; }

        public DateTime ReceivedOnUtc { get; set; }
    }
}
