import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Upload, Check, AlertCircle, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ONBOARDING_STEPS = [
  { id: 1, title: "Account Setup", description: "Create your account and verify email" },
  { id: 2, title: "Professional Profile", description: "Complete your professional information" },
  { id: 3, title: "Compliance Documents", description: "Upload required credentials and licenses" },
  { id: 4, title: "Availability & Preferences", description: "Set your availability and communication preferences" },
  { id: 5, title: "Review & Submit", description: "Review your profile and submit for approval" }
];

const COMPLIANCE_DOCUMENTS = [
  { id: "professional_license", name: "Professional License", required: true },
  { id: "eo_insurance", name: "E&O Insurance", required: true },
  { id: "state_bar", name: "State Bar Admission", required: false },
  { id: "finra_registration", name: "FINRA Registration", required: false },
  { id: "background_check", name: "Background Check", required: false }
];

const FEE_MODELS = [
  "Hourly Rate",
  "Fixed Fee",
  "Retainer",
  "Commission",
  "Asset-Based",
  "Hybrid"
];

export default function ProfessionalOnboarding() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1 - Account
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 2 - Profile
    name: "",
    firm: "",
    bio: "",
    phone: "",
    website: "",
    location: "",
    specialties: [] as string[],
    languages: [] as string[],
    
    // Step 3 - Compliance
    complianceDocs: {} as Record<string, File>,
    
    // Step 4 - Availability
    acceptingClients: true,
    feeModel: "",
    hourlyRate: "",
    minEngagement: "",
    communicationPrefs: [] as string[],
    availability: "",
    
    // Step 5 - Terms
    termsAccepted: false,
    marketingConsent: false
  });

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_invitations')
        .select('*')
        .eq('invite_token', token)
        .eq('status', 'sent')
        .single();

      if (error || !data) {
        toast.error("Invalid or expired invitation link");
        navigate('/');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        toast.error("This invitation has expired");
        navigate('/');
        return;
      }

      setInvitation(data);
      setFormData(prev => ({
        ...prev,
        email: data.email,
        name: "",
        firm: "",
        specialties: []
      }));
    } catch (error) {
      console.error('Error fetching invitation:', error);
      toast.error("Failed to load invitation");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleFileUpload = (docType: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      complianceDocs: { ...prev.complianceDocs, [docType]: file }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.password === formData.confirmPassword);
      case 2:
        return !!(formData.name && formData.firm && formData.bio && formData.phone);
      case 3:
        const requiredDocs = COMPLIANCE_DOCUMENTS.filter(doc => doc.required);
        return requiredDocs.every(doc => formData.complianceDocs[doc.id]);
      case 4:
        return !!(formData.feeModel);
      case 5:
        return formData.termsAccepted;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Please complete all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setSubmitting(true);
    try {
      // Create professional account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/professional-onboarding/complete`
        }
      });

      if (authError) throw authError;

      // Create professional profile
      const { error: profileError } = await supabase
        .from('professionals')
        .insert({
          user_id: authData.user?.id,
          tenant_id: invitation.tenant_id,
          name: formData.name,
          email: formData.email,
          firm: formData.firm,
          bio: formData.bio,
          phone: formData.phone,
          website: formData.website,
          location: formData.location,
          specialties: formData.specialties,
          languages: formData.languages,
          accepting_new_clients: formData.acceptingClients,
          fee_model: formData.feeModel,
          status: 'pending' // Requires admin approval
        });

      if (profileError) throw profileError;

      // Update invitation status
      await supabase
        .from('professional_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      toast.success("Application submitted successfully! You'll receive an email once approved.");
      navigate('/professional-onboarding/pending');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Professional Marketplace Onboarding</h1>
          <p className="text-muted-foreground mt-2">
            Complete your profile to join our boutique family office marketplace
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Step {currentStep} of 5</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {ONBOARDING_STEPS.map((step) => (
              <div
                key={step.id}
                className={`text-xs text-center flex-1 ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs ${
                  step.id < currentStep ? 'bg-primary text-primary-foreground' :
                  step.id === currentStep ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <div className="hidden sm:block">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{ONBOARDING_STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{ONBOARDING_STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Account Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Create a secure password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Passwords do not match
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Professional Profile */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firm">Firm/Company *</Label>
                    <Input
                      id="firm"
                      value={formData.firm}
                      onChange={(e) => handleChange("firm", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Describe your experience, expertise, and approach..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://yourfirm.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <Label>Specialties</Label>
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

                {/* Languages */}
                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    />
                    <Button type="button" variant="outline" onClick={addLanguage}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((language) => (
                        <Badge key={language} variant="secondary" className="flex items-center gap-1">
                          {language}
                          <button
                            type="button"
                            onClick={() => removeLanguage(language)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Compliance Documents */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Upload the required compliance documents. All files should be in PDF format and under 10MB each.
                  </p>
                </div>
                
                {COMPLIANCE_DOCUMENTS.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">{doc.name}</Label>
                        {doc.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                      {formData.complianceDocs[doc.id] && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(doc.id, file);
                        }}
                        className="flex-1"
                      />
                      {formData.complianceDocs[doc.id] && (
                        <span className="text-sm text-muted-foreground">
                          {formData.complianceDocs[doc.id].name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Availability & Preferences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptingClients"
                    checked={formData.acceptingClients}
                    onCheckedChange={(checked) => handleChange("acceptingClients", checked)}
                  />
                  <Label htmlFor="acceptingClients">Currently accepting new clients</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feeModel">Fee Model *</Label>
                    <Select value={formData.feeModel} onValueChange={(value) => handleChange("feeModel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee model" />
                      </SelectTrigger>
                      <SelectContent>
                        {FEE_MODELS.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Rate/Fee Range</Label>
                    <Input
                      id="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={(e) => handleChange("hourlyRate", e.target.value)}
                      placeholder="$200-400/hour or $5,000-10,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minEngagement">Minimum Engagement</Label>
                  <Input
                    id="minEngagement"
                    value={formData.minEngagement}
                    onChange={(e) => handleChange("minEngagement", e.target.value)}
                    placeholder="e.g., $5,000 minimum, 3-month minimum"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability Notes</Label>
                  <Textarea
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleChange("availability", e.target.value)}
                    placeholder="Describe your availability, response times, and scheduling preferences..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Application Summary</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Firm:</strong> {formData.firm}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Specialties:</strong> {formData.specialties.join(", ")}</p>
                    <p><strong>Fee Model:</strong> {formData.feeModel}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleChange("termsAccepted", checked)}
                    />
                    <Label htmlFor="termsAccepted">
                      I agree to the Terms of Service and Professional Code of Conduct *
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketingConsent"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => handleChange("marketingConsent", checked)}
                    />
                    <Label htmlFor="marketingConsent">
                      I consent to receive marketing communications
                    </Label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Your application will be reviewed by our team. You'll receive an email notification once approved.
                    This process typically takes 1-3 business days.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!validateStep(5) || submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}