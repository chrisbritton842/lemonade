/*
  Warnings:

  - Made the column `role` on table `JobOpening` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobOpening" ALTER COLUMN "role" SET NOT NULL;
