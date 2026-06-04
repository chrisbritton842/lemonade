/*
  Warnings:

  - You are about to drop the column `role` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Cooperative` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Session_id_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "MembershipRole" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "role" "CoopRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MembershipRole_membershipId_idx" ON "MembershipRole"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipRole_membershipId_role_key" ON "MembershipRole"("membershipId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperative_slug_key" ON "Cooperative"("slug");

-- AddForeignKey
ALTER TABLE "MembershipRole" ADD CONSTRAINT "MembershipRole_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
