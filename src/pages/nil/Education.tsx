import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, BookOpen } from 'lucide-react';
import { getModules, completeModule, EducationModule } from '@/features/nil/education/api';
import { toast } from 'sonner';

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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Education</h1>
        <p className="text-muted-foreground">
          Complete all modules to unlock NIL opportunities
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Progress Overview
            </CardTitle>
            <CardDescription>
              {completedCount} of {modules.length} modules completed ({Math.round(progressPercent)}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {module.status === 'done' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      {module.completedAt && (
                        <CardDescription>
                          Completed: {new Date(module.completedAt).toLocaleDateString()}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={module.status === 'done' ? 'default' : 'secondary'}>
                      {module.status === 'done' ? 'Complete' : 'Pending'}
                    </Badge>
                    {module.status === 'todo' && (
                      <Button 
                        onClick={() => handleCompleteModule(module.id)}
                        size="sm"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}