using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.DynamicEntityProperties;
using Abp.EntityHistory;
using Abp.Localization;
using Abp.Notifications;
using Abp.Organizations;
using Abp.UI.Inputs;
using Abp.Webhooks;
using AutoMapper;
using Realty.Auditing.Dto;
using Realty.Authorization.Accounts.Dto;
using Realty.Authorization.Delegation;
using Realty.Authorization.Permissions.Dto;
using Realty.Authorization.Roles;
using Realty.Authorization.Roles.Dto;
using Realty.Authorization.Users;
using Realty.Authorization.Users.Delegation.Dto;
using Realty.Authorization.Users.Dto;
using Realty.Authorization.Users.Importing.Dto;
using Realty.Authorization.Users.Profile.Dto;
using Realty.Chat;
using Realty.Chat.Dto;
using Realty.Contacts;
using Realty.Contacts.Dto;
using Realty.DynamicEntityProperties.Dto;
using Realty.Editions;
using Realty.Editions.Dto;
using Realty.Friendships;
using Realty.Friendships.Cache;
using Realty.Friendships.Dto;
using Realty.Leads;
using Realty.Leads.Dto;
using Realty.Leads.Input;
using Realty.Listings;
using Realty.Listings.Dto;
using Realty.Localization.Dto;
using Realty.MultiTenancy;
using Realty.MultiTenancy.Dto;
using Realty.MultiTenancy.HostDashboard.Dto;
using Realty.MultiTenancy.Payments;
using Realty.MultiTenancy.Payments.Dto;
using Realty.Notifications.Dto;
using Realty.Organizations.Dto;
using Realty.Sessions.Dto;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;
using Realty.WebHooks.Dto;
using System;
using Realty.RecommendedListings.Input;
using Realty.RecommendedListings.Dto;
using Realty.Transactions;
using System.Collections.Generic;
using System.Linq;
using Realty.Signings;
using Realty.Signings.Dto;
using Realty.Signings.Input;
using Realty.TransactionParticipants.Dto;
using Realty.SigningParticipants.Dto;
using Realty.TransactionPaymentTrackers.Dto;
using Realty.TransactionPaymentTrackers;
using Realty.TransactionAdditionalFees.Dto;
using Realty.TransactionPayments.Dto;
using Realty.Forms.Input;
using Realty.Forms;

namespace Realty.AutoMapping
{
    internal static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            //Inputs
            configuration.CreateMap<CheckboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<SingleLineStringInputType, FeatureInputTypeDto>();
            configuration.CreateMap<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<IInputType, FeatureInputTypeDto>()
                .Include<CheckboxInputType, FeatureInputTypeDto>()
                .Include<SingleLineStringInputType, FeatureInputTypeDto>()
                .Include<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<ILocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>()
                .Include<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<LocalizableComboboxItem, LocalizableComboboxItemDto>();
            configuration.CreateMap<ILocalizableComboboxItem, LocalizableComboboxItemDto>()
                .Include<LocalizableComboboxItem, LocalizableComboboxItemDto>();

            //Chat
            configuration.CreateMap<ChatMessage, ChatMessageDto>();
            configuration.CreateMap<ChatMessage, ChatMessageExportDto>();

            //Feature
            configuration.CreateMap<FlatFeatureSelectDto, Feature>().ReverseMap();
            configuration.CreateMap<Feature, FlatFeatureDto>();

            //Role
            configuration.CreateMap<RoleEditDto, Role>().ReverseMap();
            configuration.CreateMap<Role, RoleListDto>();
            configuration.CreateMap<UserRole, UserListRoleDto>();

            //Edition
            configuration.CreateMap<EditionEditDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<EditionCreateDto, SubscribableEdition>();
            configuration.CreateMap<EditionSelectDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<Edition, EditionInfoDto>().Include<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<SubscribableEdition, EditionListDto>();
            configuration.CreateMap<Edition, EditionEditDto>();
            configuration.CreateMap<Edition, SubscribableEdition>();
            configuration.CreateMap<Edition, EditionSelectDto>();


            //Payment
            configuration.CreateMap<SubscriptionPaymentDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPaymentListDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPayment, SubscriptionPaymentInfoDto>();

            //Permission
            configuration.CreateMap<Permission, FlatPermissionDto>();
            configuration.CreateMap<Permission, FlatPermissionWithLevelDto>();

            //Language
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageListDto>();
            configuration.CreateMap<NotificationDefinition, NotificationSubscriptionWithDisplayNameDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>()
                .ForMember(ldto => ldto.IsEnabled, options => options.MapFrom(l => !l.IsDisabled));

            //Tenant
            configuration.CreateMap<Tenant, RecentTenant>();
            configuration.CreateMap<Tenant, TenantLoginInfoDto>();
            configuration.CreateMap<Tenant, TenantListDto>();
            configuration.CreateMap<TenantEditDto, Tenant>().ReverseMap();
            configuration.CreateMap<CurrentTenantInfoDto, Tenant>().ReverseMap();

            configuration.CreateMap<CreateFormInput, Form>()
                .ForMember(dto => dto.Width, options => options.Ignore())
                .ForMember(dto => dto.Height, options => options.Ignore());

            //User
            configuration.CreateMap<User, UserEditDto>()
                .ForMember(dto => dto.Password, options => options.Ignore())
                .ReverseMap()
                .ForMember(user => user.Password, options => options.Ignore());
            configuration.CreateMap<User, UserLoginInfoDto>();
            configuration.CreateMap<User, UserListDto>();
            configuration.CreateMap<User, ChatUserDto>();
            configuration.CreateMap<User, OrganizationUnitUserListDto>();
            configuration.CreateMap<Role, OrganizationUnitRoleListDto>();
            configuration.CreateMap<CurrentUserProfileEditDto, User>().ReverseMap();
            configuration.CreateMap<UserLoginAttemptDto, UserLoginAttempt>().ReverseMap();
            configuration.CreateMap<ImportUserDto, User>();

            //AuditLog
            configuration.CreateMap<AuditLog, AuditLogListDto>();
            configuration.CreateMap<EntityChange, EntityChangeListDto>();
            configuration.CreateMap<EntityPropertyChange, EntityPropertyChangeDto>();

            
             configuration.CreateMap<SigningParticipant, ContactTableDto>().
                 ForMember(a=> a.ParentName, b=> b.MapFrom(c=> c.Signing.Name))
                 .ForMember(a=> a.ParentId, b=> b.MapFrom(c=> c.Signing.Id));

             configuration.CreateMap<LeadContact, ContactTableDto>()
                 .ForMember(a => a.ParentId, b => b.MapFrom(c => c.Lead.Id));



             configuration.CreateMap<TransactionParticipant, ContactTableDto>().
                 ForMember(a => a.ParentName, b => b.MapFrom(c => c.Transaction.Name))
                 .ForMember(a => a.ParentId, b => b.MapFrom(c => c.Transaction.Id));



            //Friendship
            configuration.CreateMap<Friendship, FriendDto>();
            configuration.CreateMap<FriendCacheItem, FriendDto>();

            //OrganizationUnit
            configuration.CreateMap<OrganizationUnit, OrganizationUnitDto>();

            //Webhooks
            configuration.CreateMap<WebhookSubscription, GetAllSubscriptionsOutput>();
            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOutput>()
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.WebhookName,
                    options => options.MapFrom(l => l.WebhookEvent.WebhookName))
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.Data,
                    options => options.MapFrom(l => l.WebhookEvent.Data));

            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOfWebhookEventOutput>();

            configuration.CreateMap<DynamicProperty, DynamicPropertyDto>().ReverseMap();
            configuration.CreateMap<DynamicPropertyValue, DynamicPropertyValueDto>().ReverseMap();
            configuration.CreateMap<DynamicEntityProperty, DynamicEntityPropertyDto>()
                .ForMember(dto => dto.DynamicPropertyName,
                    options => options.MapFrom(entity => entity.DynamicProperty.PropertyName));
            configuration.CreateMap<DynamicEntityPropertyDto, DynamicEntityProperty>();

            configuration.CreateMap<DynamicEntityPropertyValue, DynamicEntityPropertyValueDto>().ReverseMap();
            
            //User Delegations
            configuration.CreateMap<CreateUserDelegationDto, UserDelegation>();

            /* ADD YOUR OWN CUSTOM AUTOMAPPER MAPPINGS HERE */

            // Get all profiles from current assembly

            configuration.AddMaps(typeof(CustomDtoMapper));

            configuration.CreateMap<UsersFilters, UsersFilterDto>()
                .ForMember(a => a.Parking, o => o.MapFrom(b => b.Parking))
                .ForMember(a => a.Features, o => o.MapFrom(b => b.Features))
                .ForMember(a => a.Pets, o => o.MapFrom(b => b.Pets))
                .ForMember(a => a.Fees, o => o.MapFrom(b => b.Fees))
                .ForMember(a => a.Media, o => o.MapFrom(b => b.Media))
                .ForMember(a => a.Statuses, o => o.MapFrom(b => b.Statuses)).ReverseMap();

            configuration.CreateMap<FiltersFeaturesSelected, FeaturesFiltersSelectedDto>().ReverseMap();
            configuration.CreateMap<PetsFilterSelected, PetsFiltersSelectedDto>().ReverseMap();
            configuration.CreateMap<StatusFilterSelected, StatusFilterSelectedDto>().ReverseMap();
            configuration.CreateMap<MediaFilterSelected, MediaFilterSelectedDto>().ReverseMap();
            configuration.CreateMap<FeesFilterSelected, FeeFilterSelectedDto>().ReverseMap();
            configuration.CreateMap<ParkingFilterSelected, ParkingFeatureSelectedDto>().ReverseMap();
            configuration.CreateMap<ParkingXml, ParkingDto>().ReverseMap();

            configuration.CreateMap<JGLListing, ListingResposeDto>()
                .ForMember(a => a.Parking, o => o.MapFrom(c => c.Parking))
                .ForMember(a => a.Photo, o => o.MapFrom(c => c.Photos.Photo))
                .ForMember(a => a.VirtualTour, o => o.MapFrom(c => c.VirtualTours.VirtualTour))
                .ForMember(a => a.Video, o => o.MapFrom(c => c.Videos.Video));
            
            configuration.CreateMap<Listing, KeyValuePair<Guid, string>>()
                .ForMember(a => a.Key, o => o.MapFrom(c => c.Id))
                .ForMember(a => a.Value, o => o.MapFrom(c => c.YglID));

            configuration.CreateMap<Lead, LeadEditDto>()
                .ForMember(a => a.AgentId, o => o.MapFrom(c => c.Agent != null ? c.Agent.PublicId : (Guid?)null))
                .ForMember(a => a.CustomerId, o => o.MapFrom(c => c.Customer != null ? c.Customer.PublicId : (Guid?)null))
                .ForMember(a => a.Agent, o => o.MapFrom(c => c.Agent != null ? c.Agent.FullName : null))
                .ForMember(a => a.Customer, o => o.MapFrom(c => c.Customer != null ? c.Customer.FullName : null))
                .ForMember(a => a.Tags, o => o.MapFrom(c => c.Tags != null ? c.Tags.Split(',', System.StringSplitOptions.RemoveEmptyEntries) : new string[0]))
                .ForMember(a => a.Cities, o => o.MapFrom(c => c.Cities != null ? c.Cities.Split(',', System.StringSplitOptions.RemoveEmptyEntries) : new string[0]))
                .ForMember(a => a.Pets, o => o.MapFrom(c => c.Pets != null ? c.Pets.Split(',', System.StringSplitOptions.RemoveEmptyEntries) : new string[0]))
                .ForMember(a => a.Bedrooms, o => o.MapFrom(c => c.Bedrooms != null ? c.Bedrooms.Split(',', System.StringSplitOptions.RemoveEmptyEntries) : new string[0]))
                .ForMember(a => a.Bathrooms, o => o.MapFrom(c => c.Bathrooms != null ? c.Bathrooms.Split(',', System.StringSplitOptions.RemoveEmptyEntries) : new string[0]))
                .ForMember(a => a.Contact, o => o.MapFrom(c => c.LeadContacts.FirstOrDefault()));

            configuration.CreateMap<LeadEditDto, Lead>()
                .ForMember(l => l.Customer, options => options.Ignore())
                .ForMember(l => l.Agent, options => options.Ignore())
                .ForMember(l => l.AgentId, options => options.Ignore())
                .ForMember(l => l.CustomerId, options => options.Ignore())
                .ForMember(a => a.Tags, o => o.MapFrom(c => c.Tags != null && c.Tags.Length > 0 ? string.Join(',', c.Tags) : null))
                .ForMember(a => a.Cities, o => o.MapFrom(c => c.Cities != null && c.Cities.Length > 0 ? string.Join(',', c.Cities) : null))
                .ForMember(a => a.Pets, o => o.MapFrom(c => c.Pets != null && c.Pets.Length > 0 ? string.Join(',', c.Pets) : null))
                .ForMember(a => a.Bedrooms, o => o.MapFrom(c => c.Bedrooms != null && c.Bedrooms.Length > 0 ? string.Join(',', c.Bedrooms) : null))
                .ForMember(a => a.Bathrooms, o => o.MapFrom(c => c.Bathrooms != null && c.Bathrooms.Length > 0 ? string.Join(',', c.Bathrooms) : null));

            configuration.CreateMap<Lead, LeadListDto>()
                .ForMember(a => a.LastViewDate, o => o.MapFrom(c => c.RecommendedListings.Where(r => r.LastViewDate.HasValue).Select(r => r.LastViewDate).OrderByDescending(r => r).FirstOrDefault()))
                .ForMember(a => a.HasInterest, o => o.MapFrom(c => c.RecommendedListings.Any(r => r.RequestedTourDate.HasValue || r.LeadQuestion != null)))
                .ForMember(a => a.Agent, o => o.MapFrom(c => c.Agent != null ? c.Agent.FullName : null))
                .ForMember(a => a.Customer, o => o.MapFrom(c => c.Customer != null ? c.Customer.FullName : null))
                .ForMember(a => a.Contact, o => o.MapFrom(c => c.LeadContacts.FirstOrDefault()));

            configuration.CreateMap<Lead, KeyValuePair<Guid, string>>()
                .ForMember(a => a.Key, o => o.MapFrom(c => c.Id))
                .ForMember(a => a.Value, o => o.MapFrom(c => c.ExternalId));

            configuration.CreateMap<CreateLeadInput, Lead>()
                .ForMember(l => l.Customer, options => options.Ignore())
                .ForMember(l => l.Agent, options => options.Ignore())
                .ForMember(l => l.AgentId, options => options.Ignore())
                .ForMember(l => l.CustomerId, options => options.Ignore());
            configuration.CreateMap<JGLListing, ListingResposeDto>();

            configuration.CreateMap<ContactDto, LeadContact>();
            configuration.CreateMap<ContactDto, Contact>();
            configuration.CreateMap<Contact, ContactDto>();
            configuration.CreateMap<Contact, ContactListDto>();
            configuration.CreateMap<ContactDto, LeadContact>();
            configuration.CreateMap<Contact, ContactInfoDto>();

            configuration.CreateMap<ContactDto, LeadContact>();

            configuration.CreateMap<LeadContact, TransactionParticipant>()
                .ForMember(l => l.Id, options => options.Ignore());
            configuration.CreateMap<TransactionParticipantDto, TransactionParticipant>();
            configuration.CreateMap<TransactionParticipant, TransactionParticipantDto>();
            configuration.CreateMap<TransactionParticipant, ContactListDto>();

            configuration.CreateMap<TransactionParticipant, SigningParticipant>()
                .ForMember(l => l.Id, options => options.Ignore());
            
            configuration.CreateMap<Address, AddressDto>();
            configuration.CreateMap<AddressDto, Address>();

            configuration.CreateMap<Transaction, TransactionSearchDto>();
            configuration.CreateMap<Transaction, TransactionListDto>()
                .ForMember(a => a.Agent, o => o.MapFrom(c => c.Agent != null ? c.Agent.FullName : null))
                .ForMember(a => a.Customer, o => o.MapFrom(c => c.Customer != null ? c.Customer.FullName : null));

            configuration.CreateMap<CreateTransactionInput, Transaction>()
                .ForMember(l => l.Customer, options => options.Ignore())
                .ForMember(l => l.Agent, options => options.Ignore())
                .ForMember(l => l.AgentId, options => options.Ignore())
                .ForMember(l => l.CustomerId, options => options.Ignore());

            configuration.CreateMap<Transaction, TransactionEditDto>()
                .ForMember(a => a.Agent, o => o.MapFrom(c => c.Agent != null ? c.Agent.FullName : null))
                .ForMember(a => a.Customer, o => o.MapFrom(c => c.Customer != null ? c.Customer.FullName : null))
                .ForMember(a => a.ListingCode, o => o.MapFrom(c => c.Listing != null ? c.Listing.YglID : null))
                .ForMember(a => a.LeadCode, o => o.MapFrom(c => c.Lead != null ? c.Lead.ExternalId : null))
                .ForMember(a => a.AgentId, o => o.MapFrom(c => c.Agent != null ? c.Agent.PublicId : (Guid?)null))
                .ForMember(a => a.CustomerId, o => o.MapFrom(c => c.Customer != null ? c.Customer.PublicId : (Guid?)null));

            configuration.CreateMap<TransactionEditDto, Transaction>()
                .ForMember(l => l.Customer, options => options.Ignore())
                .ForMember(l => l.Agent, options => options.Ignore())
                .ForMember(l => l.AgentId, options => options.Ignore())
                .ForMember(l => l.CustomerId, options => options.Ignore());

            configuration.CreateMap<User, UserShortInfoDto>();
            configuration.CreateMap<CreateRecommendedListingInput, RecommendedListing>();

            
            configuration.CreateMap<MoveInCostsXml, Listings.MoveInCosts>();
            configuration.CreateMap<JGLListing, Listing>()
                .ForMember(l => l.Id, options => options.Ignore())
                .ForMember(l => l.Source, o => o.MapFrom(c => Listings.ListingSource.YGL))
                .ForMember(a => a.ExternalSource, o => o.MapFrom(c => c.Source))
                .ForMember(a => a.ExternalID, o => o.MapFrom(c => c.ExternalID))
                .ForMember(a => a.YglID, o => o.MapFrom(c => c.ID))
                .ForMember(a => a.StreetNumber, o => o.MapFrom(c => c.StreetNumber))
                .ForMember(a => a.Parking, 
                        o => o.MapFrom(c => 
                                        c.Parking == null 
                                        ? null 
                                        : new Listings.Parking() { 
                                            Availability = c.Parking.ParkingAvailability,
                                            ParkingNumber = c.Parking.ParkingNumber,
                                            Type = c.Parking.ParkingType,
                                        }));

            configuration.CreateMap<User, UserSearchDto>()
                .ForMember(l => l.Name, o => o.MapFrom(c => c.FullName));

            configuration.CreateMap<RecommendedListing, RecommendedListingListDto>()
                .ForMember(l => l.AddedOn, o => o.MapFrom(c => c.CreationTime))
                .ForMember(l => l.YglListingId, o => o.MapFrom(c => c.Listing.YglID))
                .ForMember(l => l.Zip, o => o.MapFrom(c => c.Listing.Zip))
                .ForMember(l => l.State, o => o.MapFrom(c => c.Listing.State))
                .ForMember(l => l.City, o => o.MapFrom(c => c.Listing.City))
                .ForMember(l => l.StreetNumber, o => o.MapFrom(c => c.Listing.StreetNumber))
                .ForMember(l => l.StreetName, o => o.MapFrom(c => c.Listing.StreetName))
                .ForMember(l => l.Unit, o => o.MapFrom(c => c.Listing.Unit))
                .ForMember(l => l.Price, o => o.MapFrom(c => c.Listing.Price))
                .ForMember(l => l.Beds, o => o.MapFrom(c => c.Listing.Beds))
                .ForMember(l => l.BedInfo, o => o.MapFrom(c => c.Listing.BedInfo))
                .ForMember(l => l.Baths, o => o.MapFrom(c => c.Listing.Baths))
                .ForMember(l => l.AvailableDate, o => o.MapFrom(c => c.Listing.AvailableDate));
            
            configuration.CreateMap<TransactionPaymentTracker, TransactionPaymentTrackerDto>();


            configuration.CreateMap<UpdateTransactionPaymentTrackerInput, TransactionPaymentTracker>()
                .ForMember(l => l.Id, options => options.Ignore());

            configuration.CreateMap<TransactionAdditionalFee, TransactionAdditionalFeeDto>();
            configuration.CreateMap<TransactionAdditionalFeeDto, TransactionAdditionalFee>()
                .ForMember(l => l.Id, options => options.Ignore());

            configuration.CreateMap<Payment, TransactionPaymentListDto>();
            configuration.CreateMap<Payment, TransactionPaymentDto>();
            configuration.CreateMap<CreatePaymentInput, Payment>()
                .ForMember(l => l.Id, options => options.Ignore());
            configuration.CreateMap<UpdatePaymentInput, Payment>()
                .ForMember(l => l.Id, options => options.Ignore());

            configuration.CreateMap<Listing, ListingDto>();
            configuration.CreateMap<Listing, PublicListingDto>();
            configuration.CreateMap<Parking, ParkingItemDto>();
            configuration.CreateMap<MoveInCosts, MoveInCostsDto>();
            configuration.CreateMap<RecommendedListing, RecommendedListingDto>();
            configuration.CreateMap<RecommendedListing, RecommendedPublicListingDto>()
                .ForMember(l => l.AgentFullName, o => o.MapFrom(c => c.Lead.Agent != null ? c.Lead.Agent.FullName : string.Empty))
                .ForMember(l => l.AgentPhone, o => o.MapFrom(c => c.Lead.Agent != null ? c.Lead.Agent.PhoneNumber : string.Empty))
                .ForMember(l => l.AgentEmail, o => o.MapFrom(c => c.Lead.Agent != null ? c.Lead.Agent.EmailAddress : string.Empty))
                .ForMember(l => l.TenantId, o => o.MapFrom(c => c.TenantId));

        }
    }
}
