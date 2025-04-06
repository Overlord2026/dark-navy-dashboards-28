
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useVisualTesting } from "@/hooks/useVisualTesting";
import { VisualTestingRunner } from "@/components/diagnostics/VisualTestingRunner";
import { SnapshotGallery } from "@/components/diagnostics/SnapshotGallery";
import { VisualComparisonViewer } from "@/components/diagnostics/VisualComparisonViewer";
import { VisualComparisonResult } from "@/types/visualTesting";
import { toast } from "sonner";
import { logger } from "@/services/logging/loggingService";

export default function VisualTesting() {
  const { 
    results, 
    snapshots, 
    promoteSnapshot,
    getSnapshot,
    getResult
  } = useVisualTesting();
  const [selectedResult, setSelectedResult] = useState<VisualComparisonResult | undefined>();
  
  const handleSelectResult = (result: VisualComparisonResult) => {
    setSelectedResult(result);
  };
  
  const handlePromoteToBaseline = () => {
    if (selectedResult) {
      logger.info(
        `Promoting snapshot to baseline`,
        { currentId: selectedResult.currentId, pageUrl: selectedResult.pageUrl },
        'VisualTesting'
      );
      
      const success = promoteSnapshot(selectedResult.currentId);
      
      if (success) {
        toast.success('Snapshot set as new baseline', {
          description: `Future tests will compare against this snapshot`,
          duration: 3000
        });
      } else {
        toast.error('Failed to set snapshot as baseline');
      }
    }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <VisualTestingRunner />
          </div>
          
          <div className="lg:col-span-2 grid grid-rows-2 gap-6">
            <div className="row-span-1">
              <SnapshotGallery 
                snapshots={snapshots} 
                comparisonResults={results}
                onSelectResult={handleSelectResult}
                selectedResult={selectedResult}
              />
            </div>
            
            <div className="row-span-1">
              <VisualComparisonViewer 
                result={selectedResult}
                onPromoteToBaseline={handlePromoteToBaseline}
              />
            </div>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
