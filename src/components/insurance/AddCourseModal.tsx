import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Calendar, GraduationCap, Save, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import type { CECourse } from '@/hooks/useInsuranceAgent';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<CECourse, 'id' | 'agent_id' | 'created_at'>) => Promise<void>;
  isLoading?: boolean;
}

const courseTypes = [
  'Ethics',
  'Annuity',
  'LTC',
  'General',
  'Suitability',
  'Product Training',
  'Compliance',
  'Sales Practices',
  'Other'
];

export function AddCourseModal({ isOpen, onClose, onSubmit, isLoading }: AddCourseModalProps) {
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // In a real app, you'd upload to storage here
      setFormData(prev => ({ 
        ...prev, 
        certificate_url: `certificates/${file.name}` 
      }));
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

    if (!formData.completion_date) {
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
        completion_date: new Date(formData.completion_date),
        credits_earned: parseInt(formData.credits_earned),
        certificate_url: formData.certificate_url || undefined,
        verified: false
      });

      // Reset form
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
      setErrors({});
      onClose();
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
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <GraduationCap className="h-5 w-5 text-emerald" />
            Add CE Course
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
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

          {/* Course Type and Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course_type" className="text-sm font-medium">
                Course Type
              </Label>
              <Select 
                value={formData.course_type} 
                onValueChange={(value) => handleInputChange('course_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course type" />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider_name" className="text-sm font-medium">
                Training Provider
              </Label>
              <Input
                id="provider_name"
                value={formData.provider_name}
                onChange={(e) => handleInputChange('provider_name', e.target.value)}
                placeholder="e.g., National Underwriter, WebCE"
              />
            </div>
          </div>

          {/* Completion Date and Credits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completion_date" className="text-sm font-medium">
                Completion Date *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="completion_date"
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

            <div className="space-y-2">
              <Label htmlFor="credits_earned" className="text-sm font-medium">
                Credits Earned *
              </Label>
              <Input
                id="credits_earned"
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

          {/* Certificate Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Certificate Upload
            </Label>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                isDragActive ? "border-emerald bg-emerald/5" : "border-border hover:border-emerald/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-emerald font-medium">Drop your certificate here...</p>
              ) : uploadedFile ? (
                <div>
                  <p className="text-emerald font-medium">✓ {uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-foreground font-medium">Drag & drop certificate here</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Supports PDF, JPG, PNG files up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-muted-foreground text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-navy hover:bg-navy/90 text-navy-foreground"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Course
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}