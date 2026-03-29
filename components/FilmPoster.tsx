interface Props {
  poster: string;
}

export const FilmPoster: React.FC<Props> = ({ poster }) => (
  <div className="relative overflow-hidden shrink-0">
    <div className="relative">
      <img
        className="block rounded w-12 h-18 sm:w-8 sm:h-12"
        src={poster}
        alt="Poster image"
      />
      <span className="block absolute inset-x-0 top-0 h-full overflow-hidden rounded shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] bg-[linear-gradient(90deg,hsla(0,0%,100%,0)_0,hsla(0,0%,100%,0.8)_50%,hsla(0,0%,100%,0)_100%)] bg-no-repeat bg-clip-padding bg-size-[100%_1px]"></span>
    </div>
  </div>
);
