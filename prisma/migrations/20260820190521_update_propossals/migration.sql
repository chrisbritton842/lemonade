/*
  Warnings:

  - You are about to drop the column `comment` on the `Proposal` table. All the data in the column will be lost.
  - Added the required column `title` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "comment",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
