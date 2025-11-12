/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_ownerId_fkey";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "ownerId",
ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
