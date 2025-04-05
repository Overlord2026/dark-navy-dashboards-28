
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: ReactNode;
  footer?: ReactNode; // Add optional footer property
  children: ReactNode;
}

export function DashboardCard({ title, icon, children, footer, className, ...props }: DashboardCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="mt-1">{children}</div>
          </div>
          {icon && (
            <div className="bg-primary/10 p-2 rounded-full">
              {icon}
            </div>
          )}
        </div>
        {footer && <div className="mt-4 pt-3 border-t">{footer}</div>}
      </CardContent>
    </Card>
  );
}
