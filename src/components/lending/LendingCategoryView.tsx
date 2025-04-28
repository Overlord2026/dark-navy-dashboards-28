
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { LoanCategory } from "./types";

interface LendingCategoryViewProps {
  categories: LoanCategory[];
  onCategorySelect: (categoryId: string) => void;
}

export const LendingCategoryView: React.FC<LendingCategoryViewProps> = ({ 
  categories, 
  onCategorySelect 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Lending Solutions</h1>
        <p className="text-muted-foreground">
          Explore our range of lending solutions designed for your unique financial needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div
                  className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: category.colorLight }}
                >
                  {category.icon && (
                    <category.icon
                      className="h-6 w-6"
                      style={{ color: category.colorDark }}
                    />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">View Options</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
