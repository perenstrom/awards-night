Alpha (non public) web app companion for social competition in predicting Academy Award winners. Each player can enter their predictions for each category, and during the ceremony you can view the current category and see who predicted what, winners, and current standings among players.

## Prediction entering
![Screenshot 2021-04-06 at 16 08 06](https://user-images.githubusercontent.com/765759/113726125-40e70280-96f4-11eb-836f-0d0a8b49170e.png)

Each player has their own page for entering their predictions. When the ceremony is over and the winners decided the player can see which predictions were right, and which were wrong.

## Oscar night
![Screenshot 2021-04-06 at 16 02 33](https://user-images.githubusercontent.com/765759/113726730-c4085880-96f4-11eb-97fc-c592f7e29a0f.png)

Each category is displayed on its own, and updated every few seconds to check winners. The page shows all player predictions and overall standing (correct out of decided categories).

## Technology
Oscar Night uses NextJS for both frontend and backend functionality. Data is stored in PostgreSQL and accessed via PrismaJS. Movie posters are fetched from The Movie DB API.
