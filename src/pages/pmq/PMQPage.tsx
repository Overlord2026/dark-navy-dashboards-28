import { useParams } from "react-router-dom";
import PerformanceBulletin from "@/components/pmq/PerformanceBulletin";
import LiquidityOverlay from "@/components/pmq/LiquidityOverlay";
import ReasonCodesTimeline from "@/components/pmq/ReasonCodesTimeline";

export default function PMQPage() {
  const { fundId } = useParams<{ fundId: string }>();
  
  if (!fundId) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-destructive">Invalid Fund ID</h1>
        <p className="text-muted-foreground mt-2">Please provide a valid fund ID in the URL.</p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const yearAgo = new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().slice(0, 10);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PMQI Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Private Market Quality Index for Fund: <span className="font-mono">{fundId}</span>
        </p>
      </div>
      
      <div className="grid gap-6">
        <PerformanceBulletin 
          fundId={fundId} 
          windowStart={yearAgo} 
          windowEnd={today} 
        />
        <LiquidityOverlay 
          fundId={fundId} 
          windowStart={yearAgo} 
          windowEnd={today} 
        />
        <ReasonCodesTimeline fundId={fundId} />
      </div>
    </div>
  );
}