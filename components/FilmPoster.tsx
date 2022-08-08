import { styled } from '@mui/material';

const PosterWrapper = styled('div')`
  position: relative;
  overflow: hidden;
`;

const PosterInnerWrapper = styled('div')`
  position: relative;
`;

const Poster = styled('img')`
  display: block;
  border-radius: 4px;
`;

const Frame = styled('span')`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 0) 0,
    hsla(0, 0%, 100%, 0.8) 50%,
    hsla(0, 0%, 100%, 0)
  );
  background-repeat: no-repeat;
  background-clip: padding-box;
  background-size: 100% 1px;
`;

interface Props {
  poster: string;
}

export const FilmPoster: React.FC<Props> = ({ poster }) => (
  <PosterWrapper>
    <PosterInnerWrapper>
      <Poster src={poster} width="48" height="72" />
      <Frame></Frame>
    </PosterInnerWrapper>
  </PosterWrapper>
);
