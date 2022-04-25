using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_PartcipantMappingItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ParticipantMappingItemId",
                table: "Controls",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ParticipantMappingItem",
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
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    DisplayOrder = table.Column<int>(nullable: false),
                    TenantId = table.Column<int>(nullable: false),
                    FormId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParticipantMappingItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParticipantMappingItem_Forms_FormId",
                        column: x => x.FormId,
                        principalTable: "Forms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Controls_ParticipantMappingItemId",
                table: "Controls",
                column: "ParticipantMappingItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantMappingItem_FormId",
                table: "ParticipantMappingItem",
                column: "FormId");

            migrationBuilder.AddForeignKey(
                name: "FK_Controls_ParticipantMappingItem_ParticipantMappingItemId",
                table: "Controls",
                column: "ParticipantMappingItemId",
                principalTable: "ParticipantMappingItem",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Controls_ParticipantMappingItem_ParticipantMappingItemId",
                table: "Controls");

            migrationBuilder.DropTable(
                name: "ParticipantMappingItem");

            migrationBuilder.DropIndex(
                name: "IX_Controls_ParticipantMappingItemId",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "ParticipantMappingItemId",
                table: "Controls");
        }
    }
}
