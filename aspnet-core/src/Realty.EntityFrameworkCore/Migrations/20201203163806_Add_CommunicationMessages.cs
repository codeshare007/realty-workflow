using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_CommunicationMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CommunicationMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    TenantId = table.Column<int>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    UserId = table.Column<long>(nullable: false),
                    Contact = table.Column<string>(nullable: true),
                    ContactUserId = table.Column<long>(nullable: true),
                    Sender = table.Column<string>(nullable: true),
                    SenderUserId = table.Column<long>(nullable: true),
                    To = table.Column<string>(nullable: true),
                    ToUserId = table.Column<long>(nullable: true),
                    Subject = table.Column<string>(nullable: true),
                    Message = table.Column<string>(nullable: true),
                    ReceivedOnUtc = table.Column<DateTime>(nullable: false),
                    IsLocal = table.Column<bool>(nullable: false),
                    IsRead = table.Column<bool>(nullable: false),
                    ExternalId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunicationMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommunicationMessages_AbpUsers_ContactUserId",
                        column: x => x.ContactUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CommunicationMessages_AbpUsers_SenderUserId",
                        column: x => x.SenderUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CommunicationMessages_AbpUsers_ToUserId",
                        column: x => x.ToUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CommunicationMessages_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommunicationMessages_ContactUserId",
                table: "CommunicationMessages",
                column: "ContactUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunicationMessages_ReceivedOnUtc",
                table: "CommunicationMessages",
                column: "ReceivedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_CommunicationMessages_SenderUserId",
                table: "CommunicationMessages",
                column: "SenderUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunicationMessages_TenantId",
                table: "CommunicationMessages",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunicationMessages_ToUserId",
                table: "CommunicationMessages",
                column: "ToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunicationMessages_UserId",
                table: "CommunicationMessages",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommunicationMessages");
        }
    }
}
