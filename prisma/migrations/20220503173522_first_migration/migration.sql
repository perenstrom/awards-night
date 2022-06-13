-- CreateTable
CREATE TABLE "bets" (
    "id" SERIAL NOT NULL,
    "nomination_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "films" (
    "imdb_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_time" DATE NOT NULL,
    "poster_url" TEXT,

    CONSTRAINT "films_pkey" PRIMARY KEY ("imdb_id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominations" (
    "id" SERIAL NOT NULL,
    "year_id" INTEGER NOT NULL,
    "category_id" TEXT NOT NULL,
    "nominee" TEXT,
    "won" BOOLEAN NOT NULL DEFAULT false,
    "decided" BOOLEAN NOT NULL DEFAULT false,
    "film_id" TEXT NOT NULL,

    CONSTRAINT "nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "auth0_user_id" TEXT,
    "group_id" INTEGER,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "years" (
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "betting_open" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "years_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "years_categories" (
    "category_id" TEXT NOT NULL,
    "year_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "years_categories_category_id_year_id_idx" ON "years_categories"("category_id", "year_id");

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_nomination_id_fkey" FOREIGN KEY ("nomination_id") REFERENCES "nominations"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("slug") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "films"("imdb_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominations" ADD CONSTRAINT "nominations_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("year") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "years_categories" ADD CONSTRAINT "years_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("slug") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "years_categories" ADD CONSTRAINT "years_categories_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("year") ON DELETE NO ACTION ON UPDATE CASCADE;
