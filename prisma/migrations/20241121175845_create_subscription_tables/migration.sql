/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionCycle` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `trialPeriodDays` on the `Subscription` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `customer` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycle` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationFrom` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationTo` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationFrom" DATETIME NOT NULL,
    "durationTo" DATETIME NOT NULL,
    "cycle" TEXT NOT NULL,
    "pricing" REAL NOT NULL,
    "customer" TEXT NOT NULL,
    "autoRenewal" BOOLEAN NOT NULL,
    "trialPeriod" TEXT
);
INSERT INTO "new_Subscription" ("autoRenewal", "id", "pricing", "status", "title") SELECT "autoRenewal", "id", "pricing", "status", "title" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
