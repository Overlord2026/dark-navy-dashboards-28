import { useState } from "react";
import { Link } from "react-router-dom";
import { usePersonaContext } from "@/context/persona-context";

export default function PersonaOnboarding() {
  const { personaRoot, setPersonaRoot, availableSegments, familySegment, proSegment, setFamilySegment, setProSegment } = usePersonaContext();
  const [needs, setNeeds] = useState<string[]>([]);

  const currentSegment = personaRoot === "families" ? familySegment : proSegment;
  
  const painPoints = personaRoot === "families"
    ? ["Lower lifetime taxes", "Retirement income", "Healthcare / Medicare", "Concentrated stock", "Business exit", "Private markets (PMA)"]
    : ["Lead generation", "Client portal & vault", "Medicare supplement compliance", "Co-planning with BFO", "Education & courses", "Brand & marketing"];

  const handleSegmentSelect = (segmentHref: string) => {
    if (personaRoot === "families") {
      const segment = segmentHref.split('/').pop() as any;
      setFamilySegment(segment);
    } else {
      const segment = segmentHref.split('/').pop() as any;
      setProSegment(segment);
    }
  };

  const toggleNeed = (need: string) => {
    setNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need) 
        : [...prev, need]
    );
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Let's personalize your Boutique Family Office
        </h1>
        <p className="text-muted-foreground">
          Help us understand your needs so we can provide the most relevant experience
        </p>
      </div>

      <section className="space-y-4">
        <div className="text-sm text-muted-foreground font-medium">Persona</div>
        <div className="flex gap-3">
          <button 
            onClick={() => setPersonaRoot("families")} 
            className={`px-4 py-3 rounded-lg border font-medium transition-all ${
              personaRoot === "families"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border hover:bg-accent hover:border-accent-foreground"
            }`}
          >
            For Families
          </button>
          <button 
            onClick={() => setPersonaRoot("professionals")} 
            className={`px-4 py-3 rounded-lg border font-medium transition-all ${
              personaRoot === "professionals"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border hover:bg-accent hover:border-accent-foreground"
            }`}
          >
            For Professionals
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm text-muted-foreground font-medium">Choose your group</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {availableSegments.map(segment => {
            const isSelected = currentSegment === segment.href.split('/').pop();
            return (
              <button 
                key={segment.href} 
                onClick={() => handleSegmentSelect(segment.href)}
                className={`text-left p-4 rounded-lg border transition-all hover:bg-accent ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <div className="font-medium text-foreground">{segment.label}</div>
                {segment.description && (
                  <div className="text-sm text-muted-foreground mt-1">{segment.description}</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm text-muted-foreground font-medium">
          What do you want to solve first? (Select all that apply)
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {painPoints.map(painPoint => {
            const isSelected = needs.includes(painPoint);
            return (
              <button 
                key={painPoint} 
                onClick={() => toggleNeed(painPoint)}
                className={`text-left p-4 rounded-lg border transition-all hover:bg-accent ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{painPoint}</span>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm text-muted-foreground font-medium">
          Get started with these tools and solutions
        </div>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/scorecard" 
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
          >
            Retirement Confidence Scorecard™
          </Link>
          <Link 
            to="/solutions/medicare" 
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
          >
            Medicare Coverage
          </Link>
          <Link 
            to="/solutions/ltc" 
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
          >
            LTC Planning
          </Link>
          <Link 
            to="/solutions/equity-comp" 
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
          >
            Equity Compensation
          </Link>
          <Link 
            to="/services/tax" 
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
          >
            Proactive Tax Management
          </Link>
          <Link 
            to="/services/investments" 
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
          >
            Intelligent Allocation®
          </Link>
          <Link 
            to="/tools/value-calculator" 
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Try the Value Calculator
          </Link>
        </div>
      </section>

      {(currentSegment || needs.length > 0) && (
        <section className="p-6 rounded-lg bg-muted/50 border border-border">
          <h3 className="font-semibold text-foreground mb-3">Your Selections</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Persona: </span>
              <span className="font-medium text-foreground">
                {personaRoot === "families" ? "For Families" : "For Professionals"}
              </span>
            </div>
            {currentSegment && (
              <div>
                <span className="text-muted-foreground">Group: </span>
                <span className="font-medium text-foreground">
                  {availableSegments.find(s => s.href.includes(currentSegment))?.label}
                </span>
              </div>
            )}
            {needs.length > 0 && (
              <div>
                <span className="text-muted-foreground">Priorities: </span>
                <span className="font-medium text-foreground">{needs.join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}