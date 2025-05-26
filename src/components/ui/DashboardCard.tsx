
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const DashboardCard = ({
  title,
  icon,
  children,
  className,
  footer,
}: DashboardCardProps) => {
  return (
    <div className={cn("dashboard-card animate-fade-in", className)}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">{title}</h3>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
      <div className="mb-4">{children}</div>
      {footer && <div className="mt-auto pt-2 border-t border-border/30">{footer}</div>}
    </div>
  );
};
