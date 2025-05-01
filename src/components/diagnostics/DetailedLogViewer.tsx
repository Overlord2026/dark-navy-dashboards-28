
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add the correct import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DownloadIcon, FilterIcon, RefreshCw } from "lucide-react";
import LogsList from "./LogsList";
import { useDiagnosticsLogs } from "@/hooks/useDiagnosticsLogs";

interface DetailedLogViewerProps {
  onClose: () => void;
}

export const DetailedLogViewer: React.FC<DetailedLogViewerProps> = ({ onClose }) => {
  const { 
    logs, 
    filteredLogs,
    logLevels, 
    selectedLevel, 
    searchTerm, 
    loading, 
    error, 
    setSearchTerm, 
    setSelectedLevel, 
    clearFilters, 
    downloadLogs, 
    refreshLogs 
  } = useDiagnosticsLogs();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detailed Log Viewer</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshLogs} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Button variant="secondary" size="sm" onClick={downloadLogs}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            {logLevels.map((level) => (
              <TabsTrigger key={level} value={level}>
                {level.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Level" defaultValue={selectedLevel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {logLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <FilterIcon className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
            
            <Input
              type="search"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsContent value="all">
            {loading && <p>Loading logs...</p>}
            {error && <p>Error: {error.message}</p>}
            <LogsList logs={filteredLogs} />
          </TabsContent>
          
          {logLevels.map((level) => (
            <TabsContent key={level} value={level}>
              {loading && <p>Loading logs...</p>}
              {error && <p>Error: {error.message}</p>}
              <LogsList logs={filteredLogs.filter((log) => log.level === level)} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
