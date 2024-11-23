/*
  Warnings:

  - Made the column `description` on table `Settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shop` on table `Settings` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);
INSERT INTO "new_Settings" ("description", "id", "shop", "title") SELECT "description", "id", "shop", "title" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
