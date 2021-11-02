import { memo } from 'react';
import { Player } from 'types/nominations';
import styled from 'styled-components';
import { Typography } from '@mui/material';

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
  const playerStandings = players.map((p) => (
    <PlayerListItem key={p.id}>
      {bettingOpen ? (
        <Typography sx={{ fontSize: '1.5rem' }}>{p.name}</Typography>
      ) : (
        <Typography
          sx={{ fontSize: '1.5rem' }}
        >{`${p.name}: ${p.correct}/${completedCategories}`}</Typography>
      )}
    </PlayerListItem>
  ));

  return <PlayerList>{playerStandings}</PlayerList>;
};

export const PlayerStandings = memo(PlayerStandingsComponent);
