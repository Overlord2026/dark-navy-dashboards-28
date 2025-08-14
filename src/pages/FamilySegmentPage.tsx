import { useParams } from "react-router-dom";
import { familySegments } from "@/lib/persona";

export default function FamilySegmentPage() {
  const { segment } = useParams<{ segment: string }>();
  
  // Find the segment data for display
  const segmentData = familySegments.find(s => 
    s.href.includes(segment || "")
  );

  const displayName = segment?.replace(/-/g, " ") || "Family Segment";
  
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground capitalize">
          For Families — {displayName}
        </h1>
        {segmentData?.description && (
          <p className="text-xl text-muted-foreground">
            {segmentData.description}
          </p>
        )}
      </div>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed">
          Paste the copy from your public site for this segment here. This page is designed 
          to showcase the specific value proposition and services tailored for {displayName}.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Key Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Comprehensive financial planning</li>
              <li>• Investment management</li>
              <li>• Tax optimization strategies</li>
              <li>• Estate planning coordination</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Why Choose Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Tailored approach for your family stage</li>
              <li>• Experienced professional network</li>
              <li>• Technology-driven solutions</li>
              <li>• Transparent fee structure</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-4">
            Schedule a complimentary consultation to learn how we can help your family 
            achieve its financial goals.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>
    </main>
  );
}