import React from 'react';
import { BfoStatCard } from '@/components/ui/BfoCard';
import { LucideIcon } from 'lucide-react';

interface KpiTileProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}

export function KpiTile({ title, value, icon: Icon, loading = false }: KpiTileProps) {
  return (
    <BfoStatCard className="hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <Icon className="h-4 w-4 text-[#FFD700]" />
      </div>
      <div className="text-2xl font-bold text-white">
        {loading ? (
          <div className="h-8 w-16 bg-[#FFD700]/20 animate-pulse rounded" />
        ) : (
          value
        )}
      </div>
    </BfoStatCard>
  );
}