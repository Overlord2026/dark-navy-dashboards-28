import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  Calendar, 
  GraduationCap, 
  Save, 
  X, 
  FileText, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Shield
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CECourse, InsuranceAgent } from '@/hooks/useInsuranceAgent';

interface EnhancedCEUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<CECourse, 'id' | 'agent_id' | 'created_at'>) => Promise<void>;
  agent: InsuranceAgent | null;
  isLoading?: boolean;
}

const courseTypes = [
  { value: 'Ethics', required: true, description: 'Required ethics training' },
  { value: 'Annuity', required: true, description: 'Annuity suitability training' },
  { value: 'LTC', required: true, description: 'Long-term care training' },
  { value: 'General', required: false, description: 'General continuing education' },
  { value: 'Suitability', required: true, description: 'Suitability training' },
  { value: 'Product Training', required: false, description: 'Product-specific training' },
  { value: 'Compliance', required: true, description: 'Compliance training' },
  { value: 'Sales Practices', required: false, description: 'Sales practices training' },
  { value: 'Other', required: false, description: 'Other approved training' }
];

const stateRequirements = {
  'CA': { total: 24, ethics: 3, annuity: 4, ltc: 2 },
  'TX': { total: 20, ethics: 2, annuity: 4, ltc: 0 },
  'FL': { total: 20, ethics: 5, annuity: 4, ltc: 2 },
  'NY': { total: 15, ethics: 3, annuity: 4, ltc: 2 },
  'IL': { total: 15, ethics: 3, annuity: 4, ltc: 0 }
};

export function EnhancedCEUploadModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  agent, 
  isLoading 
}: EnhancedCEUploadModalProps) {
  const [formData, setFormData] = useState({
    course_name: '',
    course_type: '',
    provider_name: '',
    completion_date: '',
    credits_earned: '',
    certificate_url: '',
    notes: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPreApproval, setIsPreApproval] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simulated AI extraction from PDF
  const extractCourseDataFromPDF = async (file: File) => {
    setIsExtracting(true);
    
    try {
      // Simulate PDF text extraction and AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data - in real implementation, would use PDF.js + AI
      const mockExtractedData = {
        courseName: 'Ethics in Insurance Sales - Advanced Training',
        provider: 'National Underwriter Company',
        courseType: 'Ethics',
        credits: '3',
        completionDate: '2024-01-15'
      };
      
      setExtractedData(mockExtractedData);
      
      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        course_name: mockExtractedData.courseName,
        provider_name: mockExtractedData.provider,
        course_type: mockExtractedData.courseType,
        credits_earned: mockExtractedData.credits,
        completion_date: mockExtractedData.completionDate
      }));
      
      toast.success('Course information extracted from certificate!');
    } catch (error) {
      toast.error('Failed to extract course information. Please fill manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setFormData(prev => ({ 
        ...prev, 
        certificate_url: `certificates/${file.name}` 
      }));
      
      // Auto-extract if PDF
      if (file.type === 'application/pdf') {
        await extractCourseDataFromPDF(file);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_name.trim()) {
      newErrors.course_name = 'Course name is required';
    }

    if (!isPreApproval && !formData.completion_date) {
      newErrors.completion_date = 'Completion date is required';
    }

    if (!formData.credits_earned || parseInt(formData.credits_earned) <= 0) {
      newErrors.credits_earned = 'Credits earned must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit({
        course_name: formData.course_name.trim(),
        course_type: formData.course_type || undefined,
        provider_name: formData.provider_name.trim() || undefined,
        completion_date: isPreApproval ? undefined : new Date(formData.completion_date),
        credits_earned: parseInt(formData.credits_earned),
        certificate_url: formData.certificate_url || undefined,
        verified: false // Always pending verification
      });

      handleClose();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      course_name: '',
      course_type: '',
      provider_name: '',
      completion_date: '',
      credits_earned: '',
      certificate_url: '',
      notes: ''
    });
    setUploadedFile(null);
    setExtractedData(null);
    setIsPreApproval(false);
    setErrors({});
    onClose();
  };

  // Calculate current credit status
  const getRequirementStatus = () => {
    if (!agent) return null;
    
    const stateReq = stateRequirements[agent.state as keyof typeof stateRequirements] || 
                     { total: 20, ethics: 3, annuity: 4, ltc: 0 };
    
    return {
      total: { required: stateReq.total, completed: agent.ce_credits_completed },
      ethics: { required: stateReq.ethics, completed: 0 }, // Would calculate from courses
      annuity: { required: stateReq.annuity, completed: 0 },
      ltc: { required: stateReq.ltc, completed: 0 }
    };
  };

  const requirements = getRequirementStatus();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <GraduationCap className="h-5 w-5 text-emerald" />
            {isPreApproval ? 'Request CE Course Pre-Approval' : 'Upload CE Course Certificate'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pre-approval Toggle */}
              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                <Switch
                  id="pre-approval"
                  checked={isPreApproval}
                  onCheckedChange={setIsPreApproval}
                />
                <div className="flex-1">
                  <Label htmlFor="pre-approval" className="text-sm font-medium">
                    Request Pre-Approval
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Request approval before taking the course
                  </p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Certificate Upload */}
              {!isPreApproval && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    Certificate Upload
                    {isExtracting && <Badge variant="secondary">AI Extracting...</Badge>}
                  </Label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                      isDragActive ? "border-emerald bg-emerald/5" : "border-border hover:border-emerald/50",
                      isExtracting && "opacity-50 pointer-events-none"
                    )}
                  >
                    <input {...getInputProps()} />
                    {isExtracting ? (
                      <div className="flex flex-col items-center">
                        <Zap className="h-8 w-8 mx-auto mb-4 text-emerald animate-pulse" />
                        <p className="text-emerald font-medium">Extracting course data...</p>
                        <p className="text-xs text-muted-foreground mt-1">AI is analyzing your certificate</p>
                      </div>
                    ) : isDragActive ? (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-4 text-emerald" />
                        <p className="text-emerald font-medium">Drop your certificate here...</p>
                      </div>
                    ) : uploadedFile ? (
                      <div>
                        <FileText className="h-8 w-8 mx-auto mb-4 text-emerald" />
                        <p className="text-emerald font-medium">✓ {uploadedFile.name}</p>
                        {extractedData && (
                          <Badge variant="secondary" className="mt-2">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-filled from PDF
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-foreground font-medium">Drag & drop certificate here</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          PDF files will be auto-scanned • Supports PDF, JPG, PNG
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Course Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course_name" className="text-sm font-medium">
                    Course Name *
                  </Label>
                  <Input
                    id="course_name"
                    value={formData.course_name}
                    onChange={(e) => handleInputChange('course_name', e.target.value)}
                    placeholder="Enter the full course name"
                    className={cn(errors.course_name && "border-destructive")}
                  />
                  {errors.course_name && (
                    <p className="text-sm text-destructive">{errors.course_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Course Type</Label>
                    <Select 
                      value={formData.course_type} 
                      onValueChange={(value) => handleInputChange('course_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course type" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.value}
                              {type.required && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Training Provider</Label>
                    <Input
                      value={formData.provider_name}
                      onChange={(e) => handleInputChange('provider_name', e.target.value)}
                      placeholder="e.g., National Underwriter, WebCE"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isPreApproval && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Completion Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={formData.completion_date}
                          onChange={(e) => handleInputChange('completion_date', e.target.value)}
                          className={cn("pl-10", errors.completion_date && "border-destructive")}
                        />
                      </div>
                      {errors.completion_date && (
                        <p className="text-sm text-destructive">{errors.completion_date}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Credits *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.credits_earned}
                      onChange={(e) => handleInputChange('credits_earned', e.target.value)}
                      placeholder="0"
                      className={cn(errors.credits_earned && "border-destructive")}
                    />
                    {errors.credits_earned && (
                      <p className="text-sm text-destructive">{errors.credits_earned}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Notice */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Pending Verification
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      {isPreApproval 
                        ? 'This request will be reviewed by your compliance team before approval.'
                        : 'This course will be marked as "pending verification" until reviewed by your compliance team.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-navy hover:bg-navy/90"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isPreApproval ? 'Request Approval' : 'Submit Course'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Requirements Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">CE Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requirements && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Credits</span>
                        <span>{requirements.total.completed}/{requirements.total.required}</span>
                      </div>
                      <Progress 
                        value={(requirements.total.completed / requirements.total.required) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald" />
                          <span>Ethics</span>
                        </div>
                        <span>{requirements.ethics.completed}/{requirements.ethics.required}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span>Annuity</span>
                        </div>
                        <span>{requirements.annuity.completed}/{requirements.annuity.required}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span>LTC</span>
                        </div>
                        <span>{requirements.ltc.completed}/{requirements.ltc.required}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View State Rules
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Contact Compliance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}