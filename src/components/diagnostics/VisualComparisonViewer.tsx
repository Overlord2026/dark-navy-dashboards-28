
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check,
  X,
  Clock,
  Smartphone,
  Tablet,
  Laptop,
  ArrowLeftRight,
  Images,
  GalleryVerticalEnd,
  BookMarked,
  AlertTriangle,
  Download
} from 'lucide-react';
import { VisualComparisonResult } from '@/types/visualTesting';

interface VisualComparisonViewerProps {
  result?: VisualComparisonResult;
  onPromoteToBaseline: () => void;
}

export function VisualComparisonViewer({ result, onPromoteToBaseline }: VisualComparisonViewerProps) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visual Comparison</CardTitle>
          <CardDescription>
            Select a comparison result to view details
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <Images className="h-10 w-10 mb-2" />
          <p>Select a comparison to view</p>
        </CardContent>
      </Card>
    );
  }
  
  // Format timestamp to readable date
  const timestamp = new Date(result.timestamp).toLocaleString();
  
  // Get device icon based on viewport type
  const DeviceIcon = 
    result.viewport.deviceType === 'mobile' ? Smartphone :
    result.viewport.deviceType === 'tablet' ? Tablet : Laptop;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Visual Comparison</CardTitle>
            <CardDescription>
              {result.pageUrl} on {result.viewport.deviceType} ({result.viewport.width}x{result.viewport.height})
            </CardDescription>
          </div>
          <Badge 
            variant={result.passed ? "outline" : "destructive"}
            className={result.passed ? 
              "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
              ""}
          >
            {result.passed ? (
              <div className="flex items-center"><Check className="h-3 w-3 mr-1" /> Passed</div>
            ) : (
              <div className="flex items-center"><X className="h-3 w-3 mr-1" /> Failed</div>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Captured: {timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <DeviceIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {result.viewport.deviceType} ({result.viewport.width}x{result.viewport.height})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            <span className={result.misMatchPercentage > 3 ? "text-red-500 font-medium" : "text-muted-foreground"}>
              {result.misMatchPercentage.toFixed(2)}% difference
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <div className="p-2 bg-muted flex items-center justify-between">
              <div className="text-sm font-medium">Baseline</div>
              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 h-[300px]">
              <div className="text-center text-muted-foreground">
                <GalleryVerticalEnd className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">Baseline image placeholder</p>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="p-2 bg-muted flex items-center justify-between">
              <div className="text-sm font-medium">Current</div>
              <button className="text-blue-600 text-xs hover:underline" onClick={onPromoteToBaseline}>
                Set as baseline
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 h-[300px]">
              <div className="text-center text-muted-foreground">
                <GalleryVerticalEnd className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">Current image placeholder</p>
              </div>
            </div>
          </Card>
        </div>
        
        {!result.passed && result.diffImageUrl && (
          <Card className="overflow-hidden">
            <div className="p-2 bg-muted flex items-center justify-between">
              <div className="text-sm font-medium">Diff Image</div>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="p-4 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 h-[300px]">
              <div className="text-center text-muted-foreground">
                <GalleryVerticalEnd className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">Diff image placeholder</p>
              </div>
            </div>
          </Card>
        )}
        
        {!result.passed && result.annotations && result.annotations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Annotations</h3>
            {result.annotations.map(annotation => (
              <div 
                key={annotation.id} 
                className="border p-2 rounded-md text-sm flex items-start gap-2"
              >
                <AlertTriangle 
                  className={`h-4 w-4 mt-0.5 ${
                    annotation.priority === 'high' ? 'text-red-500' : 
                    annotation.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`} 
                />
                <div>
                  <p>{annotation.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Location: x:{annotation.x}, y:{annotation.y}, 
                    width:{annotation.width}, height:{annotation.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
