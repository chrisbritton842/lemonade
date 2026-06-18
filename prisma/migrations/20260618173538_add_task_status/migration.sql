/*
  Warnings:

  - You are about to drop the column `completed` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'NEEDS_REVIEW', 'COMPLETE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completed",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");
