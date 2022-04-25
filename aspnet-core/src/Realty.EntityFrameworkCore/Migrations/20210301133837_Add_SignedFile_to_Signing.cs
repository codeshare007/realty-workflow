using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_SignedFile_to_Signing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SignedFileId",
                table: "Signings",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Signings_SignedFileId",
                table: "Signings",
                column: "SignedFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Signings_Files_SignedFileId",
                table: "Signings",
                column: "SignedFileId",
                principalTable: "Files",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Signings_Files_SignedFileId",
                table: "Signings");

            migrationBuilder.DropIndex(
                name: "IX_Signings_SignedFileId",
                table: "Signings");

            migrationBuilder.DropColumn(
                name: "SignedFileId",
                table: "Signings");
        }
    }
}
