import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/context/DemoContext';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

interface LoadDemoButtonProps {
  toolKey: string;
  onLoadDemo: () => void;
  loading?: boolean;
  hasData?: boolean;
  className?: string;
}

export const LoadDemoButton: React.FC<LoadDemoButtonProps> = ({
  toolKey,
  onLoadDemo,
  loading = false,
  hasData = false,
  className = ''
}) => {
  const { isDemo } = useDemo() || { isDemo: false };

  const handleClick = () => {
    onLoadDemo();
    toast.success('Demo data loaded (Proof added)');
    analytics.track('family.tool.demo.loaded', { toolKey });
  };

  // If in demo mode and no data, auto-load on mount
  React.useEffect(() => {
    if (isDemo && !hasData && !loading) {
      const timer = setTimeout(handleClick, 500);
      return () => clearTimeout(timer);
    }
  }, [isDemo, hasData, loading]);

  // Don't show button if in demo mode and data is already loaded
  if (isDemo && hasData) return null;

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={`focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
      variant={hasData ? "outline" : "default"}
    >
      {loading ? (
        <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Play className="w-4 h-4 mr-2" />
      )}
      {hasData ? 'Reload Demo' : 'Load Demo'}
    </Button>
  );
};