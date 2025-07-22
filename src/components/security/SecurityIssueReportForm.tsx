import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Shield, FileText, Users } from 'lucide-react';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  issueType: z.enum(['phishing_email', 'suspicious_activity', 'data_breach', 'malware', 'unauthorized_access', 'policy_violation', 'physical_security', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email('Please enter a valid email'),
  reporterPhone: z.string().optional(),
  incidentDateTime: z.string().optional(),
  location: z.string().optional(),
  affectedSystems: z.string().optional(),
  witnesses: z.string().optional(),
  immediateActionsTaken: z.string().optional(),
  anonymized: z.boolean().default(false)
});

type ReportFormData = z.infer<typeof reportSchema>;

interface SecurityIssueReportFormProps {
  onSuccess?: () => void;
}

export const SecurityIssueReportForm: React.FC<SecurityIssueReportFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      severity: 'medium',
      anonymized: false
    }
  });

  const issueType = watch('issueType');
  const severity = watch('severity');

  const issueTypeOptions = [
    { value: 'phishing_email', label: 'Phishing Email', icon: '📧' },
    { value: 'suspicious_activity', label: 'Suspicious Activity', icon: '👀' },
    { value: 'data_breach', label: 'Data Breach', icon: '💾' },
    { value: 'malware', label: 'Malware', icon: '🦠' },
    { value: 'unauthorized_access', label: 'Unauthorized Access', icon: '🔐' },
    { value: 'policy_violation', label: 'Policy Violation', icon: '📋' },
    { value: 'physical_security', label: 'Physical Security', icon: '🏢' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'high', label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { value: 'critical', label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const reportData = {
        title: data.title,
        description: data.description,
        issue_type: data.issueType,
        severity: data.severity,
        reporter_name: data.anonymized ? 'Anonymous' : data.reporterName,
        reporter_email: data.reporterEmail,
        reporter_phone: data.reporterPhone,
        incident_datetime: data.incidentDateTime ? new Date(data.incidentDateTime).toISOString() : null,
        location: data.location,
        affected_systems: data.affectedSystems ? data.affectedSystems.split(',').map(s => s.trim()) : [],
        witnesses: data.witnesses ? data.witnesses.split(',').map(s => s.trim()) : [],
        immediate_actions_taken: data.immediateActionsTaken,
        reported_by_user_id: user?.id,
        anonymized: data.anonymized
      };

      const { error } = await supabase
        .from('security_issue_reports')
        .insert([reportData]);

      if (error) throw error;

      toast({
        title: 'Security Issue Reported',
        description: 'Your security issue report has been submitted successfully. Our security team will investigate.',
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting security report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit security report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Report Security Issue
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use this form to report any security concerns, incidents, or policy violations.
          All reports are taken seriously and will be investigated promptly.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Brief description of the security issue"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueType">Issue Type *</Label>
                <Select onValueChange={(value) => setValue('issueType', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.issueType && (
                  <p className="text-sm text-red-600 mt-1">{errors.issueType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="severity">Severity *</Label>
                <Select onValueChange={(value) => setValue('severity', value as any)} defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={`flex items-center gap-2 ${option.color}`}>
                          <AlertTriangle className="h-4 w-4" />
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.severity && (
                  <p className="text-sm text-red-600 mt-1">{errors.severity.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Please provide a detailed description of the security issue, including what happened, when it occurred, and any relevant details..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Reporter Information
            </h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymized"
                onCheckedChange={(checked) => setValue('anonymized', !!checked)}
              />
              <Label htmlFor="anonymized" className="text-sm">
                Submit this report anonymously
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName">Your Name</Label>
                <Input
                  id="reporterName"
                  {...register('reporterName')}
                  placeholder="Your full name"
                  disabled={watch('anonymized')}
                />
              </div>

              <div>
                <Label htmlFor="reporterEmail">Your Email *</Label>
                <Input
                  id="reporterEmail"
                  type="email"
                  {...register('reporterEmail')}
                  placeholder="your.email@company.com"
                  className={errors.reporterEmail ? 'border-red-500' : ''}
                />
                {errors.reporterEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.reporterEmail.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="reporterPhone">Phone Number (Optional)</Label>
              <Input
                id="reporterPhone"
                {...register('reporterPhone')}
                placeholder="Your phone number"
              />
            </div>
          </div>

          {/* Incident Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Incident Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incidentDateTime">Incident Date & Time</Label>
                <Input
                  id="incidentDateTime"
                  type="datetime-local"
                  {...register('incidentDateTime')}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Where did this incident occur?"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="affectedSystems">Affected Systems</Label>
              <Input
                id="affectedSystems"
                {...register('affectedSystems')}
                placeholder="List affected systems, applications, or services (comma-separated)"
              />
            </div>

            <div>
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input
                id="witnesses"
                {...register('witnesses')}
                placeholder="Names or contact info of any witnesses (comma-separated)"
              />
            </div>

            <div>
              <Label htmlFor="immediateActionsTaken">Immediate Actions Taken</Label>
              <Textarea
                id="immediateActionsTaken"
                {...register('immediateActionsTaken')}
                placeholder="Describe any immediate actions you or others have taken in response to this incident..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};