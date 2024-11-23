/*
  Warnings:

  - Made the column `trialPeriod` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

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
    "trialPeriod" INTEGER NOT NULL
);
INSERT INTO "new_Subscription" ("autoRenewal", "customerId", "cycle", "endDate", "id", "pricing", "startDate", "status", "title", "trialPeriod") SELECT "autoRenewal", "customerId", "cycle", "endDate", "id", "pricing", "startDate", "status", "title", "trialPeriod" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
