import { useParams } from "react-router-dom";
import { proSegments } from "@/lib/persona";

export default function ProfessionalSegmentPage() {
  const { segment } = useParams<{ segment: string }>();
  
  // Find the segment data for display
  const segmentData = proSegments.find(s => 
    s.href.includes(segment || "")
  );

  const displayName = segment?.replace(/-/g, " ") || "Professional Segment";
  
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground capitalize">
          For Professionals — {displayName}
        </h1>
        {segmentData?.description && (
          <p className="text-xl text-muted-foreground">
            Professional services and solutions for {segmentData.label}
          </p>
        )}
      </div>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed">
          Paste the copy from your public site for this professional segment here. This page 
          showcases how we support {displayName} in growing their practice and serving clients better.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Partnership Benefits</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Lead generation support</li>
              <li>• Client co-management tools</li>
              <li>• Marketing resources</li>
              <li>• Continuing education</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Practice Growth</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Referral network access</li>
              <li>• Technology platform</li>
              <li>• Compliance support</li>
              <li>• Revenue sharing opportunities</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Join Our Network</h3>
          <p className="text-muted-foreground mb-4">
            Partner with us to expand your practice and better serve your clients through 
            our comprehensive family office platform.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Apply to Partner
          </button>
        </div>
      </div>
    </main>
  );
}