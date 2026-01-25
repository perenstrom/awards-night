/*
  Warnings:

  - You are about to drop the column `group_id` on the `players` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."players" DROP CONSTRAINT "players_group_id_fkey";

-- AlterTable
ALTER TABLE "public"."groups" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "public"."players" DROP COLUMN "group_id";

-- CreateTable
CREATE TABLE "public"."player_to_group" (
    "player_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "player_to_group_pkey" PRIMARY KEY ("player_id","group_id")
);

-- AddForeignKey
ALTER TABLE "public"."player_to_group" ADD CONSTRAINT "player_to_group_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_to_group" ADD CONSTRAINT "player_to_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
