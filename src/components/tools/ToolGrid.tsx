import React from 'react';
import { ToolCard } from '@/components/tools/ToolCard';

interface ToolGridProps {
  toolKeys: string[];
  columns?: number;
  showInstallOptions?: boolean;
  className?: string;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  toolKeys,
  columns = 3,
  showInstallOptions = true,
  className = ''
}) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-6 ${className}`}>
      {toolKeys.map((toolKey) => (
        <ToolCard
          key={toolKey}
          toolKey={toolKey}
          showInstallOption={showInstallOptions}
        />
      ))}
    </div>
  );
};