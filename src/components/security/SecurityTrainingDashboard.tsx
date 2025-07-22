import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Trophy, 
  AlertTriangle, 
  Users, 
  Target,
  CheckCircle,
  Play,
  Shield
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

interface TrainingProgram {
  id: string;
  program_name: string;
  program_type: string;
  description: string;
  duration_minutes: number;
  required_for_roles: string[];
  passing_score: number;
}

interface TrainingSchedule {
  id: string;
  schedule_name: string;
  frequency: string;
  next_due_date: string;
  last_completed_date?: string;
  mandatory: boolean;
  program: TrainingProgram;
}

interface TrainingCompletion {
  id: string;
  program_id: string;
  completed_at?: string;
  score?: number;
  passed: boolean;
  certificate_issued: boolean;
  program: TrainingProgram;
}

interface PhishingResult {
  id: string;
  simulation_id: string;
  email_opened: boolean;
  link_clicked: boolean;
  data_entered: boolean;
  reported_suspicious: boolean;
  time_to_report_minutes?: number;
  opened_at?: string;
  clicked_at?: string;
  reported_at?: string;
  simulation: {
    campaign_name: string;
    campaign_type: string;
  };
}

export const SecurityTrainingDashboard: React.FC = () => {
  const [trainingSchedules, setTrainingSchedules] = useState<TrainingSchedule[]>([]);
  const [completions, setCompletions] = useState<TrainingCompletion[]>([]);
  const [phishingResults, setPhishingResults] = useState<PhishingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      // Fetch training schedules with programs
      const { data: schedules, error: schedulesError } = await supabase
        .from('security_training_schedules')
        .select(`
          *,
          program:security_training_programs(*)
        `)
        .order('next_due_date', { ascending: true });

      if (schedulesError) throw schedulesError;

      // Fetch user's training completions
      const { data: userCompletions, error: completionsError } = await supabase
        .from('security_training_completions')
        .select(`
          *,
          program:security_training_programs(*)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('completed_at', { ascending: false });

      if (completionsError) throw completionsError;

      // Fetch phishing simulation results
      const { data: phishing, error: phishingError } = await supabase
        .from('phishing_simulation_results')
        .select(`
          *,
          simulation:phishing_simulations(campaign_name, campaign_type)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (phishingError) throw phishingError;

      setTrainingSchedules(schedules || []);
      setCompletions(userCompletions || []);
      setPhishingResults(phishing || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load training data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startTraining = async (programId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('security_training_completions')
        .insert([{
          user_id: user.id,
          program_id: programId,
          started_at: new Date().toISOString(),
          attempts: 1
        }]);

      if (error) throw error;

      toast({
        title: 'Training Started',
        description: 'Your training session has been initiated.',
      });

      fetchTrainingData();
    } catch (error) {
      console.error('Error starting training:', error);
      toast({
        title: 'Error',
        description: 'Failed to start training.',
        variant: 'destructive',
      });
    }
  };

  const getTrainingStatus = (schedule: TrainingSchedule) => {
    const completion = completions.find(c => c.program_id === schedule.program.id);
    const daysUntilDue = differenceInDays(parseISO(schedule.next_due_date), new Date());
    
    if (completion?.passed) {
      return { status: 'completed', color: 'bg-green-500', label: 'Completed' };
    } else if (daysUntilDue < 0) {
      return { status: 'overdue', color: 'bg-red-500', label: 'Overdue' };
    } else if (daysUntilDue <= 7) {
      return { status: 'due-soon', color: 'bg-yellow-500', label: 'Due Soon' };
    } else {
      return { status: 'upcoming', color: 'bg-blue-500', label: 'Upcoming' };
    }
  };

  const calculateCompletionRate = () => {
    if (trainingSchedules.length === 0) return 0;
    const completedCount = trainingSchedules.filter(schedule => {
      const completion = completions.find(c => c.program_id === schedule.program.id);
      return completion?.passed;
    }).length;
    return (completedCount / trainingSchedules.length) * 100;
  };

  const calculatePhishingSuccessRate = () => {
    if (phishingResults.length === 0) return 0;
    const successfulReports = phishingResults.filter(result => result.reported_suspicious && !result.link_clicked).length;
    return (successfulReports / phishingResults.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{trainingSchedules.length}</p>
                <p className="text-sm text-muted-foreground">Training Programs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(calculateCompletionRate())}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(calculatePhishingSuccessRate())}%</p>
                <p className="text-sm text-muted-foreground">Phishing Defense</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{completions.filter(c => c.passed).length}</p>
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training Schedule</TabsTrigger>
          <TabsTrigger value="history">Training History</TabsTrigger>
          <TabsTrigger value="phishing">Phishing Results</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingSchedules.map((schedule) => {
                  const status = getTrainingStatus(schedule);
                  const completion = completions.find(c => c.program_id === schedule.program.id);
                  
                  return (
                    <div key={schedule.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">{schedule.program.program_name}</h3>
                          <p className="text-sm text-muted-foreground">{schedule.program.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {schedule.program.duration_minutes} minutes
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {format(parseISO(schedule.next_due_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${status.color} text-white`}>
                            {status.label}
                          </Badge>
                          {schedule.mandatory && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {completion?.passed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Completed with score: {completion.score}%</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => startTraining(schedule.program.id)}
                          className="w-full sm:w-auto"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Training
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completions.map((completion) => (
                  <div key={completion.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{completion.program.program_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed: {completion.completed_at ? format(parseISO(completion.completed_at), 'MMM dd, yyyy HH:mm') : 'In progress'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {completion.passed ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passed ({completion.score}%)
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Failed ({completion.score}%)
                          </Badge>
                        )}
                        {completion.certificate_issued && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Trophy className="h-3 w-3 mr-1" />
                            Certified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phishing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Phishing Simulation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phishingResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">{result.simulation.campaign_name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.email_opened && (
                            <Badge variant="destructive">Email Opened</Badge>
                          )}
                          {result.link_clicked && (
                            <Badge variant="destructive">Link Clicked</Badge>
                          )}
                          {result.data_entered && (
                            <Badge variant="destructive">Data Entered</Badge>
                          )}
                          {result.reported_suspicious && (
                            <Badge className="bg-green-500 text-white">Reported as Suspicious</Badge>
                          )}
                        </div>
                        {result.time_to_report_minutes && (
                          <p className="text-sm text-muted-foreground">
                            Reported in {result.time_to_report_minutes} minutes
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {result.simulation.campaign_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};