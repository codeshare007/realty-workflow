using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_SignedFile_to_Form : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SignedFileId",
                table: "Forms",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Forms_SignedFileId",
                table: "Forms",
                column: "SignedFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_Files_SignedFileId",
                table: "Forms",
                column: "SignedFileId",
                principalTable: "Files",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Forms_Files_SignedFileId",
                table: "Forms");

            migrationBuilder.DropIndex(
                name: "IX_Forms_SignedFileId",
                table: "Forms");

            migrationBuilder.DropColumn(
                name: "SignedFileId",
                table: "Forms");
        }
    }
}
