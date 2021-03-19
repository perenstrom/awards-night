import { memo } from 'react';
import { Category } from 'types/nominations';
import styled from 'styled-components';
import Link from 'next/link';

const Header = styled.div`
  background-color: rgb(238, 238, 238);
  display: flex;
`;

const PreviousCategory = styled.a`
  display: block;
  height: 100%;
  line-height: 50px;
  flex-basis: 100px;
  background-color: rgb(187, 162, 103);
  text-align: center;
  text-decoration: none;
  color: white;
`;

const NextCategory = styled.a`
  display: block;
  height: 100%;
  line-height: 50px;
  flex-basis: 100px;
  background-color: rgb(187, 162, 103);
  text-align: center;
  text-decoration: none;
  color: white;
`;

const CategoryTitle = styled.h2`
  display: block;
  height: 100%;
  line-height: 50px;
  flex-grow: 1;
  text-align: center;
  margin: 0px;
  font-weight: 400;
`;

interface Props {
  category: Category;
}

export const CategoryMenu: React.FC<Props> = memo(({ category }) => {
  return (
    <Header>
      <Link href={`/${category.previousCategory}`} passHref>
        <PreviousCategory>Previous</PreviousCategory>
      </Link>
      <CategoryTitle>{category.name}</CategoryTitle>
      <Link href={`/${category.nextCategory}`} passHref>
        <NextCategory>Next</NextCategory>
      </Link>
    </Header>
  );
});
