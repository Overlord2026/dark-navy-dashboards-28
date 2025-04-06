
import { useState } from "react";
import { 
  runVisualTests, 
  getAllSnapshots, 
  getAllComparisonResults, 
  setAsBaseline,
  getSnapshotById,
  getComparisonResultById
} from "@/services/visualTesting/visualTestingService";
import { 
  VisualSnapshot, 
  VisualComparisonResult, 
  VisualTestConfig 
} from "@/types/visualTesting";

export function useVisualTesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<VisualComparisonResult[]>([]);
  const [snapshots, setSnapshots] = useState<VisualSnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const runTests = async (config?: VisualTestConfig) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const testResults = await runVisualTests(config);
      setResults(testResults);
      setSnapshots(getAllSnapshots());
      return testResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsRunning(false);
    }
  };
  
  const getTestSummary = () => {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    return {
      totalTests,
      passedTests,
      failedTests,
      passRate
    };
  };
  
  const promoteSnapshot = (snapshotId: string) => {
    const success = setAsBaseline(snapshotId);
    if (success) {
      // Refresh snapshots list
      setSnapshots(getAllSnapshots());
    }
    return success;
  };
  
  const getSnapshot = (id: string) => {
    return getSnapshotById(id);
  };
  
  const getResult = (id: string) => {
    return getComparisonResultById(id);
  };
  
  return {
    isRunning,
    results,
    snapshots,
    error,
    runTests,
    getTestSummary,
    promoteSnapshot,
    getSnapshot,
    getResult
  };
}
