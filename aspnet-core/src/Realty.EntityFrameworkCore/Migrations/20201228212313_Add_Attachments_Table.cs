using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Realty.Migrations
{
    public partial class Add_Attachments_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    Description = table.Column<string>(maxLength: 1024, nullable: true),
                    TenantId = table.Column<int>(nullable: false),
                    FileId = table.Column<Guid>(nullable: true),
                    LibraryId = table.Column<Guid>(nullable: true),
                    SigningId = table.Column<Guid>(nullable: true),
                    TransactionId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachments_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Attachments_Libraries_LibraryId",
                        column: x => x.LibraryId,
                        principalTable: "Libraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Attachments_Signings_SigningId",
                        column: x => x.SigningId,
                        principalTable: "Signings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Attachments_AbpTenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "AbpTenants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Attachments_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_FileId",
                table: "Attachments",
                column: "FileId",
                unique: true,
                filter: "[FileId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_LibraryId",
                table: "Attachments",
                column: "LibraryId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_SigningId",
                table: "Attachments",
                column: "SigningId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_TenantId",
                table: "Attachments",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_TransactionId",
                table: "Attachments",
                column: "TransactionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");
        }
    }
}
