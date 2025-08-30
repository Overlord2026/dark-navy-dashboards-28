import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkedinIcon, CheckCircle, Edit, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

export default function LinkedInImport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    specialties: [] as string[],
    email: '',
    phone: '',
    linkedInUrl: ''
  });

  useEffect(() => {
    // Check if we have LinkedIn auth code
    const code = searchParams.get('code');
    if (code) {
      handleLinkedInCallback(code);
    }
  }, [searchParams]);

  const handleLinkedInCallback = async (code: string) => {
    setLoading(true);
    try {
      // Call our edge function to exchange code for profile data
      const { data, error } = await supabase.functions.invoke('linkedin-import', {
        body: { code }
      });

      if (error) throw error;

      setLinkedInProfile(data.profile);
      
      // Pre-fill form with LinkedIn data
      const profile = data.profile;
      setFormData({
        name: `${profile.firstName.localized.en_US} ${profile.lastName.localized.en_US}`,
        title: profile.headline?.localized?.en_US || '',
        company: profile.positions?.elements?.[0]?.companyName?.localized?.en_US || '',
        bio: profile.summary?.localized?.en_US || '',
        specialties: extractSpecialties(profile.headline?.localized?.en_US || ''),
        email: data.email || '',
        phone: '',
        linkedInUrl: `https://linkedin.com/in/${profile.id}`
      });

      toast.success('LinkedIn profile imported successfully!');
    } catch (error) {
      console.error('LinkedIn import error:', error);
      toast.error('Failed to import LinkedIn profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
    const clientId = '78c9g8au2ddoil'; // LinkedIn app client ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/linkedin-import`);
    const scope = encodeURIComponent('r_liteprofile r_emailaddress');
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  };

  const handlePublishProfile = async () => {
    setLoading(true);
    try {
      // Save professional profile to database
      const { error } = await supabase.from('linkedin_professionals').insert({
        name: formData.name,
        title: formData.title,
        company: formData.company,
        bio: formData.bio,
        specialties: formData.specialties,
        email: formData.email,
        phone: formData.phone,
        linkedin_url: formData.linkedInUrl,
        linkedin_id: linkedInProfile.id,
        profile_image_url: linkedInProfile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
        profile_source: 'linkedin_import',
        status: 'active',
        featured: true, // Give LinkedIn imports featured status initially
        referral_code: 'PROF' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        referred_by: searchParams.get('ref')
      });

      if (error) throw error;

      toast.success('Profile published successfully!');
      navigate('/professional-onboarding-success');
    } catch (error) {
      console.error('Profile publishing error:', error);
      toast.error('Failed to publish profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !linkedInProfile) {
    return (
      <div className="min-h-screen bg-bfo-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <LinkedinIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Importing Your LinkedIn Profile...</h2>
            <p className="text-muted-foreground">This will only take a moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!linkedInProfile) {
    return (
      <div className="min-h-screen bg-bfo-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card>
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                <LinkedinIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Welcome to the Family Office Marketplace</CardTitle>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Join the exclusive network of top-tier financial professionals. 
                Import your LinkedIn profile for instant onboarding.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  What we'll import from LinkedIn:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Professional photo and basic info</li>
                  <li>• Current position and company</li>
                  <li>• Professional summary and experience</li>
                  <li>• Education and certifications</li>
                  <li>• Contact information (with your permission)</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Privacy & Compliance</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  SOC2 compliant • GDPR compliant • You maintain full control over your data
                </p>
              </div>

              <Button 
                onClick={handleLinkedInLogin}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                <LinkedinIcon className="w-5 h-5 mr-2" />
                Import LinkedIn Profile
              </Button>

              <div className="text-center">
                <Button variant="link" onClick={() => navigate('/professional-signup')}>
                  Prefer manual signup? Click here
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bfo-black p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Progress indicator */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Review Your Profile</h1>
            <p className="text-muted-foreground">Step 2 of 2: Review and publish your professional profile</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full w-full"></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  LinkedIn Profile Imported
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editing ? 'Done Editing' : 'Edit Details'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Preview */}
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={linkedInProfile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier} />
                  <AvatarFallback>{formData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-3">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Full Name"
                      />
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Professional Title"
                      />
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Company"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold">{formData.name}</h2>
                      <p className="text-lg text-muted-foreground">{formData.title}</p>
                      <p className="text-muted-foreground">{formData.company}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Bio Section */}
              <div>
                <h3 className="font-semibold mb-2">Professional Summary</h3>
                {editing ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Professional bio and summary"
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{formData.bio}</p>
                )}
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              {editing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Professional email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePublishProfile}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Publishing...' : 'Publish My Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}