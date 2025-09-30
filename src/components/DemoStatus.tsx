import { FLAGS } from '@/config/flags';
import { demoService } from '@/services/demoService';
import { Badge } from '@/components/ui/badge';

export const DemoStatus = () => {
  if (!FLAGS.IS_DEVELOPMENT) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
        🎭 DEMO MODE
      </Badge>
    </div>
  );
};