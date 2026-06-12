-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PROPOSED', 'CONFIRMED', 'NEEDS_APPROVAL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SALES_DAY', 'MEETING', 'SUPPLY_RUN', 'PREP_WORK', 'MARKETING_OUTREACH', 'BOARD_MEETING', 'OTHER');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "coopId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "status" "EventStatus" NOT NULL DEFAULT 'PROPOSED',
    "type" "EventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_coopId_idx" ON "Event"("coopId");

-- CreateIndex
CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");

-- CreateIndex
CREATE INDEX "Event_startsAt_idx" ON "Event"("startsAt");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Cooperative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
