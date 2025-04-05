
import React from "react";
import { TaxDeadlineItem } from "./TaxDeadlineItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaxDeadlinesListProps {
  deadlines: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    daysLeft: number;
  }>;
}

export const TaxDeadlinesList = ({ deadlines }: TaxDeadlinesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          Important Tax Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline) => (
          <TaxDeadlineItem
            key={deadline.id}
            date={deadline.date}
            title={deadline.title}
            description={deadline.description}
            daysLeft={deadline.daysLeft}
          />
        ))}
      </CardContent>
    </Card>
  );
};
