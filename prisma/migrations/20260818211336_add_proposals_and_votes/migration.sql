-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('GENERAL', 'UPDATE_SALES_DAY_TIME', 'UPDATE_SALES_DAY_LOCATION', 'CREATE_TASK', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'CREATE_RULE', 'UPDATE_RULE', 'DELETE_RULE', 'UPDATE_NAME', 'UPDATE_LOGO', 'HIRE_MEMBER', 'REMOVE_MEMBER');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('OPEN', 'PASSED', 'FAILED', 'NEEDS_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProposalThreshold" AS ENUM ('SIMPLE_MAJORITY', 'TWO_THIRDS', 'PARENT_APPROVAL', 'BOARD_REVIEW');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('YES', 'NO', 'ABSTAIN');

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "createdById" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "coopId" TEXT NOT NULL,
    "createdById" TEXT,
    "comment" TEXT,
    "type" "ProposalType" NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'OPEN',
    "threshold" "ProposalThreshold" NOT NULL DEFAULT 'SIMPLE_MAJORITY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3),

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalVote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "choice" "VoteChoice" NOT NULL DEFAULT 'ABSTAIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proposal_coopId_idx" ON "Proposal"("coopId");

-- CreateIndex
CREATE INDEX "Proposal_createdById_idx" ON "Proposal"("createdById");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "Proposal_type_idx" ON "Proposal"("type");

-- CreateIndex
CREATE INDEX "ProposalVote_proposalId_idx" ON "ProposalVote"("proposalId");

-- CreateIndex
CREATE INDEX "ProposalVote_userId_idx" ON "ProposalVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalVote_proposalId_userId_key" ON "ProposalVote"("proposalId", "userId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Cooperative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVote" ADD CONSTRAINT "ProposalVote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVote" ADD CONSTRAINT "ProposalVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
