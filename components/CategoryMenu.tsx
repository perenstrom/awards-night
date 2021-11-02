import { memo } from 'react';
import { Category, Year } from 'types/nominations';
import { styled, css } from '@mui/system';
import Link from 'next/link';

const Header = styled('div')`
  background-color: rgb(238, 238, 238);
  display: flex;
`;

const linkStyle = css`
  display: block;
  height: 100%;
  line-height: 50px;
  flex-basis: 100px;
  text-align: center;
  text-decoration: none;
  color: white;
  margin: 0;
`;

const CategoryLink = styled('a')`
  ${linkStyle}
  background-color: rgb(187, 162, 103);
`;

const CategoryLinkDisabled = styled('p')`
  ${linkStyle}
  background-color: rgb(192, 182, 160);
`;

const CategoryTitle = styled('h2')`
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
  year: Year;
}

const CategoryMenuComponent: React.FC<Props> = ({ category, year }) => {
  return (
    <Header>
      {category.previousCategory ? (
        <Link href={`/${year.year}/${category.previousCategory}`} passHref>
          <CategoryLink>Previous</CategoryLink>
        </Link>
      ) : (
        <CategoryLinkDisabled>Previous</CategoryLinkDisabled>
      )}
      <CategoryTitle>{category.name}</CategoryTitle>
      {category.nextCategory ? (
        <Link href={`/${year.year}/${category.nextCategory}`} passHref>
          <CategoryLink>Next</CategoryLink>
        </Link>
      ) : (
        <CategoryLinkDisabled>Next</CategoryLinkDisabled>
      )}
    </Header>
  );
};

export const CategoryMenu = memo(CategoryMenuComponent);
