using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Lead_Contacts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LeadContact_Addresses_AddressId",
                table: "LeadContact");

            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadContact_ContactId",
                table: "Leads");

            migrationBuilder.DropIndex(
                name: "IX_Leads_ContactId",
                table: "Leads");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LeadContact",
                table: "LeadContact");

            migrationBuilder.RenameTable(
                name: "LeadContact",
                newName: "LeadContacts");

            migrationBuilder.RenameIndex(
                name: "IX_LeadContact_AddressId",
                table: "LeadContacts",
                newName: "IX_LeadContacts_AddressId");

            migrationBuilder.AddColumn<Guid>(
                name: "LeadId",
                table: "LeadContacts",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LeadContacts",
                table: "LeadContacts",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_LeadContacts_LeadId",
                table: "LeadContacts",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_LeadContacts_TenantId",
                table: "LeadContacts",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_LeadContacts_Addresses_AddressId",
                table: "LeadContacts",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LeadContacts_Leads_LeadId",
                table: "LeadContacts",
                column: "LeadId",
                principalTable: "Leads",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LeadContacts_AbpTenants_TenantId",
                table: "LeadContacts",
                column: "TenantId",
                principalTable: "AbpTenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LeadContacts_Addresses_AddressId",
                table: "LeadContacts");

            migrationBuilder.DropForeignKey(
                name: "FK_LeadContacts_Leads_LeadId",
                table: "LeadContacts");

            migrationBuilder.DropForeignKey(
                name: "FK_LeadContacts_AbpTenants_TenantId",
                table: "LeadContacts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LeadContacts",
                table: "LeadContacts");

            migrationBuilder.DropIndex(
                name: "IX_LeadContacts_LeadId",
                table: "LeadContacts");

            migrationBuilder.DropIndex(
                name: "IX_LeadContacts_TenantId",
                table: "LeadContacts");

            migrationBuilder.DropColumn(
                name: "LeadId",
                table: "LeadContacts");

            migrationBuilder.RenameTable(
                name: "LeadContacts",
                newName: "LeadContact");

            migrationBuilder.RenameIndex(
                name: "IX_LeadContacts_AddressId",
                table: "LeadContact",
                newName: "IX_LeadContact_AddressId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LeadContact",
                table: "LeadContact",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Leads_ContactId",
                table: "Leads",
                column: "ContactId");

            migrationBuilder.AddForeignKey(
                name: "FK_LeadContact_Addresses_AddressId",
                table: "LeadContact",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadContact_ContactId",
                table: "Leads",
                column: "ContactId",
                principalTable: "LeadContact",
                principalColumn: "Id");
        }
    }
}
