import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Calculator, Target, TrendingUp, FileText } from "lucide-react";

export function ToolsPage() {
  const tools = [
    {
      title: "Value Calculator",
      description: "Calculate the potential value of working with a family office",
      href: "/tools/value-calculator",
      icon: Calculator,
      color: "bg-blue-500"
    },
    {
      title: "Target Analyzer", 
      description: "Analyze your target market and identify opportunities",
      href: "/tools/target-analyzer",
      icon: Target,
      color: "bg-green-500"
    },
    {
      title: "Portfolio Tracker",
      description: "Track and analyze your investment portfolio performance",
      href: "/tools/portfolio-tracker",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Report Generator",
      description: "Generate comprehensive financial reports and insights",
      href: "/tools/report-generator", 
      icon: FileText,
      color: "bg-orange-500"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-foreground">Professional Tools</h1>
            <p className="text-lg text-muted-foreground">
              Powerful tools to help you grow your practice and serve your clients better.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group p-6 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${tool.color} text-white group-hover:scale-110 transition-transform`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Need help getting started or have questions about our tools?
            </p>
            <Link
              to="/meet?type=demo&source=tools"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}