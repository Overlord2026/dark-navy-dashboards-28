import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCheck, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ChecklistItem {
  id: string;
  item: string;
  required: boolean;
}

interface SecurityChecklist {
  id: string;
  checklist_name: string;
  checklist_type: string;
  checklist_items: ChecklistItem[];
  mandatory_items: string[];
  version: number;
}

interface SecurityReviewChecklistProps {
  checklistType?: 'code_review' | 'product_planning' | 'architecture_review' | 'deployment_review';
  reviewSubject: string;
  onComplete?: (reviewId: string) => void;
}

export const SecurityReviewChecklist: React.FC<SecurityReviewChecklistProps> = ({
  checklistType = 'code_review',
  reviewSubject,
  onComplete
}) => {
  const [checklist, setChecklist] = useState<SecurityChecklist | null>(null);
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [securityConcerns, setSecurityConcerns] = useState<string[]>(['']);
  const [recommendations, setRecommendations] = useState<string[]>(['']);
  const [blockingIssues, setBlockingIssues] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [overallStatus, setOverallStatus] = useState<'passed' | 'failed' | 'needs_revision'>('passed');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChecklist();
  }, [checklistType]);

  const fetchChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from('security_review_checklists')
        .select('*')
        .eq('checklist_type', checklistType)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      // Parse the JSON checklist items
      let parsedItems: ChecklistItem[] = [];
      try {
        parsedItems = Array.isArray(data.checklist_items) 
          ? (data.checklist_items as any[]).map((item: any) => ({
              id: item.id || '',
              item: item.item || '',
              required: item.required || false
            }))
          : [];
      } catch (error) {
        console.error('Error parsing checklist items:', error);
      }

      const checklistData = {
        ...data,
        checklist_items: parsedItems
      };
      setChecklist(checklistData);
      
      // Initialize responses
      const initialResponses: Record<string, boolean> = {};
      checklistData.checklist_items.forEach((item: ChecklistItem) => {
        initialResponses[item.id] = false;
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security checklist.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (itemId: string, checked: boolean) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: checked
    }));

    // Auto-calculate overall status based on mandatory items
    if (checklist) {
      const mandatoryPassed = checklist.mandatory_items.every(mandatoryId => {
        return itemId === mandatoryId ? checked : responses[mandatoryId];
      });

      if (!mandatoryPassed) {
        setOverallStatus('failed');
      } else {
        const allItemsPassed = checklist.checklist_items.every(item => {
          return itemId === item.id ? checked : responses[item.id];
        });
        setOverallStatus(allItemsPassed ? 'passed' : 'needs_revision');
      }
    }
  };

  const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const updateField = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeField = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const submitReview = async () => {
    if (!checklist) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const reviewData = {
        checklist_id: checklist.id,
        review_subject: reviewSubject,
        review_type: checklistType,
        reviewed_by: user.id,
        checklist_responses: responses,
        overall_status: overallStatus,
        security_concerns: securityConcerns.filter(concern => concern.trim() !== ''),
        recommendations: recommendations.filter(rec => rec.trim() !== ''),
        blocking_issues: blockingIssues.filter(issue => issue.trim() !== ''),
        approved_for_production: overallStatus === 'passed',
        notes: notes.trim() || null
      };

      const { data, error } = await supabase
        .from('security_review_completions')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Security Review Completed',
        description: `Review for "${reviewSubject}" has been submitted successfully.`,
      });

      onComplete?.(data.id);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit security review.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !checklist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mandatoryItemsCompleted = checklist.mandatory_items.every(itemId => responses[itemId]);
  const allItemsCompleted = checklist.checklist_items.every(item => responses[item.id]);
  const completionPercentage = (Object.values(responses).filter(Boolean).length / checklist.checklist_items.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          {checklist.checklist_name}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline">Version {checklist.version}</Badge>
          <Badge variant="outline">{checklistType.replace('_', ' ').toUpperCase()}</Badge>
          <div className="text-sm text-muted-foreground">
            Review Subject: <span className="font-medium">{reviewSubject}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {Math.round(completionPercentage)}% completed ({Object.values(responses).filter(Boolean).length}/{checklist.checklist_items.length})
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Checklist Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security Checklist Items</h3>
          <div className="space-y-3">
            {checklist.checklist_items.map((item) => {
              const isRequired = checklist.mandatory_items.includes(item.id);
              const isChecked = responses[item.id];
              
              return (
                <div 
                  key={item.id} 
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    isRequired ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleResponseChange(item.id, !!checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                      {item.item}
                      {isRequired && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Required
                        </Badge>
                      )}
                    </label>
                  </div>
                  {isChecked ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : isRequired ? (
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Overall Assessment</h3>
          <div>
            <Label htmlFor="overallStatus">Review Status</Label>
            <Select value={overallStatus} onValueChange={(value: any) => setOverallStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passed">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Passed - Approved for Production
                  </span>
                </SelectItem>
                <SelectItem value="needs_revision">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    Needs Revision - Minor Issues
                  </span>
                </SelectItem>
                <SelectItem value="failed">
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Failed - Major Security Issues
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Security Concerns */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Security Concerns</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addField(setSecurityConcerns)}
            >
              Add Concern
            </Button>
          </div>
          {securityConcerns.map((concern, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={concern}
                onChange={(e) => updateField(index, e.target.value, setSecurityConcerns)}
                placeholder="Describe security concern..."
                className="flex-1"
              />
              {securityConcerns.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeField(index, setSecurityConcerns)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recommendations</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addField(setRecommendations)}
            >
              Add Recommendation
            </Button>
          </div>
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={recommendation}
                onChange={(e) => updateField(index, e.target.value, setRecommendations)}
                placeholder="Security recommendation..."
                className="flex-1"
              />
              {recommendations.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeField(index, setRecommendations)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Blocking Issues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Blocking Issues</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addField(setBlockingIssues)}
            >
              Add Blocking Issue
            </Button>
          </div>
          {blockingIssues.map((issue, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={issue}
                onChange={(e) => updateField(index, e.target.value, setBlockingIssues)}
                placeholder="Critical security issue that blocks production deployment..."
                className="flex-1"
              />
              {blockingIssues.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeField(index, setBlockingIssues)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional security considerations, context, or notes..."
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            onClick={submitReview}
            disabled={submitting || !mandatoryItemsCompleted}
            className="min-w-[150px]"
          >
            {submitting ? 'Submitting...' : 'Complete Review'}
          </Button>
        </div>

        {!mandatoryItemsCompleted && (
          <p className="text-sm text-red-600 text-center">
            Please complete all required checklist items before submitting.
          </p>
        )}
      </CardContent>
    </Card>
  );
};