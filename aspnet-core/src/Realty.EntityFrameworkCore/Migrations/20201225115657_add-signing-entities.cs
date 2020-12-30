using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class addsigningentities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "AgentId",
                table: "Signings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Signings",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SigningContact",
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
                    SigningId = table.Column<Guid>(nullable: true),
                    ContactId = table.Column<Guid>(nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_Signings_AgentId",
                table: "Signings",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningContact_ContactId",
                table: "SigningContact",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningContact_SigningId",
                table: "SigningContact",
                column: "SigningId");

            migrationBuilder.AddForeignKey(
                name: "FK_Signings_AbpUsers_AgentId",
                table: "Signings",
                column: "AgentId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Signings_AbpUsers_AgentId",
                table: "Signings");

            migrationBuilder.DropTable(
                name: "SigningContact");

            migrationBuilder.DropIndex(
                name: "IX_Signings_AgentId",
                table: "Signings");

            migrationBuilder.DropColumn(
                name: "AgentId",
                table: "Signings");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Signings");
        }
    }
}
