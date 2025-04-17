
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from '../../../pages/mobile/MobileEducation';
import { CourseCategory } from '@/types/education';
import { toast } from 'sonner';

interface MobileEducationCategoriesProps {
  categories: CourseCategory[];
}

export const MobileEducationCategories = ({ categories }: MobileEducationCategoriesProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Browse by Topic</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.slice(0, 6).map((category) => (
          category.id !== "all-courses" && (
            <Card key={category.id} className="bg-[#1B1B32] border border-[#2A2A45]">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    {getCategoryIcon(category.id)}
                  </div>
                  <h4 className="text-sm font-medium">{category.name}</h4>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => toast.info("More categories coming soon")}
      >
        View All Categories
      </Button>
    </div>
  );
};
