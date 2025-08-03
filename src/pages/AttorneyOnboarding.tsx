import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MainLayout } from '@/components/layout/MainLayout';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  GraduationCap,
  Scale,
  DollarSign,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Signature,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building
} from 'lucide-react';

interface AttorneyOnboardingData {
  // Step 1: Profile
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  office_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  firm_name: string;
  firm_website: string;
  attorney_bio: string;
  
  // Step 2: Credentials
  bar_number: string;
  primary_jurisdiction: string;
  jurisdictions_licensed: string[];
  admission_dates: Record<string, string>;
  bar_status: string;
  
  // Step 3: CLE History
  cle_hours_completed: number;
  cle_hours_required: number;
  cle_expiration_date: string;
  cle_compliance_status: string;
  
  // Step 4: Practice Areas
  primary_practice_area: string;
  practice_areas: string[];
  years_experience: number;
  specializations: string[];
  
  // Step 5: Fee Structure
  hourly_rate: number;
  consultation_fee: number;
  billing_method: string;
  retainer_required: boolean;
  typical_retainer_amount: number;
  
  // Step 6: Documents & Agreements
  terms_accepted: boolean;
  nda_signed: boolean;
  participation_agreement_signed: boolean;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  fields: string[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Profile Information',
    description: 'Basic contact and firm details',
    icon: User,
    fields: ['first_name', 'last_name', 'email', 'phone', 'office_address', 'firm_name', 'firm_website', 'attorney_bio']
  },
  {
    id: 2,
    title: 'Bar License & Credentials',
    description: 'Legal credentials and bar admissions',
    icon: Shield,
    fields: ['bar_number', 'primary_jurisdiction', 'jurisdictions_licensed', 'admission_dates', 'bar_status']
  },
  {
    id: 3,
    title: 'CLE History',
    description: 'Continuing Legal Education status',
    icon: GraduationCap,
    fields: ['cle_hours_completed', 'cle_hours_required', 'cle_expiration_date', 'cle_compliance_status']
  },
  {
    id: 4,
    title: 'Practice Areas',
    description: 'Areas of legal expertise',
    icon: Scale,
    fields: ['primary_practice_area', 'practice_areas', 'years_experience', 'specializations']
  },
  {
    id: 5,
    title: 'Fee Structure',
    description: 'Billing rates and methods',
    icon: DollarSign,
    fields: ['hourly_rate', 'consultation_fee', 'billing_method', 'retainer_required', 'typical_retainer_amount']
  },
  {
    id: 6,
    title: 'Documents & Agreements',
    description: 'Upload credentials and sign agreements',
    icon: FileText,
    fields: ['terms_accepted', 'nda_signed', 'participation_agreement_signed']
  }
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
];

const PRACTICE_AREAS = [
  'Estate Planning',
  'Trust & Asset Protection',
  'Business Law',
  'Real Estate Law',
  'Elder Law',
  'Family Law',
  'Tax Law',
  'Probate Law',
  'Corporate Law',
  'Employment Law'
];

export function AttorneyOnboarding() {
  const { userProfile } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  
  const [formData, setFormData] = useState<AttorneyOnboardingData>({
    first_name: '',
    last_name: '',
    email: userProfile?.email || '',
    phone: '',
    office_address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    firm_name: '',
    firm_website: '',
    attorney_bio: '',
    bar_number: '',
    primary_jurisdiction: '',
    jurisdictions_licensed: [],
    admission_dates: {},
    bar_status: 'active',
    cle_hours_completed: 0,
    cle_hours_required: 20,
    cle_expiration_date: '',
    cle_compliance_status: 'pending',
    primary_practice_area: '',
    practice_areas: [],
    years_experience: 0,
    specializations: [],
    hourly_rate: 0,
    consultation_fee: 0,
    billing_method: 'hourly',
    retainer_required: false,
    typical_retainer_amount: 0,
    terms_accepted: false,
    nda_signed: false,
    participation_agreement_signed: false
  });

  // Load existing onboarding data
  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    if (!userProfile?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attorney_onboarding')
        .select('*')
        .eq('user_id', userProfile.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOnboardingId(data.id);
        setCurrentStep(typeof data.current_step === 'string' ? parseInt(data.current_step) || 1 : 1);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || userProfile.email || '',
          phone: data.phone || '',
          office_address: typeof data.office_address === 'string' ? 
            JSON.parse(data.office_address || '{}') : 
            data.office_address || { street: '', city: '', state: '', zip: '' },
          firm_name: data.firm_name || '',
          firm_website: data.firm_website || '',
          attorney_bio: data.attorney_bio || '',
          bar_number: data.bar_number || '',
          primary_jurisdiction: data.primary_jurisdiction || '',
          jurisdictions_licensed: data.jurisdictions_licensed || [],
          admission_dates: {},
          bar_status: data.bar_status || 'active',
          cle_hours_completed: data.cle_hours_completed || 0,
          cle_hours_required: data.cle_hours_required || 20,
          cle_expiration_date: data.cle_expiration_date || '',
          cle_compliance_status: data.cle_compliance_status || 'pending',
          primary_practice_area: data.primary_practice_area || '',
          practice_areas: data.practice_areas || [],
          years_experience: data.years_experience || 0,
          specializations: data.specializations || [],
          hourly_rate: data.hourly_rate || 0,
          consultation_fee: data.consultation_fee || 0,
          billing_method: data.billing_method || 'hourly',
          retainer_required: data.retainer_required || false,
          typical_retainer_amount: data.typical_retainer_amount || 0,
          terms_accepted: data.terms_accepted || false,
          nda_signed: data.nda_signed || false,
          participation_agreement_signed: data.participation_agreement_signed || false
        });
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      toast.error('Failed to load onboarding data');
    } finally {
      setLoading(false);
    }
  };

  const saveStep = async () => {
    if (!userProfile?.id) return;

    setSaving(true);
    try {
      const stepData = {
        user_id: userProfile.id,
        tenant_id: userProfile.tenant_id,
        current_step: currentStep.toString(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        office_address: JSON.stringify(formData.office_address),
        firm_name: formData.firm_name,
        firm_website: formData.firm_website,
        attorney_bio: formData.attorney_bio,
        bar_number: formData.bar_number,
        primary_jurisdiction: formData.primary_jurisdiction,
        jurisdictions_licensed: formData.jurisdictions_licensed,
        admission_dates: formData.admission_dates,
        bar_status: formData.bar_status,
        cle_hours_completed: formData.cle_hours_completed,
        cle_hours_required: formData.cle_hours_required,
        cle_expiration_date: formData.cle_expiration_date,
        cle_compliance_status: formData.cle_compliance_status,
        primary_practice_area: formData.primary_practice_area,
        practice_areas: formData.practice_areas,
        years_experience: formData.years_experience,
        specializations: formData.specializations,
        hourly_rate: formData.hourly_rate,
        consultation_fee: formData.consultation_fee,
        billing_method: formData.billing_method,
        retainer_required: formData.retainer_required,
        typical_retainer_amount: formData.typical_retainer_amount,
        terms_accepted: formData.terms_accepted,
        nda_signed: formData.nda_signed,
        participation_agreement_signed: formData.participation_agreement_signed,
        updated_at: new Date().toISOString()
      };

      if (onboardingId) {
        const { error } = await supabase
          .from('attorney_onboarding')
          .update(stepData)
          .eq('id', onboardingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('attorney_onboarding')
          .insert(stepData)
          .select()
          .single();

        if (error) throw error;
        setOnboardingId(data.id);
      }

      toast.success(`Step ${currentStep} saved successfully`);
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error('Failed to save step');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    await saveStep();
    if (currentStep < ONBOARDING_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = async (fileType: string, file: File) => {
    if (!onboardingId) {
      toast.error('Please save your profile first');
      return;
    }

    try {
      const fileName = `${userProfile?.id}/${fileType}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('attorney-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record
      const { error: docError } = await supabase
        .from('attorney_documents')
        .insert({
          onboarding_id: onboardingId,
          user_id: userProfile?.id,
          document_type: fileType,
          document_name: file.name,
          file_path: fileName,
          file_size: file.size
        });

      if (docError) throw docError;

      setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
      toast.success(`${fileType} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload ${fileType}`);
    }
  };

  const handleSignature = async (agreementType: 'nda' | 'participation_agreement') => {
    if (!onboardingId) return;

    try {
      const updateData = {
        [`${agreementType}_signed`]: true,
        [`${agreementType}_signed_at`]: new Date().toISOString()
      };

      const { error } = await supabase
        .from('attorney_onboarding')
        .update(updateData)
        .eq('id', onboardingId);

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        [`${agreementType}_signed`]: true
      }));

      toast.success(`${agreementType.replace('_', ' ')} signed successfully`);
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error('Failed to sign agreement');
    }
  };

  const completeOnboarding = async () => {
    await saveStep();
    
    try {
      // Mark onboarding as completed
      if (onboardingId) {
        const { error } = await supabase
          .from('attorney_onboarding')
          .update({ 
            status: 'completed', 
            completed_at: new Date().toISOString(),
            current_step: ONBOARDING_STEPS.length.toString()
          })
          .eq('id', onboardingId);

        if (error) throw error;
      }

      setShowCompletionScreen(true);
      toast.success('Onboarding completed successfully!');
      
      // Redirect to attorney dashboard after showing completion screen
      setTimeout(() => {
        navigate('/attorney-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Office Address *</Label>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  placeholder="Street Address"
                  value={formData.office_address.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    office_address: { ...prev.office_address, street: e.target.value }
                  }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={formData.office_address.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      office_address: { ...prev.office_address, city: e.target.value }
                    }))}
                  />
                  <Select
                    value={formData.office_address.state}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      office_address: { ...prev.office_address, state: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="ZIP Code"
                    value={formData.office_address.zip}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      office_address: { ...prev.office_address, zip: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firm_name">Firm Name</Label>
                <Input
                  id="firm_name"
                  value={formData.firm_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, firm_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="firm_website">Firm Website</Label>
                <Input
                  id="firm_website"
                  type="url"
                  placeholder="https://"
                  value={formData.firm_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, firm_website: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="attorney_bio">Attorney Bio</Label>
              <Textarea
                id="attorney_bio"
                placeholder="Brief professional biography..."
                value={formData.attorney_bio}
                onChange={(e) => setFormData(prev => ({ ...prev, attorney_bio: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bar_number">Bar Number *</Label>
                <Input
                  id="bar_number"
                  value={formData.bar_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, bar_number: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="primary_jurisdiction">Primary Jurisdiction *</Label>
                <Select
                  value={formData.primary_jurisdiction}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, primary_jurisdiction: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Additional Jurisdictions Licensed</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                {US_STATES.map(state => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={`jurisdiction-${state}`}
                      checked={formData.jurisdictions_licensed.includes(state)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            jurisdictions_licensed: [...prev.jurisdictions_licensed, state]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            jurisdictions_licensed: prev.jurisdictions_licensed.filter(s => s !== state)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`jurisdiction-${state}`} className="text-sm">{state}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Bar Status</Label>
              <RadioGroup
                value={formData.bar_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, bar_status: value }))}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive">Inactive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suspended" id="suspended" />
                  <Label htmlFor="suspended">Suspended</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cle_hours_completed">CLE Hours Completed</Label>
                <Input
                  id="cle_hours_completed"
                  type="number"
                  min="0"
                  value={formData.cle_hours_completed}
                  onChange={(e) => setFormData(prev => ({ ...prev, cle_hours_completed: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="cle_hours_required">CLE Hours Required</Label>
                <Input
                  id="cle_hours_required"
                  type="number"
                  min="0"
                  value={formData.cle_hours_required}
                  onChange={(e) => setFormData(prev => ({ ...prev, cle_hours_required: parseInt(e.target.value) || 20 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cle_expiration_date">CLE Compliance Expiration Date</Label>
              <Input
                id="cle_expiration_date"
                type="date"
                value={formData.cle_expiration_date}
                onChange={(e) => setFormData(prev => ({ ...prev, cle_expiration_date: e.target.value }))}
              />
            </div>

            <div>
              <Label>CLE Compliance Status</Label>
              <RadioGroup
                value={formData.cle_compliance_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cle_compliance_status: value }))}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compliant" id="compliant" />
                  <Label htmlFor="compliant">Compliant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overdue" id="overdue" />
                  <Label htmlFor="overdue">Overdue</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">CLE Progress</h4>
              <Progress 
                value={(formData.cle_hours_completed / formData.cle_hours_required) * 100} 
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                {formData.cle_hours_completed} of {formData.cle_hours_required} hours completed
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="primary_practice_area">Primary Practice Area *</Label>
              <Select
                value={formData.primary_practice_area}
                onValueChange={(value) => setFormData(prev => ({ ...prev, primary_practice_area: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary practice area" />
                </SelectTrigger>
                <SelectContent>
                  {PRACTICE_AREAS.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Practice Areas</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {PRACTICE_AREAS.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`practice-${area}`}
                      checked={formData.practice_areas.includes(area)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            practice_areas: [...prev.practice_areas, area]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            practice_areas: prev.practice_areas.filter(a => a !== area)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`practice-${area}`} className="text-sm">{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="years_experience">Years of Experience *</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                value={formData.years_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="specializations">Specializations</Label>
              <Textarea
                id="specializations"
                placeholder="List any specific specializations (e.g., High net worth estate planning, Complex trusts, etc.)"
                value={formData.specializations.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  specializations: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.consultation_fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultation_fee: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label>Billing Method</Label>
              <RadioGroup
                value={formData.billing_method}
                onValueChange={(value) => setFormData(prev => ({ ...prev, billing_method: value }))}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <Label htmlFor="hourly">Hourly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat_fee" id="flat_fee" />
                  <Label htmlFor="flat_fee">Flat Fee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="contingency" id="contingency" />
                  <Label htmlFor="contingency">Contingency</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid">Hybrid</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="retainer_required"
                  checked={formData.retainer_required}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, retainer_required: !!checked }))}
                />
                <Label htmlFor="retainer_required">Retainer Required</Label>
              </div>

              {formData.retainer_required && (
                <div>
                  <Label htmlFor="typical_retainer_amount">Typical Retainer Amount ($)</Label>
                  <Input
                    id="typical_retainer_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.typical_retainer_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, typical_retainer_amount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Document Uploads</h3>
              
              {[
                { type: 'bar_license', label: 'Bar License Certificate', required: true },
                { type: 'insurance', label: 'E&O Insurance Certificate', required: true },
                { type: 'resume', label: 'CV/Resume', required: false },
                { type: 'diploma', label: 'Law School Diploma', required: false },
                { type: 'certification', label: 'Additional Certifications', required: false }
              ].map(({ type, label, required }) => (
                <div key={type} className="border border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium">{label} {required && '*'}</Label>
                    {uploadedFiles[type] && (
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(type, file);
                      }}
                      className="flex-1"
                    />
                    {uploadedFiles[type] && (
                      <span className="text-sm text-muted-foreground">
                        {uploadedFiles[type].name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agreements & Signatures</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Signature className="h-5 w-5" />
                    Non-Disclosure Agreement
                  </CardTitle>
                  <CardDescription>
                    Review and sign the platform NDA to protect confidential information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      By signing, you agree to maintain confidentiality of all platform and client information
                    </div>
                    {formData.nda_signed ? (
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Signed
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleSignature('nda')}
                        className="ml-4"
                      >
                        <Signature className="h-4 w-4 mr-1" />
                        Sign NDA
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Signature className="h-5 w-5" />
                    Participation Agreement
                  </CardTitle>
                  <CardDescription>
                    Review and sign the platform participation agreement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Agreement to participate in the attorney network and provide legal services
                    </div>
                    {formData.participation_agreement_signed ? (
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Signed
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleSignature('participation_agreement')}
                        className="ml-4"
                      >
                        <Signature className="h-4 w-4 mr-1" />
                        Sign Agreement
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms_accepted"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms_accepted: !!checked }))}
                />
                <Label htmlFor="terms_accepted" className="text-sm">
                  I accept the platform Terms of Service and Privacy Policy *
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.email && formData.phone;
      case 2:
        return formData.bar_number && formData.primary_jurisdiction;
      case 3:
        return true; // CLE is optional
      case 4:
        return formData.primary_practice_area && formData.years_experience > 0;
      case 5:
        return true; // Fee structure is optional
      case 6:
        return formData.terms_accepted && formData.nda_signed && formData.participation_agreement_signed;
      default:
        return false;
    }
  };

  const progress = (currentStep / ONBOARDING_STEPS.length) * 100;

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex items-center justify-center py-8">
              <Clock className="h-8 w-8 animate-spin mr-2" />
              Loading onboarding...
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (showCompletionScreen) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-green-800 mb-4">
                Welcome to your Attorney Dashboard!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Congratulations! Your attorney onboarding is complete. You now have access to:
              </p>
              <div className="text-left max-w-md mx-auto space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Case management tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>CLE tracking system</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Client collaboration portal</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Document management</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to your dashboard in a few seconds...
              </p>
              <Button 
                onClick={() => navigate('/attorney-dashboard')} 
                className="mt-4"
              >
                Go to Dashboard Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attorney Onboarding</h1>
          <p className="text-muted-foreground">
            Complete your profile to join our attorney network
          </p>
          
          <div className="mt-6">
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {ONBOARDING_STEPS.length} - {Math.round(progress)}% complete
            </p>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_STEPS.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isCompleted
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : isCurrent
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="hidden md:inline">{step.title}</span>
                  <span className="md:hidden">{step.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(ONBOARDING_STEPS[currentStep - 1].icon, { className: "h-5 w-5" })}
              {ONBOARDING_STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {ONBOARDING_STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={saveStep}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Progress'}
            </Button>

            {currentStep < ONBOARDING_STEPS.length ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed() || saving}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                disabled={!canProceed() || saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete Onboarding
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}