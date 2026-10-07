/*
  Warnings:

  - The values [UPDATE_NAME] on the enum `ProposalType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposalType_new" AS ENUM ('GENERAL', 'CREATE_EVENT', 'UPDATE_EVENT', 'CREATE_TASK', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'CREATE_RULE', 'UPDATE_RULE', 'DELETE_RULE', 'UPDATE_BUSINESS', 'UPDATE_LOGO', 'CREATE_JOB_OPENING', 'HIRE_APPLICANT', 'REMOVE_MEMBER');
ALTER TABLE "Proposal" ALTER COLUMN "type" TYPE "ProposalType_new" USING ("type"::text::"ProposalType_new");
ALTER TYPE "ProposalType" RENAME TO "ProposalType_old";
ALTER TYPE "ProposalType_new" RENAME TO "ProposalType";
DROP TYPE "public"."ProposalType_old";
COMMIT;
