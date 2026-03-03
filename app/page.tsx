import { LoginLink } from 'components/LoginLink';
import { GridItem } from './_components/GridItem';
import { GridWrapper } from './_components/GridWrapper';
import { CardImage } from './_components/CardImage';
import { Container } from './_components/Container';
import { CardContent } from './_components/CardContent';
import { FeatureHeading } from './_components/FeatureHeading';
import { BodyText } from './_components/BodyText';

export default function Page() {
  return (
    <div className="bg-white">
      <div className="flex flex-col justify-center w-full h-[20rem] bg-black bg-[url(/images/hero.jpg)] bg-no-repeat bg-center bg-cover">
        <LoginLink />
        <div className="flex flex-1 justify-center items-center">
          <Container noPaddingTop>
            <h1 className="text-7xl text-white text-center text-shadow-lg mb-4">
              Awards Night
            </h1>
            <h2 className="text-xl text-white text-center text-shadow-lg">
              Social Prediction for the Academy Awards
            </h2>
          </Container>
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center">
        <Container>
          <GridWrapper>
            <GridItem>
              <CardImage
                src="/images/gather.jpg"
                alt="Image of friends sitting around a camp fire"
                height="220"
              />
              <CardContent>
                <FeatureHeading>Gather your friends</FeatureHeading>
                <BodyText>
                  Find the cinephiles amongst your friends and challenge them
                </BodyText>
              </CardContent>
            </GridItem>
            <GridItem>
              <CardImage
                src="/images/predict.png"
                alt="Screenshot of a list of movies being marked"
                height="220"
              />
              <CardContent>
                <FeatureHeading>Predict winners</FeatureHeading>
                <BodyText>
                  Privately choose which films will win in each category
                </BodyText>
              </CardContent>
            </GridItem>
            <GridItem>
              <CardImage
                src="/images/live-view.png"
                alt="Screenshot of a category of movies with a score board"
                height="220"
              />
              <CardContent>
                <FeatureHeading>See results live</FeatureHeading>
                <BodyText>
                  Follow the ceremony and see the results update live
                </BodyText>
              </CardContent>
            </GridItem>
          </GridWrapper>
          <div className="py-12 w-[60%] my-0 mx-auto text-center">
            <h2 className="text-3xl text-black font-bold m-0 mb-4">
              Get access!
            </h2>
            <BodyText>
              Awards Night is currently under development and in closed alpha.
              If you want to be a part of the alpha testing, send me an e-mail
              at{' '}
              <a href="mailto:hello@awardsnight.app">hello@awardsnight.app</a>.
            </BodyText>
            <BodyText>– Per Enström.</BodyText>
          </div>
        </Container>
      </div>
    </div>
  );
}
