import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  Upload,
  Award,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface CoachOnboardingProps {
  onClose: () => void;
}

export function CoachOnboarding({ onClose }: CoachOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      coachingFirm: ''
    },
    qualifications: {
      yearsExperience: '',
      certifications: [] as string[],
      specialties: [] as string[],
      previousCoaching: ''
    },
    preferences: {
      maxAdvisors: '',
      sessionFormat: '',
      availability: [] as string[],
      hourlyRate: ''
    },
    documents: {
      resume: null,
      certificationDocs: null,
      references: null
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const certificationOptions = [
    'CFP (Certified Financial Planner)',
    'CFA (Chartered Financial Analyst)',
    'CIMA (Certified Investment Management Analyst)',
    'ChFC (Chartered Financial Consultant)',
    'CLU (Chartered Life Underwriter)',
    'FRM (Financial Risk Manager)',
    'CRC (Certified Retirement Counselor)',
    'Other Professional Certification'
  ];

  const specialtyOptions = [
    'Prospecting & Lead Generation',
    'Sales Process Optimization',
    'Client Relationship Management',
    'Practice Management',
    'Technology Implementation',
    'Team Building & Leadership',
    'Marketing & Branding',
    'Compliance & Risk Management',
    'Financial Planning Process',
    'Investment Management'
  ];

  const availabilityOptions = [
    'Monday Morning',
    'Monday Afternoon',
    'Tuesday Morning',
    'Tuesday Afternoon',
    'Wednesday Morning',
    'Wednesday Afternoon',
    'Thursday Morning',
    'Thursday Afternoon',
    'Friday Morning',
    'Friday Afternoon',
    'Weekend Sessions'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Coach application submitted:', formData);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                  })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="coachingFirm">Coaching Firm (Optional)</Label>
              <Input
                id="coachingFirm"
                value={formData.personalInfo.coachingFirm}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, coachingFirm: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your coaching background and approach..."
                value={formData.personalInfo.bio}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, bio: e.target.value }
                })}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Years of Coaching Experience</Label>
              <Select
                value={formData.qualifications.yearsExperience}
                onValueChange={(value) => setFormData({
                  ...formData,
                  qualifications: { ...formData.qualifications, yearsExperience: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Professional Certifications</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {certificationOptions.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={formData.qualifications.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            qualifications: {
                              ...formData.qualifications,
                              certifications: [...formData.qualifications.certifications, cert]
                            }
                          });
                        } else {
                          setFormData({
                            ...formData,
                            qualifications: {
                              ...formData.qualifications,
                              certifications: formData.qualifications.certifications.filter(c => c !== cert)
                            }
                          });
                        }
                      }}
                    />
                    <Label htmlFor={cert} className="text-sm">{cert}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Coaching Specialties</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {specialtyOptions.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={formData.qualifications.specialties.includes(specialty)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            qualifications: {
                              ...formData.qualifications,
                              specialties: [...formData.qualifications.specialties, specialty]
                            }
                          });
                        } else {
                          setFormData({
                            ...formData,
                            qualifications: {
                              ...formData.qualifications,
                              specialties: formData.qualifications.specialties.filter(s => s !== specialty)
                            }
                          });
                        }
                      }}
                    />
                    <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="previousCoaching">Previous Coaching Experience</Label>
              <Textarea
                id="previousCoaching"
                placeholder="Describe your previous coaching experience and notable outcomes..."
                value={formData.qualifications.previousCoaching}
                onChange={(e) => setFormData({
                  ...formData,
                  qualifications: { ...formData.qualifications, previousCoaching: e.target.value }
                })}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Maximum Number of Advisors</Label>
              <Select
                value={formData.preferences.maxAdvisors}
                onValueChange={(value) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, maxAdvisors: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 advisors</SelectItem>
                  <SelectItem value="6-10">6-10 advisors</SelectItem>
                  <SelectItem value="11-15">11-15 advisors</SelectItem>
                  <SelectItem value="16-20">16-20 advisors</SelectItem>
                  <SelectItem value="20+">20+ advisors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Session Format</Label>
              <Select
                value={formData.preferences.sessionFormat}
                onValueChange={(value) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, sessionFormat: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Calls</SelectItem>
                  <SelectItem value="phone">Phone Calls</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Multiple formats)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Availability</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availabilityOptions.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={formData.preferences.availability.includes(time)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              availability: [...formData.preferences.availability, time]
                            }
                          });
                        } else {
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              availability: formData.preferences.availability.filter(a => a !== time)
                            }
                          });
                        }
                      }}
                    />
                    <Label htmlFor={time} className="text-sm">{time}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
              <Input
                id="hourlyRate"
                placeholder="$150/hour"
                value={formData.preferences.hourlyRate}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, hourlyRate: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Resume/CV</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Upload your resume or CV (PDF, DOC, DOCX)
                  </p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Certification Documents</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Upload certification documents (PDF format preferred)
                  </p>
                  <Button variant="outline" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Professional References (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Upload reference letters or contact information
                  </p>
                  <Button variant="outline" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Review Process</CardTitle>
                <CardDescription>What happens next</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Application submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Initial review (2-3 business days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Video interview (if selected)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Approval and platform onboarding</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <User className="h-5 w-5" />;
      case 2:
        return <GraduationCap className="h-5 w-5" />;
      case 3:
        return <Calendar className="h-5 w-5" />;
      case 4:
        return <FileText className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Qualifications & Expertise";
      case 3:
        return "Coaching Preferences";
      case 4:
        return "Documentation";
      default:
        return "";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Become a Coach</DialogTitle>
          <DialogDescription>
            Join our network of professional coaches and help advisors grow their practice
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps */}
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                <span className={`text-xs text-center ${
                  step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {getStepTitle(step)}
                </span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStepIcon(currentStep)}
                {getStepTitle(currentStep)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}