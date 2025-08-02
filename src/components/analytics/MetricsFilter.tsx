import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface FilterOptions {
  dateRange?: DateRange;
  source?: string;
  advisor?: string;
  agency?: string;
}

interface MetricsFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  sources?: string[];
  advisors?: string[];
  agencies?: string[];
}

export function MetricsFilter({ 
  filters, 
  onFiltersChange, 
  sources = [], 
  advisors = [], 
  agencies = [] 
}: MetricsFilterProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-gradient-to-r from-deep-blue to-deep-blue/80 border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold font-playfair">
          <FilterIcon className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gold">Date Range</label>
            <DatePickerWithRange
              date={filters.dateRange}
              onDateChange={(dateRange) => updateFilter('dateRange', dateRange)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gold">Source</label>
            <Select value={filters.source || "all"} onValueChange={(value) => updateFilter('source', value === 'all' ? undefined : value)}>
              <SelectTrigger className="border-gold/30 text-gold">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gold">Advisor</label>
            <Select value={filters.advisor || "all"} onValueChange={(value) => updateFilter('advisor', value === 'all' ? undefined : value)}>
              <SelectTrigger className="border-gold/30 text-gold">
                <SelectValue placeholder="Select advisor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Advisors</SelectItem>
                {advisors.map((advisor) => (
                  <SelectItem key={advisor} value={advisor}>{advisor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gold">Agency</label>
            <Select value={filters.agency || "all"} onValueChange={(value) => updateFilter('agency', value === 'all' ? undefined : value)}>
              <SelectTrigger className="border-gold/30 text-gold">
                <SelectValue placeholder="Select agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}