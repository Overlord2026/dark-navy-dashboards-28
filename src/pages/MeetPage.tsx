import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

export function MeetPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "consultation";
  const source = searchParams.get("source") || "";
  const segment = searchParams.get("segment") || "";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            {type === "demo" ? "Schedule Your Demo" : "Schedule Your Consultation"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {type === "demo" 
              ? "See how our platform can help you grow your practice and stay compliant."
              : "Let's discuss how we can help your family achieve its financial goals."
            }
          </p>
          
          <div className="bg-muted/50 rounded-lg border border-border p-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Meeting Type: <span className="text-foreground font-semibold">{type}</span>
              </p>
              {source && (
                <p className="text-muted-foreground">
                  Source: <span className="text-foreground font-semibold">{source}</span>
                </p>
              )}
              {segment && (
                <p className="text-muted-foreground">
                  Segment: <span className="text-foreground font-semibold">{segment}</span>
                </p>
              )}
            </div>
            
            <div className="mt-8 p-6 bg-primary/10 rounded-lg">
              <p className="text-foreground font-semibold mb-2">Calendar Integration Coming Soon</p>
              <p className="text-muted-foreground text-sm">
                This page will integrate with your scheduling system (Calendly, Acuity, etc.)
              </p>
            </div>
            
            <div className="mt-6">
              <a 
                href="mailto:contact@boutiquefamilyoffice.com?subject=Schedule Meeting"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Us Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}