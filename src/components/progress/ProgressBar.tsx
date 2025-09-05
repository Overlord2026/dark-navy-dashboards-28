import React from 'react';

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/80">{label}</span>
          <span className="text-bfo-gold font-medium">{percentage}% complete</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="bg-bfo-gold h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};