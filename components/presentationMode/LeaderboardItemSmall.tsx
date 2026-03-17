
interface props {
  name: string;
  correct: number;
  itemStyle: number;
  showScore?: boolean;
}

export const LeaderboardItemSmall: React.FC<props> = ({
  name,
  correct,
  itemStyle,
  showScore = true
}) => {
  const colorKey =
    itemStyle >= 0 && itemStyle <= 11 ? String(itemStyle) : 'default';

  const colorStyle = {
    backgroundColor: `var(--player-color-${colorKey}-background)`,
    color: `var(--player-color-${colorKey}-text)`,
    textShadow: `1px 0px 3px var(--player-color-${colorKey}-glow), -1px 0px 3px var(--player-color-${colorKey}-glow)`
  };

  return (
    <li
      className="flex-1 flex items-center"
      style={colorStyle}
    >
      <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis px-1.5 -mx-1.5">
        {name}
      </div>
      {showScore && <div className="flex-none">{correct}</div>}
    </li>
  );
};
