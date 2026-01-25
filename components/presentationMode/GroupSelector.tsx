'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Group } from 'types/nominations';
import styles from './GroupSelector.module.scss';

interface GroupSelectorProps {
  groups: Group[];
  year: number;
  category: string;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  year,
  category
}) => {
  const pathname = usePathname();

  // Extract current group slug from pathname
  // Path format: /{year}/{category}/{groupSlug} or /{year}/{category}
  const pathSegments = pathname.split('/');
  const currentGroupSlug = pathSegments.length > 3 ? pathSegments[3] : '';

  return (
    <div className={styles.groupSelector}>
      <label htmlFor="group-select" className={styles.label}>
        Group:
      </label>
      <select
        id="group-select"
        className={styles.select}
        value={currentGroupSlug}
        onChange={(e) => {
          const selectedSlug = e.target.value;
          const url = selectedSlug
            ? `/${year}/${category}/${selectedSlug}`
            : `/${year}/${category}`;
          window.location.href = url;
        }}
      >
        {groups.map((group) => (
          <option key={group.id} value={group.slug}>
            {group.name || `Group ${group.id}`}
          </option>
        ))}
      </select>
    </div>
  );
};
