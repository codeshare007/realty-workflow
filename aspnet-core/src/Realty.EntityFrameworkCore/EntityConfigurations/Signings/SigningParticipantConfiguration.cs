using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Realty.Signings;

namespace Realty.EntityConfigurations.Signings
{
    public class SigningParticipantConfiguration : IEntityTypeConfiguration<SigningParticipant>, IEntityTypeConfiguration
    {
        private const string TableName = "SigningParticipants";
        public void Configure(EntityTypeBuilder<SigningParticipant> builder)
        {
            builder.ToTable(TableName);
        }
    }
}
