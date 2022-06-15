import { memo } from 'react';
import { Bet, Film, Nomination, NormalizedPlayers } from 'types/nominations';
import { Chip, Stack, styled } from '@mui/material';
import { defaultStyledOptions } from 'utils/mui';
import { Nullable } from 'types/utilityTypes';

interface WrapperProps {
  readonly winner: boolean;
}
const Wrapper = styled(
  'li',
  defaultStyledOptions<WrapperProps>(['winner'])
)<WrapperProps>`
  list-style: none;
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  min-width: 200px;
  max-width: 15%;
  margin: 0 15px 30px 15px;
  padding: 0.5em;
  background-color: ${({ winner }) => winner && 'rgb(187, 162, 103)'};
`;

const Poster = styled('img')`
  width: 100%;
`;

interface Props {
  nomination: Nomination;
  film: Film;
  bets: Bet[];
  players: Nullable<NormalizedPlayers>;
}

const NominatedFilmComponent: React.FC<Props> = ({
  nomination,
  film,
  bets,
  players
}) => {
  let bettingPlayers;
  try {
    bettingPlayers = bets && players
      ? bets.map((bet) => (
          <Stack
            direction="row"
            component="ul"
            spacing={1}
            padding={0}
            margin={1}
            justifyContent="center"
            flexWrap="wrap"
            key={bet.id}
          >
            <Chip
              color="success"
              size="small"
              component="li"
              sx={{ marginBottom: '0.5rem' }}
              label={players[bet.player].name}
            />
          </Stack>
        ))
      : null;
  } catch (error) {
    console.log(error);
    console.log(bets);
    console.log(players);
  }

  const poster =
    film.poster ?? `https://via.placeholder.com/342x513.png?text=${film.name}`;

  return (
    <Wrapper winner={nomination.won}>
      <Poster alt={film.name} src={poster} />
      {nomination.nominee && <p>{nomination.nominee}</p>}
      {bettingPlayers}
    </Wrapper>
  );
};

export const NominatedFilm = memo(NominatedFilmComponent);
