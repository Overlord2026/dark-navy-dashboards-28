import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import analytics from '@/lib/analytics';
import { scrollToId, track } from "@/lib/cta";

export function HomeHero() {
  const [group, setGroup] = useState<"family" | "pro">("family");
  const navigate = useNavigate();
  
  useEffect(() => {
    const v = (localStorage.getItem("persona_group") as "family" | "pro") || "family";
    setGroup(v);
    const handler = (e: any) => setGroup(e.detail?.group ?? "family");
    window.addEventListener("persona-switched", handler);
    return () => window.removeEventListener("persona-switched", handler);
  }, []);

  if (group === "pro") {
    return (
      <section className="text-center space-y-6 py-16 px-4 relative z-10">
        <div className="absolute inset-0 pointer-events-none"></div>
        <div className="relative z-10 pointer-events-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            A Growth & Compliance OS for Professionals
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Win ideal clients, automate follow-ups, coordinate with the family office, and keep audits clean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-3 pointer-events-auto"
              onClick={() => { 
                analytics.track("hero.cta.clicked", { group: "pro", cta: "explore_tools" });
                track("hero.cta.clicked", { label: "Explore Tools", group: "pro" });
                // ✅ FIX: go to a real route
                navigate("/tools/value-calculator");
              }}
            >
              Explore Tools
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 pointer-events-auto"
              onClick={() => { 
                analytics.track('hero.cta.clicked', { group: 'pro', cta: 'book_demo' });
                track("hero.cta.clicked", { label: "Book a Demo", group: 'pro' });
                navigate("/meet?type=demo"); 
              }}
            >
              Book a Demo
            </Button>
          </div>
          <div className="text-sm text-muted-foreground/80 pt-4">
            Advisors · CPAs · Attorneys · Insurance · Healthcare · Realtors · Bank/Trust
          </div>
        </div>
      </section>
    );
  }

  // Families
  return (
    <section className="text-center space-y-6 py-16 px-4 relative z-10">
      <div className="absolute inset-0 pointer-events-none"></div>
      <div className="relative z-10 pointer-events-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
          Your Private Family Office—On Your Terms
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          You choose the team. You control the plan. We coordinate investments, tax, estate, insurance, and healthcare—so your family thrives for generations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="px-8 py-3 pointer-events-auto"
            onClick={() => { 
              analytics.track('hero.cta.clicked', { group: 'family', cta: 'see_how_it_works' });
              track("hero.cta.clicked", { label: "See How It Works", group: 'family' });
              scrollToId("how-it-works"); 
            }}
          >
            See How It Works
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-3 pointer-events-auto"
            onClick={() => { 
              analytics.track('hero.cta.clicked', { group: 'family', cta: 'try_value_calculator' });
              track("hero.cta.clicked", { label: "Try the Value Calculator", group: 'family' });
              navigate("/tools/value-calculator"); 
            }}
          >
            Try the Value Calculator
          </Button>
        </div>
        <div className="text-sm text-muted-foreground/80 pt-4">
          <Link to="/invite" className="underline hover:no-underline pointer-events-auto">
            I have an invitation
          </Link>
        </div>
      </div>
    </section>
  );
}