using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class UpdateSiningAttachments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SigningParticipantId",
                table: "Attachments",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_CreatorUserId",
                table: "Attachments",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_SigningParticipantId",
                table: "Attachments",
                column: "SigningParticipantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_AbpUsers_CreatorUserId",
                table: "Attachments",
                column: "CreatorUserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_SigningParticipants_SigningParticipantId",
                table: "Attachments",
                column: "SigningParticipantId",
                principalTable: "SigningParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_AbpUsers_CreatorUserId",
                table: "Attachments");

            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_SigningParticipants_SigningParticipantId",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_CreatorUserId",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_SigningParticipantId",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "SigningParticipantId",
                table: "Attachments");
        }
    }
}
