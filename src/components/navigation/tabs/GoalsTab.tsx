import React from "react";
import { NavItem } from "@/types/navigation";
import { Target, TrendingUp, Goal, CheckCircle } from "lucide-react";

export const goalsNavItems: NavItem[] = [
  {
    title: "Goals Dashboard",
    href: "/goals",
    icon: Target,
    category: "overview"
  },
  {
    title: "Create New Goal",
    href: "/goals/create",
    icon: TrendingUp,
    category: "actions"
  },
  {
    title: "Goal Progress",
    href: "/goals/progress",
    icon: Goal,
    category: "tracking"
  },
  {
    title: "Completed Goals",
    href: "/goals/completed",
    icon: CheckCircle,
    category: "history"
  }
];

const GoalsTab = () => {
  return (
    <div className="goals-tab">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Aspirational Goals & Life Planning
        </h2>
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            Boutique Family Office Experience
          </h3>
          <p className="text-muted-foreground mb-4">
            Experience Return is the new investment return. Set, track, and celebrate the same kinds of goals that ultra-high-net-worth families have used for generations—made accessible to you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-md">
              <h4 className="font-medium text-foreground mb-2">Legacy & Impact</h4>
              <p className="text-sm text-muted-foreground">
                Charitable giving, family foundations, and meaningful contributions to causes you care about.
              </p>
            </div>
            <div className="bg-background/50 p-4 rounded-md">
              <h4 className="font-medium text-foreground mb-2">Family Experiences</h4>
              <p className="text-sm text-muted-foreground">
                Multi-generational trips, milestone celebrations, and memory-making adventures.
              </p>
            </div>
            <div className="bg-background/50 p-4 rounded-md">
              <h4 className="font-medium text-foreground mb-2">Wellness & Longevity</h4>
              <p className="text-sm text-muted-foreground">
                Healthcare optimization, preventive care, and investments in your healthspan.
              </p>
            </div>
            <div className="bg-background/50 p-4 rounded-md">
              <h4 className="font-medium text-foreground mb-2">Lifetime Gifting</h4>
              <p className="text-sm text-muted-foreground">
                Strategic giving to family members and loved ones during your lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;