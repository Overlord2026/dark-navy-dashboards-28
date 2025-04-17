
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { EducationalResource } from '@/types/education';

interface FinancialGuideGridProps {
  guides: EducationalResource[];
}

export const FinancialGuideGrid = ({ guides }: FinancialGuideGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guides.map((guide) => (
        <Card key={guide.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{guide.title}</CardTitle>
            <CardDescription>{guide.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {guide.category}
              </span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => window.open(guide.ghlUrl, '_blank', 'noopener,noreferrer')}
            >
              Read Guide <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
