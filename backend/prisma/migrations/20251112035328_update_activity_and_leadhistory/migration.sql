/*
  Warnings:

  - You are about to drop the column `performedBy` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Made the column `changedBy` on table `LeadHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "performedBy",
DROP COLUMN "title",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LeadHistory" ALTER COLUMN "changedBy" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadHistory" ADD CONSTRAINT "LeadHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
