import { MainLayout } from "@/components/layout/MainLayout";

export default function NotesPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Notes & Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Your centralized hub for important family office notes and documentation.
          </p>
          <div className="bg-muted/50 rounded-lg p-8 border border-border">
            <p className="text-muted-foreground">
              This feature is coming soon. You'll be able to organize, share, and collaborate on important financial documents and notes here.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}