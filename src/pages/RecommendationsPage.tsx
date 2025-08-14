import { MainLayout } from "@/components/layout/MainLayout";

export default function RecommendationsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Personalized Recommendations</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered recommendations tailored to your family's financial goals.
          </p>
          <div className="bg-muted/50 rounded-lg p-8 border border-border">
            <p className="text-muted-foreground">
              This feature is coming soon. You'll receive personalized financial recommendations based on your profile and goals.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}