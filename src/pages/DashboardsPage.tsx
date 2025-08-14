import { MainLayout } from "@/components/layout/MainLayout";

export default function DashboardsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Family Office Dashboards</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive view of your family's financial picture and performance.
          </p>
          <div className="bg-muted/50 rounded-lg p-8 border border-border">
            <p className="text-muted-foreground">
              This feature is coming soon. You'll have access to real-time dashboards showing your complete financial overview.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}