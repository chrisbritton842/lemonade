/*
  Warnings:

  - A unique constraint covering the columns `[sourceProposalId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "sourceProposalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Task_sourceProposalId_key" ON "Task"("sourceProposalId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_sourceProposalId_fkey" FOREIGN KEY ("sourceProposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
