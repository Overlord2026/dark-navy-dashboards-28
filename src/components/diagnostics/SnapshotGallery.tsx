
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VisualSnapshot, VisualComparisonResult } from '@/types/visualTesting';
import { 
  Laptop, 
  Tablet, 
  Smartphone,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowDownToLine,
  Filter
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SnapshotGalleryProps {
  snapshots: VisualSnapshot[];
  comparisonResults: VisualComparisonResult[];
  onSelectResult: (result: VisualComparisonResult) => void;
  selectedResult?: VisualComparisonResult;
}

export function SnapshotGallery({ 
  snapshots, 
  comparisonResults, 
  onSelectResult,
  selectedResult 
}: SnapshotGalleryProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Snapshots Gallery</CardTitle>
        <CardDescription>
          View and manage visual snapshots and test results
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search snapshots..." className="pl-8" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="snapshots">All Snapshots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="m-0">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {comparisonResults.length > 0 ? (
                  comparisonResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
                        selectedResult?.id === result.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => onSelectResult(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate max-w-[200px]">
                          {result.pageUrl.replace('/', '')}
                        </div>
                        {result.passed ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Pass
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            <AlertCircle className="h-3 w-3 mr-1" /> Fail
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {result.viewport.deviceType === 'desktop' && (
                            <Laptop className="h-3 w-3" />
                          )}
                          {result.viewport.deviceType === 'tablet' && (
                            <Tablet className="h-3 w-3" />
                          )}
                          {result.viewport.deviceType === 'mobile' && (
                            <Smartphone className="h-3 w-3" />
                          )}
                          <span>
                            {result.viewport.width}x{result.viewport.height}
                          </span>
                        </div>
                        <div>
                          Diff: {result.misMatchPercentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    No test results available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="snapshots" className="m-0">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {snapshots.length > 0 ? (
                  snapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className="p-3 border rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="font-medium truncate max-w-[200px]">
                        {snapshot.name}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {snapshot.viewport.deviceType === 'desktop' && (
                            <Laptop className="h-3 w-3" />
                          )}
                          {snapshot.viewport.deviceType === 'tablet' && (
                            <Tablet className="h-3 w-3" />
                          )}
                          {snapshot.viewport.deviceType === 'mobile' && (
                            <Smartphone className="h-3 w-3" />
                          )}
                          <span>
                            {snapshot.viewport.width}x{snapshot.viewport.height}
                          </span>
                        </div>
                        <div>
                          {new Date(snapshot.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    No snapshots available
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-muted-foreground text-xs flex justify-between">
        <div>{comparisonResults.length} results, {snapshots.length} snapshots</div>
        <Button variant="ghost" size="sm">
          <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
          Export Results
        </Button>
      </CardFooter>
    </Card>
  );
}
