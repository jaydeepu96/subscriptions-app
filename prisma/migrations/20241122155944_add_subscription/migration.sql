/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cycle` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `trialPeriod` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `subscriptionCycle` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trialPeriodDays` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `endDate` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "subscriptionCycle" TEXT NOT NULL,
    "pricing" REAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "autoRenewal" BOOLEAN NOT NULL,
    "trialPeriodDays" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Subscription" ("autoRenewal", "customerId", "endDate", "id", "pricing", "startDate", "status", "title") SELECT "autoRenewal", "customerId", "endDate", "id", "pricing", "startDate", "status", "title" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
