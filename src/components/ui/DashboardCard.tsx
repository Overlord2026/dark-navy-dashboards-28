
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
    <div className={cn("dashboard-card animate-fade-in bg-[#0f1a2b] border-gray-700/50", className)}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title text-white">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="mb-4 text-gray-100">{children}</div>
      {footer && <div className="mt-auto pt-2 border-t border-gray-700/50">{footer}</div>}
    </div>
  );
};
