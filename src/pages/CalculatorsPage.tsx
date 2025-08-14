import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Calculator, Target, BarChart3 } from "lucide-react";

export default function CalculatorsPage() {
  const calculators = [
    {
      title: "Value Calculator",
      description: "Calculate the potential value of working with a family office",
      href: "/tools/value-calculator",
      icon: Calculator,
    },
    {
      title: "Target Analyzer", 
      description: "Analyze your target market and identify opportunities",
      href: "/tools/target-analyzer",
      icon: Target,
    },
    {
      title: "Retirement Scorecard™",
      description: "Quick confidence score plus action items",
      href: "/scorecard",
      icon: BarChart3,
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-foreground">Financial Calculators</h1>
            <p className="text-lg text-muted-foreground">
              Powerful tools to analyze your financial situation and opportunities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                to={calc.href}
                className="group p-6 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className="text-center space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mx-auto group-hover:scale-110 transition-transform">
                    <calc.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {calc.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}