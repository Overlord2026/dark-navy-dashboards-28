
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

type StatusType = 'success' | 'warning' | 'error';

interface StatusIconProps {
  status: StatusType;
  size?: number;
}

export const StatusIcon = ({ status, size = 6 }: StatusIconProps) => {
  switch (status) {
    case 'success':
      return <CheckCircle className={`h-${size} w-${size} text-green-500`} />;
    case 'warning':
      return <AlertTriangle className={`h-${size} w-${size} text-yellow-500`} />;
    case 'error':
      return <AlertCircle className={`h-${size} w-${size} text-red-500`} />;
    default:
      return null;
  }
};

export const getStatusColor = (status: StatusType) => {
  switch (status) {
    case 'success':
      return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
    case 'warning':
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
    case 'error':
      return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
    default:
      return "bg-card";
  }
};

export const getOverallStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
  switch (status) {
    case 'healthy':
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
    case 'warning':
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
    case 'critical':
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
    default:
      return "";
  }
};
