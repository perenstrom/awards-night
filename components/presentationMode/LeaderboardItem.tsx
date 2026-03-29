import { TruncatedText } from 'components/base/TruncatedText';

interface props {
  name: string;
  correct: number;
  total: number;
  itemStyle: number;
  place?: number;
}

export const LeaderboardItem: React.FC<props> = ({
  name,
  correct,
  total,
  itemStyle,
  place
}) => {
  const text = place ? `${place}. ${name}` : name;

  const colorKey =
    itemStyle >= 0 && itemStyle <= 11 ? String(itemStyle) : 'default';

  const colorStyle = {
    backgroundColor: `var(--player-color-${colorKey}-background)`,
    color: `var(--player-color-${colorKey}-text)`,
    textShadow: `1px 0px 3px var(--player-color-${colorKey}-glow), -1px 0px 3px var(--player-color-${colorKey}-glow)`
  };

  return (
    <li
      className="flex items-center mb-2.5 text-base first:text-xl first:mb-1.5 first:py-0.5 first:px-2"
      style={colorStyle}
    >
      <TruncatedText>{text}</TruncatedText>
      <div className="text-[0.8em] whitespace-nowrap">
        {correct} / {total}
      </div>
    </li>
  );
};
