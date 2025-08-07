import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Trophy, 
  Users, 
  Shield, 
  Star, 
  ArrowRight, 
  UserPlus,
  GraduationCap,
  Heart,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type UserRole = 'athlete' | 'parent' | 'coach' | 'advisor';

const NILOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    sport: '',
    inviteEmail: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const navigate = useNavigate();

  const roles = [
    {
      id: 'athlete' as UserRole,
      title: 'Student Athlete',
      description: 'I\'m a current or future college athlete interested in NIL opportunities',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'parent' as UserRole,
      title: 'Parent/Guardian',
      description: 'I\'m supporting my student athlete\'s NIL journey and education',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'coach' as UserRole,
      title: 'Coach/Athletic Director',
      description: 'I\'m helping guide athletes through NIL compliance and opportunities',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'advisor' as UserRole,
      title: 'Financial Advisor',
      description: 'I\'m providing financial guidance for NIL income and planning',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your personal information is protected and never shared without permission'
    },
    {
      icon: Star,
      title: 'Expert Education',
      description: 'Learn from industry professionals and successful athletes'
    },
    {
      icon: Users,
      title: 'Supportive Community',
      description: 'Connect with peers, mentors, and trusted advisors'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Focused',
      description: 'Stay within NCAA and state regulations with confidence'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    // Track analytics for NIL onboarding completion
    console.log('NIL Onboarding completed:', { role: selectedRole, ...formData });
    navigate('/athletes/nil-education');
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Welcome to NIL Smart Money</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your role to get started with personalized NIL education and resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${role.borderColor} ${role.bgColor}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${role.bgColor} ${role.color}`}>
                    <role.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{role.title}</h3>
                    <p className="text-muted-foreground text-sm">{role.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Benefits</h2>
        <p className="text-muted-foreground">
          Here's what you'll get with NIL Smart Money education platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" onClick={handleNext}>
          Continue Setup
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Invite Your Team</h2>
        <p className="text-muted-foreground">
          Invite your coach, parent, or advisor to join your NIL journey (optional)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referral & Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inviteEmail">Email Address</Label>
            <Input
              id="inviteEmail"
              placeholder="coach@university.edu"
              value={formData.inviteEmail}
              onChange={(e) => setFormData({ ...formData, inviteEmail: e.target.value })}
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Bonus Rewards</span>
            </div>
            <p className="text-xs text-blue-700">
              Both you and your invitee will unlock exclusive content and progress tracking features.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Skip</Button>
            <Button className="flex-1" onClick={handleNext}>
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Privacy & Consent</h2>
        <p className="text-muted-foreground">
          Review our privacy practices and give consent to begin
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">No Personal Info Required</h3>
            <p className="text-sm text-green-700">
              You can access most content without providing personal information. 
              We only collect data when you choose to engage with advisors or request personalized services.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the Terms of Service and understand this is educational content only
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="privacy"
                checked={formData.agreeToPrivacy}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToPrivacy: checked as boolean })}
              />
              <Label htmlFor="privacy" className="text-sm">
                I understand the Privacy Policy and consent to anonymous usage analytics
              </Label>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!formData.agreeToTerms || !formData.agreeToPrivacy}
            onClick={handleComplete}
          >
            Access NIL Education Dashboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Role Badge */}
        {selectedRole && (
          <div className="text-center mb-6">
            <Badge variant="outline" className="text-sm">
              {roles.find(r => r.id === selectedRole)?.title}
            </Badge>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Back Button */}
        {currentStep > 1 && (
          <div className="text-center mt-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NILOnboarding;