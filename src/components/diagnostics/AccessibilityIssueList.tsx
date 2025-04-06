
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Check,
  ExternalLink,
  Code,
  Info,
  AlertTriangle,
  AlertCircle,
  X
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AccessibilityAuditResult } from '@/types/accessibility';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AccessibilityIssueListProps {
  issues: AccessibilityAuditResult[];
}

export function AccessibilityIssueList({ issues }: AccessibilityIssueListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.rule.toLowerCase().includes(searchTerm.toLowerCase()) || 
      issue.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterLevel === 'all' || issue.impact === filterLevel;
    
    return matchesSearch && matchesFilter;
  });
  
  // Get impact icon based on level
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'serious':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'moderate':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'minor':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get impact badge styling based on level
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical':
        return (
          <Badge variant="destructive" className="capitalize">
            {getImpactIcon(impact)} <span className="ml-1">Critical</span>
          </Badge>
        );
      case 'serious':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 border-amber-200 capitalize">
            {getImpactIcon(impact)} <span className="ml-1">Serious</span>
          </Badge>
        );
      case 'moderate':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 capitalize">
            {getImpactIcon(impact)} <span className="ml-1">Moderate</span>
          </Badge>
        );
      case 'minor':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 border-blue-200 capitalize">
            {getImpactIcon(impact)} <span className="ml-1">Minor</span>
          </Badge>
        );
      default:
        return <Badge variant="outline" className="capitalize">{impact}</Badge>;
    }
  };
  
  const renderEmptyState = () => {
    if (issues.length === 0) {
      return (
        <div className="text-center py-8">
          <Check className="mx-auto h-12 w-12 text-green-500 mb-3" />
          <h3 className="text-xl font-semibold mb-1">No Audit Results</h3>
          <p className="text-muted-foreground">
            Run an accessibility audit to see results here
          </p>
        </div>
      );
    }
    
    if (filteredIssues.length === 0) {
      return (
        <div className="text-center py-8">
          <X className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-xl font-semibold mb-1">No Matching Issues</h3>
          <p className="text-muted-foreground">
            Try changing your search or filter settings
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search-issues" className="sr-only">Search issues</Label>
            <Input
              id="search-issues"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterLevel === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel('all')}
            >
              All
            </Button>
            <Button
              variant={filterLevel === 'critical' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel('critical')}
              className="gap-1"
            >
              <AlertCircle className="h-3 w-3" /> Critical
            </Button>
            <Button
              variant={filterLevel === 'serious' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel('serious')}
              className="gap-1"
            >
              <AlertTriangle className="h-3 w-3" /> Serious
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderEmptyState()}
        
        {filteredIssues.length > 0 && (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Element</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{issue.rule}</div>
                        <div className="text-xs text-muted-foreground mt-1">{issue.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getImpactBadge(issue.impact)}</TableCell>
                    <TableCell>
                      <code className="px-1 py-0.5 rounded bg-muted text-xs">{issue.element}</code>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new URL(issue.url).pathname}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" title="View fix example">
                          <Code className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Documentation">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
