using System;
using JetBrains.Annotations;

namespace Realty.AmazonS3.Configuration
{
    public class AmazonS3ClientConfig
    {
        internal AmazonS3ClientConfig()
        {

        }

        public string Bucket { get; private set; }

        public string Region { get; private set; }

        public string Profile { get; private set; }

        public void Init(
            [NotNull] string bucket,
            [NotNull] string region,
            [NotNull] string profile)
        {
            Bucket = bucket ?? throw new ArgumentNullException(nameof(bucket));
            Region = region ?? throw new ArgumentNullException(nameof(region));
            Profile = profile ?? throw new ArgumentNullException(nameof(profile));
        }
    }
}
