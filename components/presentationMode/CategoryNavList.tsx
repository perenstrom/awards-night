import { clsx } from 'clsx';
import Link from 'next/link';

interface Category {
  slug: string;
  name: string;
}

interface Props {
  categories: Category[];
  currentSlug: string;
  year: number;
  groupSlug?: string;
}

export const CategoryNavList = ({
  categories,
  currentSlug,
  year,
  groupSlug
}: Props) => {
  return (
    <ul className="mx-0 mb-[0.5em] mt-0 list-none p-0 text-[0.8em] font-medium leading-normal text-text-primary">
      {categories.map((category) => (
        <li className="p-0" key={category.slug}>
          <Link
            className={clsx(
              'no-underline',
              currentSlug === category.slug
                ? 'text-active-link'
                : 'text-text-primary'
            )}
            href={`/${year}/${category.slug}${groupSlug ? `/${groupSlug}` : ''}`}
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
