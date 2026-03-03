/*
  Warnings:

  - Added the required column `owner_id` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Made the column `slug` on table `groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- Add owner_id column with default value of 1, then set all existing groups to be owned by player 1
ALTER TABLE "groups" ADD COLUMN "owner_id" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "groups" ALTER COLUMN "slug" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
