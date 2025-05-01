
import React from 'react';
import { LogEntry } from '@/types/diagnostics';
import LogEntryItem from './LogEntryItem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ChevronDown, Filter, Search } from 'lucide-react';

interface LogsListProps {
  logs: LogEntry[];
  onFilterChange?: (filter: string) => void;
  onLevelChange?: (level: string) => void;
  onSearch?: (term: string) => void;
  onClearFilters?: () => void;
}

const LogsList: React.FC<LogsListProps> = ({
  logs = [],
  onFilterChange,
  onLevelChange,
  onSearch,
  onClearFilters
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      debug: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={colors[level] || 'bg-gray-100'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  // Fix: Ensure details is rendered as ReactNode
  const renderDetails = (details: string | Record<string, any> | undefined) => {
    if (!details) return null;
    
    if (typeof details === 'string') {
      return <span className="text-sm text-muted-foreground">{details}</span>;
    }
    
    // Convert object to a readable format
    return (
      <span className="text-sm text-muted-foreground">
        {JSON.stringify(details, null, 2)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="sm" variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLevelChange && onLevelChange('error')}>
                {getLevelBadge('error')} Error
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLevelChange && onLevelChange('warning')}>
                {getLevelBadge('warning')} Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLevelChange && onLevelChange('info')}>
                {getLevelBadge('info')} Info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLevelChange && onLevelChange('debug')}>
                {getLevelBadge('debug')} Debug
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLevelChange && onLevelChange('success')}>
                {getLevelBadge('success')} Success
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {onClearFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{getLevelBadge(log.level)}</TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{renderDetails(log.details)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-6 border rounded-md">
          <p className="text-muted-foreground">No logs to display</p>
        </div>
      )}
    </div>
  );
};

export default LogsList;
