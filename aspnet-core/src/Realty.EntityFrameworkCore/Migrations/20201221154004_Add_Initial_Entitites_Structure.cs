using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Initial_Entitites_Structure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    StreetNumber = table.Column<string>(nullable: true),
                    StreetName = table.Column<string>(nullable: true),
                    UnitNumber = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    ZipCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ControlValues",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Value = table.Column<string>(maxLength: 2048, nullable: true),
                    TenantId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ControlValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ControlValues_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Path = table.Column<string>(nullable: true),
                    ExternalId = table.Column<string>(nullable: true),
                    ContentType = table.Column<string>(nullable: true),
                    TenantId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Files_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Listings",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Source = table.Column<int>(nullable: false),
                    ExternalSource = table.Column<string>(nullable: true),
                    ExternalID = table.Column<string>(nullable: true),
                    YglID = table.Column<string>(nullable: true),
                    StreetNumber = table.Column<string>(nullable: true),
                    StreetName = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    Neighborhood = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    Zip = table.Column<string>(nullable: true),
                    Unit = table.Column<string>(nullable: true),
                    Latitude = table.Column<string>(nullable: true),
                    Longitude = table.Column<string>(nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: false),
                    UpdateDate = table.Column<DateTime>(nullable: false),
                    Beds = table.Column<string>(nullable: true),
                    BedInfo = table.Column<string>(nullable: true),
                    Room = table.Column<string>(nullable: true),
                    Baths = table.Column<string>(nullable: true),
                    AvailableDate = table.Column<DateTime>(nullable: true),
                    Price = table.Column<string>(nullable: true),
                    Fee = table.Column<string>(nullable: true),
                    Status = table.Column<string>(nullable: true),
                    Laundry = table.Column<string>(nullable: true),
                    IncludeElectricity = table.Column<string>(nullable: true),
                    IncludeGas = table.Column<string>(nullable: true),
                    IncludeHeat = table.Column<string>(nullable: true),
                    IncludeHotWater = table.Column<string>(nullable: true),
                    ListingAgentID = table.Column<string>(nullable: true),
                    MlsOfficeName = table.Column<string>(nullable: true),
                    UnitDescription = table.Column<string>(nullable: true),
                    Pet = table.Column<string>(nullable: true),
                    SquareFootage = table.Column<string>(nullable: true),
                    UnitLevel = table.Column<string>(nullable: true),
                    Parking_Availability = table.Column<string>(nullable: true),
                    Parking_ParkingNumber = table.Column<string>(nullable: true),
                    Parking_Type = table.Column<string>(nullable: true),
                    MoveInCosts_IsFirstMonthRequired = table.Column<bool>(nullable: true),
                    MoveInCosts_IsLastMonthRequired = table.Column<bool>(nullable: true),
                    MoveInCosts_PetDeposit = table.Column<decimal>(nullable: true),
                    MoveInCosts_Fee = table.Column<decimal>(nullable: true),
                    MoveInCosts_KeyDeposit = table.Column<decimal>(nullable: true),
                    MoveInCosts_SecurityDeposit = table.Column<decimal>(nullable: true),
                    MoveInCosts_ApplicationFee = table.Column<decimal>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    AgentId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Listings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Listings_AbpUsers_AgentId",
                        column: x => x.AgentId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Listings_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsersFilters",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Street = table.Column<string>(nullable: true),
                    StreetName = table.Column<string>(nullable: true),
                    Unit = table.Column<string>(nullable: true),
                    ListeningId = table.Column<string>(nullable: true),
                    ZipCode = table.Column<string>(nullable: true),
                    Beds = table.Column<decimal>(nullable: true),
                    IsRoom = table.Column<bool>(nullable: true),
                    IsStudio = table.Column<bool>(nullable: false),
                    MinRent = table.Column<decimal>(nullable: true),
                    MaxRent = table.Column<decimal>(nullable: true),
                    MinBath = table.Column<decimal>(nullable: true),
                    AvailableFrom = table.Column<DateTime>(nullable: true),
                    AvailableTo = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersFilters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsersFilters_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    MiddleName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    LegalName = table.Column<string>(nullable: true),
                    PreferredSignature = table.Column<string>(nullable: true),
                    PreferredInitials = table.Column<string>(nullable: true),
                    Firm = table.Column<string>(nullable: true),
                    Suffix = table.Column<string>(nullable: true),
                    Company = table.Column<string>(nullable: true),
                    AddressId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contacts_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Forms",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    Type = table.Column<int>(nullable: false),
                    FileId = table.Column<Guid>(nullable: false),
                    TenantId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Forms_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Forms_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListingDetail",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ListingId = table.Column<Guid>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Data = table.Column<string>(nullable: true),
                    Comment = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListingDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListingDetail_Listings_ListingId",
                        column: x => x.ListingId,
                        principalTable: "Listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FeesFilterSelected",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Fee = table.Column<int>(nullable: false),
                    Selected = table.Column<bool>(nullable: false),
                    UserFilterId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeesFilterSelected", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeesFilterSelected_UsersFilters_UserFilterId",
                        column: x => x.UserFilterId,
                        principalTable: "UsersFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FiltersFeaturesSelected",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Feature = table.Column<string>(nullable: true),
                    Selected = table.Column<bool>(nullable: false),
                    UserFilterId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FiltersFeaturesSelected", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FiltersFeaturesSelected_UsersFilters_UserFilterId",
                        column: x => x.UserFilterId,
                        principalTable: "UsersFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MediaFilterSelected",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Media = table.Column<int>(nullable: false),
                    Selected = table.Column<bool>(nullable: false),
                    UserFilterId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaFilterSelected", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MediaFilterSelected_UsersFilters_UserFilterId",
                        column: x => x.UserFilterId,
                        principalTable: "UsersFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParkingFilterSelected",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Feature = table.Column<string>(nullable: true),
                    Selected = table.Column<bool>(nullable: false),
                    UserFilterId = table.Column<Guid>(nullable: false),
                    Filter = table.Column<int>(nullable: false),
                    UsersFiltersId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParkingFilterSelected", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParkingFilterSelected_UsersFilters_UsersFiltersId",
                        column: x => x.UsersFiltersId,
                        principalTable: "UsersFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PetsFilterSelected",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Pet = table.Column<int>(nullable: false),
                    Selected = table.Column<bool>(nullable: false),
                    UserFilterId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetsFilterSelected", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PetsFilterSelected_UsersFilters_UserFilterId",
                        column: x => x.UserFilterId,
                        principalTable: "UsersFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StatusFilterSelected",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    Selected = table.Column<bool>(nullable: false),
                    UserFilterId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusFilterSelected", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StatusFilterSelected_UsersFilters_UserFilterId",
                        column: x => x.UserFilterId,
                        principalTable: "UsersFilters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Source = table.Column<int>(nullable: false),
                    ExternalSource = table.Column<string>(nullable: true),
                    ExternalId = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    MinBath = table.Column<decimal>(nullable: true),
                    MinRent = table.Column<decimal>(nullable: true),
                    MaxRent = table.Column<decimal>(nullable: true),
                    MoveFrom = table.Column<DateTime>(nullable: true),
                    MoveTo = table.Column<DateTime>(nullable: true),
                    Tags = table.Column<string>(nullable: true),
                    Cities = table.Column<string>(nullable: true),
                    Pets = table.Column<string>(nullable: true),
                    Beds = table.Column<string>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    CustomerId = table.Column<long>(nullable: true),
                    AgentId = table.Column<long>(nullable: true),
                    ContactId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leads", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Leads_AbpUsers_AgentId",
                        column: x => x.AgentId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Leads_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Leads_AbpUsers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Leads_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pages",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Number = table.Column<int>(nullable: false),
                    FileId = table.Column<Guid>(nullable: false),
                    TenantId = table.Column<int>(nullable: false),
                    FormId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pages_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Pages_Forms_FormId",
                        column: x => x.FormId,
                        principalTable: "Forms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pages_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RecommendedListing",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    DisplayOrder = table.Column<int>(nullable: false),
                    LastViewDate = table.Column<DateTime>(nullable: false),
                    RequestedTourDate = table.Column<DateTime>(nullable: false),
                    LeadQuestion = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    LeadId = table.Column<Guid>(nullable: false),
                    ListingId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecommendedListing", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecommendedListing_Leads_LeadId",
                        column: x => x.LeadId,
                        principalTable: "Leads",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecommendedListing_Listings_ListingId",
                        column: x => x.ListingId,
                        principalTable: "Listings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecommendedListing_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    CustomerId = table.Column<long>(nullable: true),
                    AgentId = table.Column<long>(nullable: true),
                    LeadId = table.Column<Guid>(nullable: true),
                    ListingId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_AbpUsers_AgentId",
                        column: x => x.AgentId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Transactions_AbpUsers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Transactions_Leads_LeadId",
                        column: x => x.LeadId,
                        principalTable: "Leads",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Transactions_Listings_ListingId",
                        column: x => x.ListingId,
                        principalTable: "Listings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Transactions_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Controls",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Layer = table.Column<int>(nullable: false),
                    Label = table.Column<string>(maxLength: 256, nullable: true),
                    Position_Top = table.Column<int>(nullable: true),
                    Position_Left = table.Column<int>(nullable: true),
                    Size_Width = table.Column<int>(nullable: true),
                    Size_Height = table.Column<int>(nullable: true),
                    Font_SizeInPx = table.Column<int>(nullable: true),
                    ControlValueId = table.Column<long>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    ParticipantId = table.Column<long>(nullable: false),
                    PageId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Controls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Controls_ControlValues_ControlValueId",
                        column: x => x.ControlValueId,
                        principalTable: "ControlValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Controls_Pages_PageId",
                        column: x => x.PageId,
                        principalTable: "Pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Controls_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TransactionContacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    TransactionId = table.Column<Guid>(nullable: true),
                    ContactId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionContacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionContacts_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TransactionContacts_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionContacts_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TransactionForms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    TransactionId = table.Column<Guid>(nullable: true),
                    FormId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionForms_Forms_FormId",
                        column: x => x.FormId,
                        principalTable: "Forms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TransactionForms_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionForms_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_AddressId",
                table: "Contacts",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Controls_ControlValueId",
                table: "Controls",
                column: "ControlValueId",
                unique: true,
                filter: "[ControlValueId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Controls_PageId",
                table: "Controls",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_Controls_TenantId",
                table: "Controls",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_ControlValues_TenantId",
                table: "ControlValues",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_FeesFilterSelected_UserFilterId",
                table: "FeesFilterSelected",
                column: "UserFilterId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_TenantId",
                table: "Files",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_FiltersFeaturesSelected_UserFilterId",
                table: "FiltersFeaturesSelected",
                column: "UserFilterId");

            migrationBuilder.CreateIndex(
                name: "IX_Forms_FileId",
                table: "Forms",
                column: "FileId");

            migrationBuilder.CreateIndex(
                name: "IX_Forms_TenantId",
                table: "Forms",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Leads_AgentId",
                table: "Leads",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Leads_ContactId",
                table: "Leads",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_Leads_CustomerId",
                table: "Leads",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Leads_TenantId",
                table: "Leads",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_ListingDetail_ListingId",
                table: "ListingDetail",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_AgentId",
                table: "Listings",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Listings_TenantId",
                table: "Listings",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_MediaFilterSelected_UserFilterId",
                table: "MediaFilterSelected",
                column: "UserFilterId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_FileId",
                table: "Pages",
                column: "FileId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_FormId",
                table: "Pages",
                column: "FormId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_TenantId",
                table: "Pages",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingFilterSelected_UsersFiltersId",
                table: "ParkingFilterSelected",
                column: "UsersFiltersId");

            migrationBuilder.CreateIndex(
                name: "IX_PetsFilterSelected_UserFilterId",
                table: "PetsFilterSelected",
                column: "UserFilterId");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendedListing_LeadId",
                table: "RecommendedListing",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendedListing_ListingId",
                table: "RecommendedListing",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendedListing_TenantId",
                table: "RecommendedListing",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_StatusFilterSelected_UserFilterId",
                table: "StatusFilterSelected",
                column: "UserFilterId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionContacts_ContactId",
                table: "TransactionContacts",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionContacts_TenantId",
                table: "TransactionContacts",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionContacts_TransactionId",
                table: "TransactionContacts",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionForms_FormId",
                table: "TransactionForms",
                column: "FormId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionForms_TenantId",
                table: "TransactionForms",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionForms_TransactionId",
                table: "TransactionForms",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_AgentId",
                table: "Transactions",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CustomerId",
                table: "Transactions",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_LeadId",
                table: "Transactions",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ListingId",
                table: "Transactions",
                column: "ListingId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TenantId",
                table: "Transactions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_UsersFilters_UserId",
                table: "UsersFilters",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Controls");

            migrationBuilder.DropTable(
                name: "FeesFilterSelected");

            migrationBuilder.DropTable(
                name: "FiltersFeaturesSelected");

            migrationBuilder.DropTable(
                name: "ListingDetail");

            migrationBuilder.DropTable(
                name: "MediaFilterSelected");

            migrationBuilder.DropTable(
                name: "ParkingFilterSelected");

            migrationBuilder.DropTable(
                name: "PetsFilterSelected");

            migrationBuilder.DropTable(
                name: "RecommendedListing");

            migrationBuilder.DropTable(
                name: "StatusFilterSelected");

            migrationBuilder.DropTable(
                name: "TransactionContacts");

            migrationBuilder.DropTable(
                name: "TransactionForms");

            migrationBuilder.DropTable(
                name: "ControlValues");

            migrationBuilder.DropTable(
                name: "Pages");

            migrationBuilder.DropTable(
                name: "UsersFilters");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Forms");

            migrationBuilder.DropTable(
                name: "Leads");

            migrationBuilder.DropTable(
                name: "Listings");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Addresses");
        }
    }
}
