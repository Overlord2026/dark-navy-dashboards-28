
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { courseCategories } from "@/data/education";

export default function Courses() {
  return (
    <ThreeColumnLayout title="Courses" activeMainItem="education">
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-muted-foreground">
          Browse our comprehensive selection of financial education courses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {courseCategories.map((category) => (
            <div 
              key={category.id}
              className="bg-card border border-border rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium mb-2">{category.name}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
