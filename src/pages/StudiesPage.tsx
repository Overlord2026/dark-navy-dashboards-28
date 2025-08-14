import { MainLayout } from "@/components/layout/MainLayout";

export default function StudiesPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Research & Studies</h1>
          <p className="text-lg text-muted-foreground">
            In-depth research and case studies on family office best practices.
          </p>
          <div className="bg-muted/50 rounded-lg p-8 border border-border">
            <p className="text-muted-foreground">
              This feature is coming soon. You'll have access to comprehensive research and case studies on wealth management strategies.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}