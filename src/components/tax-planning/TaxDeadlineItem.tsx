
import React from "react";

export interface TaxDeadlineItemProps {
  date: string;
  title: string;
  description: string;
  daysLeft: number;
}

export const TaxDeadlineItem = ({ date, title, description, daysLeft }: TaxDeadlineItemProps) => {
  return (
    <div className="border border-gray-700 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{title}</h4>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{date}</span>
          <span className={`text-xs mt-1 ${daysLeft < 30 ? 'text-red-400' : 'text-blue-400'}`}>
            {daysLeft} days left
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};
