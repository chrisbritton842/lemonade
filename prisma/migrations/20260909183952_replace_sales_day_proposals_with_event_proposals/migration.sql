/*
  Warnings:

  - The values [UPDATE_SALES_DAY_TIME,UPDATE_SALES_DAY_LOCATION] on the enum `ProposalType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[sourceProposalId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposalType_new" AS ENUM ('GENERAL', 'CREATE_EVENT', 'UPDATE_EVENT', 'CREATE_TASK', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'CREATE_RULE', 'UPDATE_RULE', 'DELETE_RULE', 'UPDATE_NAME', 'UPDATE_LOGO', 'CREATE_JOB_OPENING', 'HIRE_APPLICANT', 'REMOVE_MEMBER');
ALTER TABLE "Proposal" ALTER COLUMN "type" TYPE "ProposalType_new" USING ("type"::text::"ProposalType_new");
ALTER TYPE "ProposalType" RENAME TO "ProposalType_old";
ALTER TYPE "ProposalType_new" RENAME TO "ProposalType";
DROP TYPE "public"."ProposalType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "sourceProposalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_sourceProposalId_key" ON "Event"("sourceProposalId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sourceProposalId_fkey" FOREIGN KEY ("sourceProposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
