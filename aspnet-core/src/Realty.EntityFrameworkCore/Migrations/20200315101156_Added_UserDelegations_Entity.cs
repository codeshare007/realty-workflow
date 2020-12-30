using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Added_UserDelegations_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUserDelegations",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    SourceUserId = table.Column<long>(nullable: false),
                    TargetUserId = table.Column<long>(nullable: false),
                    TenantId = table.Column<int>(nullable: true),
                    StartTime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserDelegations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserDelegations_TenantId_SourceUserId",
                table: "AppUserDelegations",
                columns: new[] { "TenantId", "SourceUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserDelegations_TenantId_TargetUserId",
                table: "AppUserDelegations",
                columns: new[] { "TenantId", "TargetUserId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserDelegations");
        }
    }
}
