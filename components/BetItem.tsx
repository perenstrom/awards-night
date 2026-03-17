import { clsx } from 'clsx';
import { memo } from 'react';
import { FilmPoster } from './FilmPoster';
import { CheckboxWrapper } from './dashboard/CheckboxWrapper';

interface Props {
  nominationId: number;
  won: boolean;
  decided: boolean;
  filmName: string;
  poster: string;
  nominee: string;
  activeBet?: boolean;
  disabled?: boolean;
}

const getState = (won: boolean, decided: boolean, activeBet: boolean) => {
  if (!decided || !activeBet) return 'neutral';
  return won && activeBet ? 'correct' : 'incorrect';
};

export const BetItemComponent: React.FC<Props> = ({
  nominationId,
  won,
  filmName,
  poster,
  nominee,
  decided,
  activeBet = false,
  disabled = false
}) => {
  return (
    <button
      className="w-full border-0 bg-transparent p-0 m-0 text-left"
      type="submit"
      name="nominationId"
      value={nominationId}
      disabled={disabled}
    >
      <li
        className={clsx(
          'flex items-center gap-3 w-full list-none p-2 rounded-sm transition-colors duration-300 bg-background-grey-1 text-text-primary',
          {
            'cursor-pointer': !disabled,
            'shadow-[0_0_0.5em_0.2em_var(--color-winner-yellow)] md:shadow-[0_0_1em_0.4em_var(--color-winner-yellow)]':
              won
          }
        )}
        key={nominationId}
      >
        <CheckboxWrapper
          selected={activeBet}
          nominationId={nominationId}
          state={getState(won, decided, activeBet)}
        />
        <FilmPoster poster={poster} />
        <div className="flex flex-col py-1 md:py-2">
          <h3 className="font-bold text-sm md:text-base">{filmName}</h3>
          {nominee && <p className="text-xs md:text-sm">{nominee}</p>}
        </div>
      </li>
    </button>
  );
};

export const BetItem = memo(BetItemComponent);
