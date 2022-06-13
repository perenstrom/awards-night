/*
  Warnings:

  - A unique constraint covering the columns `[auth0_user_id]` on the table `players` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "players_auth0_user_id_key" ON "players"("auth0_user_id");
