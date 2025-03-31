
import React from 'react';
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <ThreeColumnLayout title="Page Not Found">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </ThreeColumnLayout>
  );
}
