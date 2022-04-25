using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Update_Type_of_ParticipantId_in_Control : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParticipantId",
                table: "Controls");

            migrationBuilder.AddColumn<Guid>(
                name: "ParticipantId",
                table: "Controls",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Controls_ParticipantId",
                table: "Controls",
                column: "ParticipantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Controls_Contacts_ParticipantId",
                table: "Controls",
                column: "ParticipantId",
                principalTable: "Contacts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Controls_Contacts_ParticipantId",
                table: "Controls");

            migrationBuilder.DropIndex(
                name: "IX_Controls_ParticipantId",
                table: "Controls");

            migrationBuilder.AlterColumn<long>(
                name: "ParticipantId",
                table: "Controls",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);
        }
    }
}
