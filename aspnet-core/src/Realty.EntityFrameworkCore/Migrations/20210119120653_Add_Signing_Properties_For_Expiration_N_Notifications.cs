using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Signing_Properties_For_Expiration_N_Notifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParticipantType",
                table: "SigningParticipants");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Signings",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ViewRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    SigningId = table.Column<Guid>(nullable: false),
                    TenantId = table.Column<int>(nullable: false),
                    ParticipantId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViewRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViewRequests_SigningParticipants_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "SigningParticipants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ViewRequests_Signings_SigningId",
                        column: x => x.SigningId,
                        principalTable: "Signings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ViewRequests_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ViewRequests_ParticipantId",
                table: "ViewRequests",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewRequests_SigningId",
                table: "ViewRequests",
                column: "SigningId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewRequests_TenantId",
                table: "ViewRequests",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ViewRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Signings");

            migrationBuilder.AddColumn<int>(
                name: "ParticipantType",
                table: "SigningParticipants",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
