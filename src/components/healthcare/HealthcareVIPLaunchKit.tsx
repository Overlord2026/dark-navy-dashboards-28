import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart,
  Stethoscope,
  Shield,
  Award,
  Upload,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  FileText,
  Star,
  DollarSign,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle
} from 'lucide-react';

interface HealthcareProfile {
  name: string;
  title: string;
  specialties: string[];
  credentials: string[];
  bio: string;
  consultationRate: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  yearsExperience: number;
  languages: string[];
}

export const HealthcareVIPLaunchKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<HealthcareProfile>({
    name: '',
    title: '',
    specialties: [],
    credentials: [],
    bio: '',
    consultationRate: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    yearsExperience: 0,
    languages: []
  });

  const healthcareSpecialties = [
    'Longevity Medicine',
    'Precision Medicine', 
    'Functional Medicine',
    'Preventive Care',
    'Anti-Aging',
    'Wellness Coaching',
    'Integrative Medicine',
    'Regenerative Medicine',
    'Nutritional Medicine',
    'Hormone Optimization',
    'Sleep Medicine',
    'Stress Management',
    'Biohacking',
    'Executive Health'
  ];

  const credentialTypes = [
    'MD - Doctor of Medicine',
    'DO - Doctor of Osteopathic Medicine', 
    'NP - Nurse Practitioner',
    'PA - Physician Assistant',
    'RD - Registered Dietitian',
    'PhD - Doctor of Philosophy',
    'DC - Doctor of Chiropractic',
    'LAc - Licensed Acupuncturist',
    'ABAAHP - Anti-Aging & Regenerative Medicine',
    'IFM - Institute for Functional Medicine',
    'A4M - American Academy of Anti-Aging Medicine',
    'Board Certified Internal Medicine',
    'Board Certified Family Medicine',
    'Certified Health Coach'
  ];

  const toggleSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleCredential = (credential: string) => {
    setProfile(prev => ({
      ...prev,
      credentials: prev.credentials.includes(credential)
        ? prev.credentials.filter(c => c !== credential)
        : [...prev.credentials, credential]
    }));
  };

  const sendHealthcareInvitation = async () => {
    // Implementation for sending healthcare invitations
    console.log('Sending healthcare invitation...');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Healthcare VIP Launch Kit</h1>
          <p className="text-muted-foreground">
            Complete onboarding and management system for healthcare partners
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Profile Setup
          </TabsTrigger>
          <TabsTrigger value="credentials" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Referral System
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Training Manual
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Tools
          </TabsTrigger>
        </TabsList>

        {/* Profile Setup Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Healthcare Professional Profile
              </CardTitle>
              <CardDescription>
                Set up your professional profile and credentials for VIP healthcare directory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Longevity Medicine Specialist"
                    />
                  </div>
                  <div>
                    <Label htmlFor="years">Years of Experience</Label>
                    <Input
                      id="years"
                      type="number"
                      value={profile.yearsExperience}
                      onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                      placeholder="15"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rate">Consultation Rate</Label>
                    <Input
                      id="rate"
                      value={profile.consultationRate}
                      onChange={(e) => setProfile(prev => ({ ...prev, consultationRate: e.target.value }))}
                      placeholder="$500/hour or $2,500/package"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="New York, NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://drlongevity.com"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Dr. Smith is a leading expert in longevity medicine with over 15 years of experience helping high-net-worth individuals optimize their health and extend their healthspan..."
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Healthcare Specialties</Label>
                <p className="text-sm text-muted-foreground mb-3">Select your areas of expertise</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {healthcareSpecialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={profile.specialties.includes(specialty) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSpecialty(specialty)}
                      className="justify-start"
                    >
                      {profile.specialties.includes(specialty) && <CheckCircle className="h-4 w-4 mr-2" />}
                      {specialty}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Credentials & Certifications
              </CardTitle>
              <CardDescription>
                Add your medical degrees, certifications, and professional credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Medical Degrees & Certifications</Label>
                <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {credentialTypes.map((credential) => (
                    <Button
                      key={credential}
                      variant={profile.credentials.includes(credential) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCredential(credential)}
                      className="justify-start h-auto p-3"
                    >
                      {profile.credentials.includes(credential) && <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />}
                      <span className="text-left">{credential}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Document Upload</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload verification documents for your credentials (optional but recommended for VIP badge)
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Credential Documents
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Healthcare Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Healthcare Consultant Dashboard
              </CardTitle>
              <CardDescription>
                HIPAA-compliant dashboard for managing consultations and client relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">Appointment Management</h4>
                        <p className="text-sm text-green-700">Schedule and manage consultations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Secure Messaging</h4>
                        <p className="text-sm text-blue-700">HIPAA-compliant client communication</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-purple-800">Document Vault</h4>
                        <p className="text-sm text-purple-700">Encrypted health records storage</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Smith Family Health Review</p>
                          <p className="text-sm text-muted-foreground">March 15, 2024</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Executive Wellness Assessment</p>
                          <p className="text-sm text-muted-foreground">March 18, 2024</p>
                        </div>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Consultations</span>
                        <span className="font-bold text-primary">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Client Satisfaction</span>
                        <span className="font-bold text-primary">98%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Referrals Generated</span>
                        <span className="font-bold text-primary">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Credits Earned</span>
                        <span className="font-bold text-primary">1,240</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referral System Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Healthcare Professional Referral Network
              </CardTitle>
              <CardDescription>
                Invite other healthcare professionals and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Healthcare Professional</h4>
                    <p className="text-sm text-muted-foreground mb-2">Individual practitioners</p>
                    <Badge>+50 Credits</Badge>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Medical Clinic</h4>
                    <p className="text-sm text-muted-foreground mb-2">Private practice groups</p>
                    <Badge>+100 Credits</Badge>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Specialty Center</h4>
                    <p className="text-sm text-muted-foreground mb-2">Wellness centers & clinics</p>
                    <Badge>+200 Credits</Badge>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Send Healthcare Invitations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Healthcare Professional Email</Label>
                      <Input id="email" placeholder="doctor@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Specialty Area</Label>
                      <Input id="specialty" placeholder="Longevity Medicine" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Hi [Name], I think you'd be a great fit for the Boutique Family Office healthcare network..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={sendHealthcareInvitation} className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Healthcare VIP Invitation
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Manual Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Healthcare Partner Training Manual
              </CardTitle>
              <CardDescription>
                Complete guide for healthcare professionals on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Getting Started</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">1. Dashboard & Profile setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">2. Credentials and consultation rate upload</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">3. Appointment, message, and document workflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">4. Bulk client and clinic referral tools</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Advanced Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">5. VIP badge and leaderboard navigation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">6. Security/compliance best practices</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">7. Earning credits and tracking rewards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">8. Support system for healthcare partners</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">HIPAA Compliance & Security</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All health information is encrypted end-to-end</li>
                    <li>• Platform is SOC 2 Type II certified</li>
                    <li>• Audit trails for all data access and modifications</li>
                    <li>• Secure messaging with healthcare-grade encryption</li>
                    <li>• Document vault with access controls and versioning</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Linda AI Assistant - Important Notice</h4>
                  <p className="text-sm text-yellow-700">
                    Linda AI provides workflow guidance and platform navigation support only. 
                    <strong> Linda never provides medical advice, diagnoses, or treatment recommendations.</strong> 
                    All medical decisions must be made by licensed healthcare professionals.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tools Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Healthcare Partner Admin Tools
              </CardTitle>
              <CardDescription>
                Administrative tools for managing healthcare professional onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Add professional to "VIP Wellness Wall"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Assign Founding Partner badge & magic invite link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Email/LinkedIn/SMS invitations sent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Verify credentials, setup rates, publish profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Activate appointment, document, and messaging flows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Enable bulk referral tools and leaderboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Monitor client feedback and engagement</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Assign VIP Healthcare Badge
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Welcome Email
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Training Materials
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Performance Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Healthcare Professional Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Dr. Sarah Johnson</p>
                          <p className="text-sm text-muted-foreground">Longevity Medicine</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>VIP Partner</Badge>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Dr. Michael Chen</p>
                          <p className="text-sm text-muted-foreground">Functional Medicine</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Pending</Badge>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};