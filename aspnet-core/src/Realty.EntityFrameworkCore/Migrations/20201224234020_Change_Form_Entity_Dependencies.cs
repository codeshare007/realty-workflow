using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Change_Form_Entity_Dependencies : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Forms_AbpTenants_TenantId",
                table: "Forms");

            migrationBuilder.DropTable(
                name: "TransactionForms");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Forms");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Transactions",
                maxLength: 128,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LibraryId",
                table: "Forms",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SigningId",
                table: "Forms",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TransactionId",
                table: "Forms",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Libraries",
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
                    Name = table.Column<string>(maxLength: 128, nullable: true),
                    TenantId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Libraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Libraries_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Signings",
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
                    Name = table.Column<string>(maxLength: 128, nullable: true),
                    TenantId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Signings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Signings_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Forms_LibraryId",
                table: "Forms",
                column: "LibraryId");

            migrationBuilder.CreateIndex(
                name: "IX_Forms_SigningId",
                table: "Forms",
                column: "SigningId");

            migrationBuilder.CreateIndex(
                name: "IX_Forms_TransactionId",
                table: "Forms",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_Libraries_TenantId",
                table: "Libraries",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Signings_TenantId",
                table: "Signings",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_Libraries_LibraryId",
                table: "Forms",
                column: "LibraryId",
                principalTable: "Libraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_Signings_SigningId",
                table: "Forms",
                column: "SigningId",
                principalTable: "Signings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_AbpTenants_TenantId",
                table: "Forms",
                column: "TenantId",
                principalTable: "AbpTenants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_Transactions_TransactionId",
                table: "Forms",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            // CUSTOM SCRIPT
            migrationBuilder.Sql(@"
                DELETE FROM Forms
                DELETE FROM Transactions
                DELETE FROM Files
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Forms_Libraries_LibraryId",
                table: "Forms");

            migrationBuilder.DropForeignKey(
                name: "FK_Forms_Signings_SigningId",
                table: "Forms");

            migrationBuilder.DropForeignKey(
                name: "FK_Forms_AbpTenants_TenantId",
                table: "Forms");

            migrationBuilder.DropForeignKey(
                name: "FK_Forms_Transactions_TransactionId",
                table: "Forms");

            migrationBuilder.DropTable(
                name: "Libraries");

            migrationBuilder.DropTable(
                name: "Signings");

            migrationBuilder.DropIndex(
                name: "IX_Forms_LibraryId",
                table: "Forms");

            migrationBuilder.DropIndex(
                name: "IX_Forms_SigningId",
                table: "Forms");

            migrationBuilder.DropIndex(
                name: "IX_Forms_TransactionId",
                table: "Forms");

            migrationBuilder.DropColumn(
                name: "LibraryId",
                table: "Forms");

            migrationBuilder.DropColumn(
                name: "SigningId",
                table: "Forms");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Forms");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 128,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Forms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TransactionForms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FormId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    TenantId = table.Column<int>(type: "int", nullable: false),
                    TransactionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionForms_Forms_FormId",
                        column: x => x.FormId,
                        principalTable: "Forms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TransactionForms_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionForms_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TransactionForms_FormId",
                table: "TransactionForms",
                column: "FormId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionForms_TenantId",
                table: "TransactionForms",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionForms_TransactionId",
                table: "TransactionForms",
                column: "TransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Forms_AbpTenants_TenantId",
                table: "Forms",
                column: "TenantId",
                principalTable: "AbpTenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
