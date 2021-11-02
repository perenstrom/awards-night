import { memo } from 'react';
import { Player } from 'types/nominations';
import styled from 'styled-components';
import { Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const PlayerList = styled.ul`
  background-color: rgb(238, 238, 238);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
`;

const PlayerListItem = styled.li`
  list-style: none;
  display: inline-block;
  background-color: #2ecc71;
  padding: 0.3em;
  border-radius: 0.3em;
  margin-right: 0.3em;
  font-size: 1.3em;
`;

const useStyles = makeStyles(() => ({
  standingsText: { fontSize: '1.5rem' }
}));

interface Props {
  players: Player[];
  completedCategories: number;
  bettingOpen: boolean;
}

const PlayerStandingsComponent: React.FC<Props> = ({
  players,
  completedCategories,
  bettingOpen
}) => {
  const { standingsText } = useStyles();

  const playerStandings = players.map((p) => (
    <PlayerListItem key={p.id}>
      {bettingOpen ? (
        <Typography className={standingsText}>{p.name}</Typography>
      ) : (
        <Typography
          className={standingsText}
        >{`${p.name}: ${p.correct}/${completedCategories}`}</Typography>
      )}
    </PlayerListItem>
  ));

  return <PlayerList>{playerStandings}</PlayerList>;
};

export const PlayerStandings = memo(PlayerStandingsComponent);
