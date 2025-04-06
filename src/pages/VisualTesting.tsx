
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, ImageOff, AlertTriangle } from "lucide-react";

export default function VisualTesting() {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCaptureSnapshots = () => {
    setIsCapturing(true);
    // Simulating capture process
    setTimeout(() => {
      setIsCapturing(false);
    }, 2000);
  };
  
  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics" 
      title="Visual Testing"
    >
      <div className="space-y-6 p-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Visual Testing</h1>
          <p className="text-muted-foreground mt-1">
            Capture visual snapshots of pages and compare them against baseline images
          </p>
        </div>
        
        <div className="mb-6">
          <Button 
            onClick={handleCaptureSnapshots}
            disabled={isCapturing}
            className="mb-4"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isCapturing ? 'Capturing...' : 'Capture Snapshots'}
          </Button>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Visual Testing Module</AlertTitle>
            <AlertDescription>
              This feature captures screenshots of your UI components and pages, then compares them with baseline images to detect visual regressions.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <ImageOff className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No snapshots available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Capture snapshots to start visual testing
            </p>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
