import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualProfileFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const ManualProfileForm: React.FC<ManualProfileFormProps> = ({ onSubmit, isLoading = false }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    company: '',
    specialty: '',
    bio: '',
    credentials: [] as string[],
    experience: ''
  });

  const [newCredential, setNewCredential] = useState('');

  const specialties = [
    'Financial Advisor',
    'Estate Planning Attorney',
    'Tax Attorney',
    'CPA',
    'Investment Consultant',
    'Family Office Executive',
    'Wealth Manager',
    'Trust Officer',
    'Insurance Specialist',
    'Business Consultant'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCredential = () => {
    if (newCredential.trim()) {
      setFormData(prev => ({
        ...prev,
        credentials: [...prev.credentials, newCredential.trim()]
      }));
      setNewCredential('');
    }
  };

  const removeCredential = (index: number) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Professional Profile</CardTitle>
          <p className="text-muted-foreground text-center">
            Tell us about yourself to join the Family Office Marketplace
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Senior Financial Advisor"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Firm</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="e.g., ABC Wealth Management"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialty">Primary Specialty</Label>
              <Select onValueChange={(value) => handleInputChange('specialty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Select onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16-20">16-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Credentials */}
            <div>
              <Label>Professional Credentials (Optional)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCredential}
                  onChange={(e) => setNewCredential(e.target.value)}
                  placeholder="e.g., CFP, CPA, JD"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCredential())}
                />
                <Button type="button" onClick={addCredential} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.credentials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.credentials.map((credential, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {credential}
                      <button
                        type="button"
                        onClick={() => removeCredential(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about your expertise, approach, and what makes you unique..."
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Profile...' : 'Create Professional Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManualProfileForm;