'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Group } from 'types/nominations';

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
    <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
      <label
        htmlFor="group-select"
        className="text-[0.75rem] font-medium text-white/60 m-0 uppercase tracking-[0.05em]"
      >
        Group:
      </label>
      <select
        id="group-select"
        className="bg-white/5 border border-white/10 rounded-md text-white/90 text-sm py-2 px-3 pr-10 cursor-pointer transition-all duration-200 ease-in-out appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3e%3cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3e%3c/svg%3e')] bg-no-repeat bg-size-[1.5em_1.5em] bg-position-[right_0.5rem_center] focus:outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:border-white/20"
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
