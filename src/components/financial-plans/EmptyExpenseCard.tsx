
import React from "react";
import { PlusCircle } from "lucide-react";

interface EmptyExpenseCardProps {
  type: string;
  period: string;
  onClick: () => void;
}

export const EmptyExpenseCard = ({ type, period, onClick }: EmptyExpenseCardProps) => (
  <div
    className="h-36 border border-dashed border-blue-900/30 rounded-lg flex items-center justify-center p-4 cursor-pointer hover:border-blue-500/30 transition-all"
    onClick={onClick}
  >
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
        <PlusCircle className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Add {type.toLowerCase()} expenses
      </p>
    </div>
  </div>
);
