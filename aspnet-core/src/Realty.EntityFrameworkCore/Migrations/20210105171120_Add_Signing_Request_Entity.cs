using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Signing_Request_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationSettings_ExpirationDate",
                table: "Signings",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReminderSettings_DispatchingFrequency",
                table: "Signings",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReminderSettings_NextDispatchTime",
                table: "Signings",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SigningRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    SigningId = table.Column<Guid>(nullable: false),
                    TenantId = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    ParticipantId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SigningRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SigningRequests_SigningContact_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "SigningContact",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SigningRequests_Signings_SigningId",
                        column: x => x.SigningId,
                        principalTable: "Signings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SigningRequests_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SigningRequests_ParticipantId",
                table: "SigningRequests",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningRequests_SigningId",
                table: "SigningRequests",
                column: "SigningId");

            migrationBuilder.CreateIndex(
                name: "IX_SigningRequests_TenantId",
                table: "SigningRequests",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SigningRequests");

            migrationBuilder.DropColumn(
                name: "ExpirationSettings_ExpirationDate",
                table: "Signings");

            migrationBuilder.DropColumn(
                name: "ReminderSettings_DispatchingFrequency",
                table: "Signings");

            migrationBuilder.DropColumn(
                name: "ReminderSettings_NextDispatchTime",
                table: "Signings");
        }
    }
}
