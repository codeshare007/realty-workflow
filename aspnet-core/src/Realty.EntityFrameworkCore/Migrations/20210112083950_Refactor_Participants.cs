using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Refactor_Participants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("update Controls set ParticipantId = null");
            migrationBuilder.Sql("update Leads set ContactId = null");

            migrationBuilder.DropForeignKey(
                name: "FK_Controls_Contacts_ParticipantId",
                table: "Controls");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_Contacts_ContactId",
                table: "Leads");

            migrationBuilder.DropForeignKey(
                name: "FK_SigningRequests_SigningContact_ParticipantId",
                table: "SigningRequests");

            migrationBuilder.DropTable(
                name: "SigningContact");

            migrationBuilder.DropTable(
                name: "TransactionContacts");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.CreateTable(
                name: "LeadContact",
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
                    table.PrimaryKey("PK_LeadContact", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeadContact_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SigningParticipants",
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
                    AddressId = table.Column<Guid>(nullable: true),
                    ParticipantType = table.Column<int>(nullable: false),
                    SigningId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SigningParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SigningParticipants_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SigningParticipants_Signings_SigningId",
                        column: x => x.SigningId,
                        principalTable: "Signings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransactionParticipants",
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
                    AddressId = table.Column<Guid>(nullable: true),
                    TransactionId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionParticipants_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TransactionParticipants_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LeadContact_AddressId",
                table: "LeadContact",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningParticipants_AddressId",
                table: "SigningParticipants",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningParticipants_SigningId",
                table: "SigningParticipants",
                column: "SigningId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionParticipants_AddressId",
                table: "TransactionParticipants",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionParticipants_TransactionId",
                table: "TransactionParticipants",
                column: "TransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Controls_SigningParticipants_ParticipantId",
                table: "Controls",
                column: "ParticipantId",
                principalTable: "SigningParticipants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadContact_ContactId",
                table: "Leads",
                column: "ContactId",
                principalTable: "LeadContact",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SigningRequests_SigningParticipants_ParticipantId",
                table: "SigningRequests",
                column: "ParticipantId",
                principalTable: "SigningParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Controls_SigningParticipants_ParticipantId",
                table: "Controls");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadContact_ContactId",
                table: "Leads");

            migrationBuilder.DropForeignKey(
                name: "FK_SigningRequests_SigningParticipants_ParticipantId",
                table: "SigningRequests");

            migrationBuilder.DropTable(
                name: "LeadContact");

            migrationBuilder.DropTable(
                name: "SigningParticipants");

            migrationBuilder.DropTable(
                name: "TransactionParticipants");

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AddressId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Company = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Firm = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LegalName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MiddleName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreferredInitials = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreferredSignature = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Suffix = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TenantId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
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
                name: "SigningContact",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContactId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    SigningId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TenantId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SigningContact", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SigningContact_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SigningContact_Signings_SigningId",
                        column: x => x.SigningId,
                        principalTable: "Signings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TransactionContacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContactId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    TenantId = table.Column<int>(type: "int", nullable: false),
                    TransactionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_AddressId",
                table: "Contacts",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningContact_ContactId",
                table: "SigningContact",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningContact_SigningId",
                table: "SigningContact",
                column: "SigningId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Controls_Contacts_ParticipantId",
                table: "Controls",
                column: "ParticipantId",
                principalTable: "Contacts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_Contacts_ContactId",
                table: "Leads",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SigningRequests_SigningContact_ParticipantId",
                table: "SigningRequests",
                column: "ParticipantId",
                principalTable: "SigningContact",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
