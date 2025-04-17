
import React from 'react';
import { Search } from 'lucide-react';

interface MobileEducationSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MobileEducationSearch = ({ searchQuery, onSearchChange }: MobileEducationSearchProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search courses and guides..."
        className="w-full py-2 pl-8 pr-4 bg-[#1B1B32] border border-[#2A2A45] rounded-lg text-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
