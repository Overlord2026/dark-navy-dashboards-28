import { useParams } from "react-router-dom";
import { ProHero } from "@/components/pros/ProHero";
import { ProQuickActions } from "@/components/pros/ProQuickActions";
import { ProChecklist } from "@/components/pros/ProChecklist";
import { ProSegment } from "@/lib/persona";

export default function ProfessionalSegmentPage() {
  const { segment } = useParams<{ segment: string }>();
  
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <ProHero segment={segment as ProSegment} />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProChecklist segment={segment as ProSegment} />
        </div>
        <div>
          <ProQuickActions segment={segment as ProSegment} />
        </div>
      </div>
    </main>
  );
}