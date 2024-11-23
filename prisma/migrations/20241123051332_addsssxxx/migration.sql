/*
  Warnings:

  - Added the required column `startDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `trialPeriodDays` on table `Subscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trialPeriodWeeks` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationFrom" DATETIME NOT NULL,
    "durationTo" DATETIME NOT NULL,
    "subscriptionCycle" TEXT NOT NULL,
    "pricing" REAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "autoRenewal" BOOLEAN NOT NULL,
    "trialPeriodDays" INTEGER NOT NULL,
    "trialPeriodWeeks" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Subscription" ("autoRenewal", "createdAt", "customerId", "durationFrom", "durationTo", "id", "pricing", "status", "subscriptionCycle", "title", "trialPeriodDays", "trialPeriodWeeks", "updatedAt") SELECT "autoRenewal", "createdAt", "customerId", "durationFrom", "durationTo", "id", "pricing", "status", "subscriptionCycle", "title", "trialPeriodDays", "trialPeriodWeeks", "updatedAt" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
