/*
  Warnings:

  - You are about to drop the column `date_time` on the `films` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "films" DROP COLUMN "date_time",
ADD COLUMN     "release_date" DATE;
