using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Auditing_to_Attachment_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "Attachments",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "CreatorUserId",
                table: "Attachments",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "DeleterUserId",
                table: "Attachments",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletionTime",
                table: "Attachments",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Attachments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModificationTime",
                table: "Attachments",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "LastModifierUserId",
                table: "Attachments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "CreatorUserId",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "DeleterUserId",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "DeletionTime",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "LastModificationTime",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "LastModifierUserId",
                table: "Attachments");
        }
    }
}
