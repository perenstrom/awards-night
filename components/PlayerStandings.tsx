import { memo } from 'react';
import { Player } from 'types/nominations';
import styled from 'styled-components';

const Footer = styled.div`
  background-color: rgb(238, 238, 238);
  padding: 0.5em;
`;

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
}

export const PlayerStandings: React.FC<Props> = memo(
  ({ players, completedCategories }) => {
    const playerStandings = players.map((p) => (
      <PlayerListItem key={p.id}>
        <p>{`${p.name}: ${p.correct}/${completedCategories}`}</p>
      </PlayerListItem>
    ));

    return <PlayerList>{playerStandings}</PlayerList>;
  }
);
