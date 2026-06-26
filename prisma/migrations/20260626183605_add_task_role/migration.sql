-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "role" "CoopRole";

-- CreateIndex
CREATE INDEX "Task_role_idx" ON "Task"("role");
