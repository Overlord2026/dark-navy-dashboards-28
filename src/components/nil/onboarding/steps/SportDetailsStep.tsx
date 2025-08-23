import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Instagram, Twitter, Youtube } from 'lucide-react';

interface SportDetailsStepProps {
  onComplete: (data: any) => void;
  isLoading: boolean;
}

const SPORTS = [
  'Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Golf', 
  'Swimming', 'Track & Field', 'Wrestling', 'Volleyball', 'Softball',
  'Hockey', 'Lacrosse', 'Cross Country', 'Gymnastics', 'Other'
];

const SCHOOL_YEARS = [
  'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student'
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: '@username' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, placeholder: '@username' },
  { id: 'tiktok', name: 'TikTok', icon: Twitter, placeholder: '@username' }, // Using Twitter icon as fallback
  { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'Channel Name' }
];

export function SportDetailsStep({ onComplete, isLoading }: SportDetailsStepProps) {
  const [formData, setFormData] = useState({
    sport: '',
    otherSport: '',
    school: '',
    year: '',
    nilDeals: 0,
    socialHandles: {} as Record<string, string>,
    achievements: [] as string[]
  });

  const [newAchievement, setNewAchievement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSport = formData.sport === 'Other' ? formData.otherSport : formData.sport;
    if (finalSport && formData.school && formData.year) {
      onComplete({
        ...formData,
        sport: finalSport
      });
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const updateSocialHandle = (platform: string, handle: string) => {
    setFormData(prev => ({
      ...prev,
      socialHandles: {
        ...prev.socialHandles,
        [platform]: handle
      }
    }));
  };

  const isValid = formData.sport && formData.school && formData.year;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sport & School Info */}
        <Card>
          <CardHeader>
            <CardTitle>Athletic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport *</Label>
                <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map(sport => (
                      <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.sport === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="otherSport">Specify Sport *</Label>
                  <Input
                    id="otherSport"
                    value={formData.otherSport}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherSport: e.target.value }))}
                    placeholder="Enter your sport"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="school">School/University *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  placeholder="Enter your school name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_YEARS.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nilDeals">Number of Current NIL Deals</Label>
              <Input
                id="nilDeals"
                type="number"
                min="0"
                value={formData.nilDeals}
                onChange={(e) => setFormData(prev => ({ ...prev, nilDeals: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
              <p className="text-sm text-muted-foreground">
                This helps us understand your current NIL activity
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Handles */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Handles</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add your social media accounts to help brands find and connect with you
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOCIAL_PLATFORMS.map(platform => {
              const IconComponent = platform.icon;
              return (
                <div key={platform.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-24">
                    <IconComponent className="h-5 w-5" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <Input
                    value={formData.socialHandles[platform.id] || ''}
                    onChange={(e) => updateSocialHandle(platform.id, e.target.value)}
                    placeholder={platform.placeholder}
                    className="flex-1"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Athletic Achievements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add any notable achievements, awards, or records (optional)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="e.g., All-Conference Team 2024"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.achievements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.achievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {achievement}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="min-w-32"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}