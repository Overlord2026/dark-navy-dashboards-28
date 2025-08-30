import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LinkedinIcon, CheckCircle, Upload, Plus, X, User, Building, Award, MapPin, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GDPRConsentModal } from '@/components/professionals/GDPRConsentModal';

interface LinkedInProfile {
  id: string;
  firstName: { localized: { en_US: string } };
  lastName: { localized: { en_US: string } };
  headline: { localized: { en_US: string } };
  summary: { localized: { en_US: string } };
  profilePicture?: {
    displayImage: {
      elements: Array<{
        identifiers: Array<{ identifier: string }>;
      }>;
    };
  };
  positions?: {
    elements: Array<{
      title: { localized: { en_US: string } };
      companyName: { localized: { en_US: string } };
      description?: { localized: { en_US: string } };
      timePeriod: {
        startDate: { year: number; month: number };
        endDate?: { year: number; month: number };
      };
    }>;
  };
  educations?: {
    elements: Array<{
      schoolName: { localized: { en_US: string } };
      degreeName?: { localized: { en_US: string } };
      fieldOfStudy?: { localized: { en_US: string } };
    }>;
  };
}

const PROFESSIONAL_TYPES = [
  'Financial Advisor',
  'Tax Professional / Accountant', 
  'Estate Planning Attorney',
  'Real Estate Agent / Property Manager',
  'Insurance / LTC Specialist',
  'Mortgage Broker',
  'Auto Insurance Provider',
  'Investment Manager',
  'Family Office Executive',
  'Other Professional'
];

export default function ProOnboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGDPRModal, setShowGDPRModal] = useState(false);
  const [gdprConsented, setGdprConsented] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    profileImage: '',
    
    // Professional Details
    professionalType: '',
    specialties: [] as string[],
    experience: [] as Array<{
      title: string;
      company: string;
      period: string;
      description: string;
    }>,
    education: [] as Array<{
      school: string;
      degree: string;
      field: string;
      year: string;
    }>,
    certifications: [] as string[],
    languages: [] as string[],
    
    // Business Info
    feeStructure: '',
    hourlyRate: '',
    minEngagement: '',
    availability: '',
    acceptingClients: true,
    
    // Contact & Marketing
    linkedinUrl: '',
    termsAccepted: false,
    marketingConsent: false
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    // Check if we have LinkedIn auth code
    const code = searchParams.get('code');
    if (code) {
      handleLinkedInCallback(code);
    }
  }, [searchParams]);

  const handleLinkedInCallback = async (code: string) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      // Call our edge function to exchange code for profile data
      const { data, error } = await supabase.functions.invoke('linkedin-import', {
        body: { 
          code,
          redirectUri: `${window.location.origin}/pro-onboarding`
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to import LinkedIn profile');
      }

      // Check if user already exists by email
      if (data.profile.email) {
        const { data: existingProfiles } = await supabase
          .from('advisor_profiles')
          .select('id, user_id')
          .eq('email', data.profile.email)
          .limit(1);

        if (existingProfiles && existingProfiles.length > 0) {
          setExistingUser(true);
          toast.info('Account found! Redirecting to your dashboard...');
          // Route to appropriate dashboard based on user profile
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
      }

      setLinkedInProfile(data.profile);
      prefillFromLinkedIn(data.profile);
      toast.success('LinkedIn profile imported successfully!');
    } catch (error) {
      console.error('LinkedIn import error:', error);
      setAuthError(error instanceof Error ? error.message : 'Failed to import LinkedIn profile');
      toast.error('Failed to import LinkedIn profile. You can still continue manually.');
    } finally {
      setLoading(false);
    }
  };

  const prefillFromLinkedIn = (profile: any) => {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    
    // Map experience from the structured response
    const experience = profile.experience?.map((exp: any) => ({
      title: exp.title,
      company: exp.company,
      period: `${exp.startDate} - ${exp.endDate}`,
      description: exp.description
    })) || [];

    // Map education from the structured response
    const education = profile.education?.map((edu: any) => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      year: ''
    })) || [];

    // Extract specialties from headline
    const specialties = extractSpecialties(profile.headline);

    setFormData(prev => ({
      ...prev,
      name: fullName,
      title: profile.headline,
      company: experience[0]?.company || '',
      bio: profile.summary,
      email: profile.email,
      profileImage: profile.profilePhotoUrl,
      experience: experience,
      education: education,
      specialties: specialties,
      linkedinUrl: `https://linkedin.com/in/${profile.id}`
    }));
  };

  const formatWorkPeriod = (timePeriod: any) => {
    if (!timePeriod?.startDate) return '';
    const start = `${timePeriod.startDate.month}/${timePeriod.startDate.year}`;
    const end = timePeriod.endDate ? `${timePeriod.endDate.month}/${timePeriod.endDate.year}` : 'Present';
    return `${start} - ${end}`;
  };

  const extractSpecialties = (headline: string): string[] => {
    const commonSpecialties = [
      'Financial Planning', 'Investment Management', 'Tax Planning', 'Estate Planning',
      'Risk Management', 'Retirement Planning', 'Wealth Management', 'Corporate Finance',
      'Real Estate', 'Insurance', 'Legal Advisory', 'Accounting', 'CPA', 'CFP', 'ChFC'
    ];
    
    return commonSpecialties.filter(specialty => 
      headline.toLowerCase().includes(specialty.toLowerCase())
    );
  };

  const handleLinkedInLogin = () => {
    setShowGDPRModal(true);
  };

  const handleGDPRConsent = () => {
    setGdprConsented(true);
    setShowGDPRModal(false);
    initiateLinkedInAuth();
  };

  const initiateLinkedInAuth = () => {
    const clientId = '78c9g8au2ddoil';
    const redirectUri = encodeURIComponent(`${window.location.origin}/pro-onboarding`);
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const state = 'gdpr-consented-' + Math.random().toString(36).substring(7);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.title && formData.email && formData.professionalType);
      case 2:
        return !!(formData.bio && formData.phone && formData.company);
      case 3:
        return formData.termsAccepted;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // Save to advisor_profiles table
      const { error } = await supabase.from('advisor_profiles').insert({
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        expertise_areas: formData.specialties,
        specializations: formData.specialties,
        phone: formData.phone,
        firm_name: formData.company,
        years_experience: parseInt(formData.experience[0]?.period?.match(/\d{4}/)?.[0] || '0') || null,
        is_verified: false,
        is_active: true,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        calendly_url: formData.website
      });

      if (error) throw error;

      toast.success('Profile created successfully!');
      navigate('/professional-onboarding-success');
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-bfo-black p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Professional Onboarding</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our exclusive family office marketplace and connect with high-net-worth clients
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Step {currentStep} of 3</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 && <User className="w-5 h-5" />}
                {currentStep === 2 && <Building className="w-5 h-5" />}
                {currentStep === 3 && <CheckCircle className="w-5 h-5" />}
                {currentStep === 1 && 'Basic Information'}
                {currentStep === 2 && 'Professional Details'}
                {currentStep === 3 && 'Review & Complete'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Basic Information with LinkedIn Import */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* LinkedIn Import Section */}
                  {!linkedInProfile && !existingUser && (
                    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <LinkedinIcon className="w-12 h-12 mx-auto text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-lg">Import from LinkedIn</h3>
                            <p className="text-sm text-muted-foreground">
                              Save time by importing your professional information from LinkedIn
                            </p>
                          </div>
                          <Button 
                            onClick={handleLinkedInLogin}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            <LinkedinIcon className="w-4 h-4 mr-2" />
                            {loading ? 'Importing...' : 'Sign in with LinkedIn'}
                          </Button>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Shield className="w-3 h-3" />
                            GDPR compliant • Secure import
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Auth Error Display */}
                  {authError && (
                    <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-700 dark:text-red-300">
                              LinkedIn Import Failed
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {authError}
                            </p>
                            <p className="text-xs text-red-500 mt-1">
                              You can continue with manual entry below.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Existing User Notice */}
                  {existingUser && (
                    <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
                          <div>
                            <h3 className="font-semibold text-lg text-green-700 dark:text-green-300">
                              Welcome Back!
                            </h3>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              We found your existing professional profile. Redirecting to your dashboard...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* LinkedIn Success indicator */}
                  {linkedInProfile && (
                    <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            LinkedIn profile imported successfully!
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Separator />

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Image */}
                    <div className="space-y-4">
                      <Label>Profile Photo</Label>
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={formData.profileImage} />
                          <AvatarFallback>{formData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {!linkedInProfile && (
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your.email@company.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Senior Financial Advisor, CFP®"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="professionalType">Professional Type *</Label>
                        <Select 
                          value={formData.professionalType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, professionalType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your professional type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROFESSIONAL_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Firm</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Your company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Describe your experience, expertise, and approach to serving clients..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourfirm.com"
                      />
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <Label>Areas of Expertise</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="Add specialty"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                      />
                      <Button type="button" variant="outline" onClick={addSpecialty}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                            {specialty}
                            <button
                              type="button"
                              onClick={() => removeSpecialty(specialty)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <Label>Certifications & Licenses</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add certification (e.g., CFP®, CPA, JD)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <Button type="button" variant="outline" onClick={addCertification}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeCertification(cert)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Work Experience Display */}
                  {formData.experience.length > 0 && (
                    <div className="space-y-2">
                      <Label>Work Experience (from LinkedIn)</Label>
                      <div className="space-y-3">
                        {formData.experience.slice(0, 3).map((exp, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-1">
                              <h4 className="font-medium">{exp.title}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {exp.company} • {exp.period}
                              </p>
                              {exp.description && (
                                <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Display */}
                  {formData.education.length > 0 && (
                    <div className="space-y-2">
                      <Label>Education (from LinkedIn)</Label>
                      <div className="space-y-2">
                        {formData.education.slice(0, 3).map((edu, index) => (
                          <Card key={index} className="p-3">
                            <div className="space-y-1">
                              <h4 className="font-medium">{edu.school}</h4>
                              <p className="text-sm text-muted-foreground">
                                {edu.degree} {edu.field && `in ${edu.field}`}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Complete */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Profile Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Name:</strong> {formData.name}
                      </div>
                      <div>
                        <strong>Title:</strong> {formData.title}
                      </div>
                      <div>
                        <strong>Type:</strong> {formData.professionalType}
                      </div>
                      <div>
                        <strong>Company:</strong> {formData.company}
                      </div>
                      <div className="md:col-span-2">
                        <strong>Specialties:</strong> {formData.specialties.join(', ') || 'None specified'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy, and confirm that all information provided is accurate *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="marketing"
                        checked={formData.marketingConsent}
                        onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                        className="mt-1"
                      />
                      <Label htmlFor="marketing" className="text-sm">
                        I consent to receive marketing communications and updates about the marketplace
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading || !formData.termsAccepted}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Creating Profile...' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* GDPR Consent Modal */}
      <GDPRConsentModal 
        isOpen={showGDPRModal}
        onClose={() => setShowGDPRModal(false)}
        onConsent={handleGDPRConsent}
      />
    </div>
  );
}