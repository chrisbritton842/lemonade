/*
  Warnings:

  - The values [HIRE_MEMBER] on the enum `ProposalType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "JobOpeningStatus" AS ENUM ('OPEN', 'CLOSED', 'FILLED');

-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'HIRED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "ProposalType_new" AS ENUM ('GENERAL', 'UPDATE_SALES_DAY_TIME', 'UPDATE_SALES_DAY_LOCATION', 'CREATE_TASK', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'CREATE_RULE', 'UPDATE_RULE', 'DELETE_RULE', 'UPDATE_NAME', 'UPDATE_LOGO', 'CREATE_JOB_OPENING', 'HIRE_APPLICANT', 'REMOVE_MEMBER');
ALTER TABLE "Proposal" ALTER COLUMN "type" TYPE "ProposalType_new" USING ("type"::text::"ProposalType_new");
ALTER TYPE "ProposalType" RENAME TO "ProposalType_old";
ALTER TYPE "ProposalType_new" RENAME TO "ProposalType";
DROP TYPE "public"."ProposalType_old";
COMMIT;

-- CreateTable
CREATE TABLE "JobOpening" (
    "id" TEXT NOT NULL,
    "coopId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "role" "CoopRole",
    "status" "JobOpeningStatus" NOT NULL DEFAULT 'OPEN',
    "sourceProposalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "jobOpeningId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "hireProposalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobOpening_sourceProposalId_key" ON "JobOpening"("sourceProposalId");

-- CreateIndex
CREATE INDEX "JobOpening_coopId_idx" ON "JobOpening"("coopId");

-- CreateIndex
CREATE INDEX "JobOpening_status_idx" ON "JobOpening"("status");

-- CreateIndex
CREATE INDEX "JobOpening_role_idx" ON "JobOpening"("role");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_hireProposalId_key" ON "JobApplication"("hireProposalId");

-- CreateIndex
CREATE INDEX "JobApplication_jobOpeningId_idx" ON "JobApplication"("jobOpeningId");

-- CreateIndex
CREATE INDEX "JobApplication_applicantId_idx" ON "JobApplication"("applicantId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobOpeningId_applicantId_key" ON "JobApplication"("jobOpeningId", "applicantId");

-- AddForeignKey
ALTER TABLE "JobOpening" ADD CONSTRAINT "JobOpening_sourceProposalId_fkey" FOREIGN KEY ("sourceProposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOpening" ADD CONSTRAINT "JobOpening_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Cooperative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_hireProposalId_fkey" FOREIGN KEY ("hireProposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobOpeningId_fkey" FOREIGN KEY ("jobOpeningId") REFERENCES "JobOpening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
