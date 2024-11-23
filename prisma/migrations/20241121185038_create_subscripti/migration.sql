/*
  Warnings:

  - You are about to drop the column `customer` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `durationFrom` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `durationTo` on the `Subscription` table. All the data in the column will be lost.
  - You are about to alter the column `trialPeriod` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `customerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "cycle" TEXT NOT NULL,
    "pricing" REAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "autoRenewal" BOOLEAN NOT NULL,
    "trialPeriod" INTEGER
);
INSERT INTO "new_Subscription" ("autoRenewal", "cycle", "id", "pricing", "status", "title", "trialPeriod") SELECT "autoRenewal", "cycle", "id", "pricing", "status", "title", "trialPeriod" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
