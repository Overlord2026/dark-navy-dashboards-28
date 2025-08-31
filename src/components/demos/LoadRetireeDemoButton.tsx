import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlayCircle } from 'lucide-react';

export default function LoadRetireeDemoButton() {
  const navigate = useNavigate();

  const handleLoadDemo = async () => {
    try {
      // Simulate loading retiree family fixtures
      toast.loading('Loading retiree family demo...', { id: 'demo-load' });
      
      // In a real implementation, this would call the fixtures loader
      // For now, we'll simulate the loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Retiree family demo loaded!', { 
        id: 'demo-load',
        description: 'Sample retirement data, goals, and documents created'
      });
      
      // Navigate to family roadmap
      navigate('/family/roadmap');
    } catch (error) {
      console.error('[Retiree demo error]', error);
      toast.error('Failed to load demo', { 
        id: 'demo-load',
        description: 'Please try again'
      });
    }
  };

  return (
    <Button 
      onClick={handleLoadDemo} 
      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
      size="sm"
    >
      <PlayCircle className="h-4 w-4" />
      Load Family Demo (Retirees)
    </Button>
  );
}