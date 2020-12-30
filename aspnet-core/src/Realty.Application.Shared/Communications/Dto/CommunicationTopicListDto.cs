using System;

namespace Realty.Communications.Dto
{
    public class CommunicationTopicListDto
    {
        public string Contact { get; set; }

        public long? UserId { get; set; }

        public string FullName { get; set; }

        public string Subject { get; set; }

        public string Message { get; set; }

        public DateTime ReceivedOnUtc { get; set; }

        public bool IsRead { get; set; }

        public int MessagesCount { get; set; }
    }
}
