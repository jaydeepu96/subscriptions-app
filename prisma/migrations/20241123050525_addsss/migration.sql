/*
  Warnings:

  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Settings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationFrom" DATETIME NOT NULL,
    "durationTo" DATETIME NOT NULL,
    "subscriptionCycle" TEXT NOT NULL,
    "pricing" REAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "autoRenewal" BOOLEAN NOT NULL,
    "trialPeriodDays" INTEGER,
    "trialPeriodWeeks" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
