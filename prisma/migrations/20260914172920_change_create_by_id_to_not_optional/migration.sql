/*
  Warnings:

  - Made the column `createdById` on table `Proposal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_createdById_fkey";

-- AlterTable
ALTER TABLE "Proposal" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
