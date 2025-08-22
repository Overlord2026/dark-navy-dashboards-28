import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

interface DemoLauncherProps {
  demoId: string;
  children?: React.ReactNode;
}

const DemoLauncher: React.FC<DemoLauncherProps> = ({ demoId, children }) => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    analytics.trackEvent('demo_clicked', { demoId });
    navigate(`/demos/${demoId}`);
  };

  if (children) {
    return (
      <div onClick={handleDemoClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={handleDemoClick}>
      <Play className="w-4 h-4 mr-2" />
      60-sec demo
    </Button>
  );
};

export default DemoLauncher;