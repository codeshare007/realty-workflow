using System;
using System.Diagnostics;
using System.Linq;
using Abp.IdentityServer4;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization.Delegation;
using Realty.Authorization.Roles;
using Realty.Authorization.Users;
using Realty.Chat;
using Realty.Communications;
using Realty.Contacts;
using Realty.Controls;
using Realty.Editions;
using Realty.EntityConfigurations;
using Realty.Forms;
using Realty.Friendships;
using Realty.Leads;
using Realty.Libraries;
using Realty.Listings;
using Realty.MultiTenancy;
using Realty.MultiTenancy.Accounting;
using Realty.MultiTenancy.Payments;
using Realty.Reflection;
using Realty.Signings;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.EntityFrameworkCore
{
    public class RealtyDbContext : AbpZeroDbContext<Tenant, Role, User, RealtyDbContext>, IAbpPersistedGrantDbContext
    {
        /* Define an IDbSet for each entity of the application */

        public virtual DbSet<BinaryObject> BinaryObjects { get; set; }

        public virtual DbSet<Friendship> Friendships { get; set; }

        public virtual DbSet<ChatMessage> ChatMessages { get; set; }

        public virtual DbSet<SubscribableEdition> SubscribableEditions { get; set; }

        public virtual DbSet<SubscriptionPayment> SubscriptionPayments { get; set; }

        public virtual DbSet<Invoice> Invoices { get; set; }

        public virtual DbSet<PersistedGrantEntity> PersistedGrants { get; set; }

        public virtual DbSet<SubscriptionPaymentExtensionData> SubscriptionPaymentExtensionDatas { get; set; }

        public virtual DbSet<UserDelegation> UserDelegations { get; set; }
        
        public virtual DbSet<CommunicationMessage> CommunicationMessages { get; set; }
        public virtual DbSet<UsersFilters> UsersFilters { get; set; }
        public virtual DbSet<FiltersFeaturesSelected> FiltersFeaturesSelected { get; set; }
        public virtual DbSet<PetsFilterSelected> PetsFilterSelected { get; set; }
        public virtual DbSet<StatusFilterSelected> StatusFilterSelected { get; set; }
        public virtual DbSet<MediaFilterSelected> MediaFilterSelected { get; set; }
        public virtual DbSet<FeesFilterSelected> FeesFilterSelected { get; set; }
        public virtual DbSet<ParkingFilterSelected> ParkingFilterSelected { get; set; }
        public virtual DbSet<Lead> Leads { get; set; }
        public virtual DbSet<Listing> Listings { get; set; }
        public virtual DbSet<RecommendedListing> RecommendedListings { get; set; }
        public virtual DbSet<Contact> Contacts { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<Library> Libraries { get; set; }
        public virtual DbSet<Signing> Signings { get; set; }
        public virtual DbSet<TransactionContact> TransactionContacts { get; set; }
        public virtual DbSet<File> Files { get; set; }
        public virtual DbSet<Control> Controls { get; set; }

        public RealtyDbContext(DbContextOptions<RealtyDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<BinaryObject>(b =>
            {
                b.HasIndex(e => new { e.TenantId });
            });

            modelBuilder.Entity<ChatMessage>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId, e.ReadState });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.UserId, e.ReadState });
            });

            modelBuilder.Entity<Friendship>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId });
                b.HasIndex(e => new { e.TenantId, e.FriendUserId });
                b.HasIndex(e => new { e.FriendTenantId, e.UserId });
                b.HasIndex(e => new { e.FriendTenantId, e.FriendUserId });
            });

            modelBuilder.Entity<Tenant>(b =>
            {
                b.HasIndex(e => new { e.SubscriptionEndDateUtc });
                b.HasIndex(e => new { e.CreationTime });
            });

            modelBuilder.Entity<SubscriptionPayment>(b =>
            {
                b.HasIndex(e => new { e.Status, e.CreationTime });
                b.HasIndex(e => new { PaymentId = e.ExternalPaymentId, e.Gateway });
            });

            modelBuilder.Entity<SubscriptionPaymentExtensionData>(b =>
            {
                b.HasQueryFilter(m => !m.IsDeleted)
                    .HasIndex(e => new { e.SubscriptionPaymentId, e.Key, e.IsDeleted })
                    .IsUnique();
            });

            modelBuilder.Entity<UserDelegation>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.SourceUserId });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId });
            });

            modelBuilder.Entity<CommunicationMessage>(
                b =>
                {
                    b.HasOne(x => x.User)
                        .WithMany()
                        .IsRequired()
                        .HasForeignKey(x => x.UserId)
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne(x => x.ContactUser)
                        .WithMany()
                        .HasForeignKey(x => x.ContactUserId)
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne(x => x.SenderUser)
                        .WithMany()
                        .HasForeignKey(x => x.SenderUserId)
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne(x => x.ToUser)
                        .WithMany()
                        .HasForeignKey(x => x.ToUserId)
                        .OnDelete(DeleteBehavior.NoAction);
                    
                    b.HasIndex(e => new { e.TenantId });
                    b.HasIndex(e => new { e.ReceivedOnUtc });
                }
            );

            modelBuilder.Entity<User>().Property(x => x.PublicId).HasDefaultValueSql("NEWID()");

            modelBuilder.ConfigurePersistedGrantEntity();

            RegisterExternalConfigurations(modelBuilder);
        }

        /// <summary>
        ///     Registers the external configurations.
        ///     Used to apply external configuration classes that are inherited from IEntityTypeConfiguration
        /// </summary>
        /// <param name="modelBuilder">The model builder.</param>
        private void RegisterExternalConfigurations(ModelBuilder modelBuilder)
        {
            // Find all types that inherit from IEntityTypeConfiguration
            var configurationTypes = AppDomain.CurrentDomain.GetLoadableTypes()
                .Where(t => typeof(IEntityTypeConfiguration).IsAssignableFrom(t) && !t.IsAbstract);

            // Get the ApplyConfiguration() method for modelBuilder
            var applyConfigurationMethod = modelBuilder.GetType()
                .GetMethods()
                .Where(info => info.Name == nameof(ModelBuilder.ApplyConfiguration))
                .First(info => info.GetGenericArguments().Any(arg => arg.Name == "TEntity"));

            // Get the IEntityTypeConfigurationWithModelBuilder.Configure() method
            var modelBuilderConfigure = typeof(IEntityTypeConfigurationWithModelBuilder).GetMethod(
                nameof(IEntityTypeConfigurationWithModelBuilder.Configure)
            );
            Debug.Assert(modelBuilderConfigure != null, nameof(modelBuilderConfigure) + " != null");

            foreach (var configurationType in configurationTypes)
            {
                // Create the instance of configuration type
                var configurationTypeObject = Activator.CreateInstance(configurationType);

                // Call the IEntityTypeConfigurationWithModelBuilder.Configure() method
                if (typeof(IEntityTypeConfigurationWithModelBuilder).IsAssignableFrom(configurationType))
                    modelBuilderConfigure.Invoke(configurationTypeObject, new object[] { modelBuilder });

                // Get the generic interface
                var genericInterface = configurationType.GetInterfaces()
                    .First(interfaceType =>
                        interfaceType.FullName != null &&
                        interfaceType.FullName.StartsWith("Microsoft.EntityFrameworkCore.IEntityTypeConfiguration")
                    );

                // Get the type of entity from the generic interface's type
                var entityType = genericInterface.GetGenericArguments().First();

                // Use the specific method for this type
                // Same as: modelBuilder.ApplyConfiguration(new OrderConfiguration());
                applyConfigurationMethod.MakeGenericMethod(entityType)
                    .Invoke(modelBuilder, new[] { configurationTypeObject });
            }
        }
    }
}
