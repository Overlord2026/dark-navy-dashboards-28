import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, BookOpen } from 'lucide-react';
import { getModules, completeModule, EducationModule } from '@/features/nil/education/api';
import { toast } from 'sonner';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

export default function EducationPage() {
  const [modules, setModules] = React.useState<EducationModule[]>([]);

  React.useEffect(() => {
    getModules().then(setModules);
  }, []);

  const handleCompleteModule = async (id: string) => {
    try {
      const receipt = await completeModule(id);
      const updatedModules = await getModules();
      setModules(updatedModules);
      
      toast.success('Module completed!', {
        description: `Receipt: ${receipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Receipt:', receipt)
        }
      });

      if (receipt.result === 'approve') {
        toast.success('Education requirements met!', {
          description: 'You can now proceed with NIL activities'
        });
      } else if (receipt.reasons.includes('EDU_STALE')) {
        toast.warning('Education may be stale', {
          description: 'Consider refreshing your knowledge'
        });
      }
    } catch (error) {
      toast.error('Failed to complete module');
    }
  };

  const completedCount = modules.filter(m => m.status === 'done').length;
  const progressPercent = (completedCount / modules.length) * 100;

  return (
    <div className="min-h-screen bg-bfo-black text-white">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">NIL Education</h1>
          <p className="text-white/70">
            Complete all modules to unlock NIL opportunities
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="flex items-center gap-2 text-white font-semibold">
                <BookOpen className="h-5 w-5 text-bfo-gold" />
                Progress Overview
              </CardTitle>
              <CardDescription className="text-white/70">
                {completedCount} of {modules.length} modules completed ({Math.round(progressPercent)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-bfo-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {modules.map((module) => (
              <Card key={module.id} className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {module.status === 'done' ? (
                        <CheckCircle className="h-5 w-5 text-bfo-gold" />
                      ) : (
                        <Circle className="h-5 w-5 text-white/40" />
                      )}
                      <div>
                        <CardTitle className="text-lg text-white font-semibold">{module.title}</CardTitle>
                        {module.completedAt && (
                          <CardDescription className="text-white/70">
                            Completed: {new Date(module.completedAt).toLocaleDateString()}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={module.status === 'done' ? 'default' : 'secondary'} 
                        className={module.status === 'done' 
                          ? 'bg-bfo-gold text-black' 
                          : 'bg-white/10 text-white border-white/20'
                        }
                      >
                        {module.status === 'done' ? 'Complete' : 'Pending'}
                      </Badge>
                      {module.status === 'todo' && (
                        <GoldButton onClick={() => handleCompleteModule(module.id)}>
                          Complete
                        </GoldButton>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}