
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { DiagnosticResult } from '@/types/diagnostics';

interface DiagnosticResultItemProps {
  result: DiagnosticResult;
}

export const DiagnosticResultItem: React.FC<DiagnosticResultItemProps> = ({ result }) => {
  return (
    <li 
      className={`p-3 rounded-md flex items-start justify-between
        ${result.status === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 
         result.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
         'bg-red-50 dark:bg-red-900/20'}`}
    >
      <div>
        <div className="flex items-center gap-2">
          {result.status === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : result.status === 'warning' ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="font-medium">{result.route}</span>
        </div>
        {result.message && (
          <p className="text-sm mt-1 ml-6">{result.message}</p>
        )}
      </div>
    </li>
  );
};
