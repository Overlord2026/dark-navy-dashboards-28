import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Calendar, FileText, RotateCcw } from 'lucide-react';
import { IPFilingFilters } from '@/lib/db/ip';

interface IPFiltersProps {
  filters: IPFilingFilters;
  families: Array<{ family_code: string; fam_title: string | null }>;
  onFiltersChange: (filters: IPFilingFilters) => void;
  onReset: () => void;
}

const FILING_KINDS = ['PROVISIONAL', 'NONPROVISIONAL', 'PCT', 'OTHER'];

export function IPFilters({ filters, families, onFiltersChange, onReset }: IPFiltersProps) {
  const updateFilter = (key: keyof IPFilingFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filters
        </h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Family Filter */}
        <div className="space-y-2">
          <Label htmlFor="family-filter">Family</Label>
          <select
            id="family-filter"
            value={filters.family || 'All'}
            onChange={(e) => updateFilter('family', e.target.value === 'All' ? undefined : e.target.value)}
            className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
          >
            <option value="All">All Families</option>
            {families.map((family) => (
              <option key={family.family_code} value={family.family_code}>
                {family.family_code} {family.fam_title ? `- ${family.fam_title}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Filing Kind Filter */}
        <div className="space-y-2">
          <Label htmlFor="kind-filter">Filing Kind</Label>
          <select
            id="kind-filter"
            value={filters.kind || 'All'}
            onChange={(e) => updateFilter('kind', e.target.value === 'All' ? undefined : e.target.value)}
            className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
          >
            <option value="All">All Kinds</option>
            {FILING_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="search-filter">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-filter"
              placeholder="Search title, application number, or notes..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date From Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-from-filter">Date From</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="date-from-filter"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date To Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-to-filter">Date To</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="date-to-filter"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Artifacts Only Filter */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="artifacts-only"
            checked={filters.hasArtifactsOnly || false}
            onCheckedChange={(checked) => updateFilter('hasArtifactsOnly', !!checked)}
          />
          <Label htmlFor="artifacts-only" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Show only filings with artifacts
          </Label>
        </div>
      </div>
    </div>
  );
}