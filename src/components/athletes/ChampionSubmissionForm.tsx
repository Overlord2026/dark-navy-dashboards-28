import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Video, FileText, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubmissionFormData {
  championName: string;
  sport: string;
  achievements: string;
  contactEmail: string;
  submissionType: 'video' | 'text' | 'both';
  tipText?: string;
  videoFile?: File;
  preferredCharity: string;
  allowSharing: boolean;
  joinAMA: boolean;
}

export const ChampionSubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState<SubmissionFormData>({
    championName: '',
    sport: '',
    achievements: '',
    contactEmail: '',
    submissionType: 'video',
    preferredCharity: '',
    allowSharing: false,
    joinAMA: false
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, videoFile: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Submission received! We\'ll be in touch within 24 hours.');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Star className="h-8 w-8 text-gold" />
          <h1 className="text-3xl font-bold">Champion Contribution Portal</h1>
          <Star className="h-8 w-8 text-gold" />
        </div>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share your wisdom with the next generation of athletes. Your message could change a life.
        </p>
      </motion.div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit Your Champion Message
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="championName">Champion Name *</Label>
                <Input
                  id="championName"
                  value={formData.championName}
                  onChange={(e) => setFormData(prev => ({ ...prev, championName: e.target.value }))}
                  placeholder="e.g., Michael Jordan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sport">Sport/Field *</Label>
                <Input
                  id="sport"
                  value={formData.sport}
                  onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                  placeholder="e.g., Basketball"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Key Achievements *</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                placeholder="e.g., 6x NBA Champion, Hall of Fame, Olympic Gold Medalist"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="champion@example.com"
                required
              />
            </div>

            {/* Submission Type */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">How would you like to contribute? *</Label>
              <RadioGroup
                value={formData.submissionType}
                onValueChange={(value: 'video' | 'text' | 'both') => 
                  setFormData(prev => ({ ...prev, submissionType: value }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Message (1-3 minutes)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Written Tip/Quote
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Both Video & Written
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Video Upload */}
            {(formData.submissionType === 'video' || formData.submissionType === 'both') && (
              <div className="space-y-2">
                <Label>Upload Video Message</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  {formData.videoFile ? (
                    <div>
                      <p className="font-medium">{formData.videoFile.name}</p>
                      <p className="text-sm text-muted-foreground">Ready to upload</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg mb-2">Drag & drop your video here</p>
                      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                      <Button type="button" variant="outline">
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Text Tip */}
            {(formData.submissionType === 'text' || formData.submissionType === 'both') && (
              <div className="space-y-2">
                <Label htmlFor="tipText">Your Wisdom/Tip for Young Athletes</Label>
                <Textarea
                  id="tipText"
                  value={formData.tipText || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipText: e.target.value }))}
                  placeholder="Share your most important advice for young athletes starting their journey..."
                  rows={4}
                />
              </div>
            )}

            {/* Charity Selection */}
            <div className="space-y-2">
              <Label htmlFor="preferredCharity" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Preferred Charity (optional)
              </Label>
              <Input
                id="preferredCharity"
                value={formData.preferredCharity}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredCharity: e.target.value }))}
                placeholder="e.g., Boys & Girls Club, your foundation"
              />
              <p className="text-sm text-muted-foreground">
                We'll make a donation in your honor for every athlete who engages with your message.
              </p>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowSharing"
                  checked={formData.allowSharing}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, allowSharing: checked as boolean }))
                  }
                />
                <Label htmlFor="allowSharing" className="text-sm">
                  I give permission to share my message on the Hall of Champions and social media
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="joinAMA"
                  checked={formData.joinAMA}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, joinAMA: checked as boolean }))
                  }
                />
                <Label htmlFor="joinAMA" className="text-sm">
                  I'm interested in joining a live Q&A session with athletes
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Submit Champion Message
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                We'll review your submission and reach out within 24 hours.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="bg-gradient-to-r from-gold/5 to-emerald/5">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gold">10,000+</div>
              <div className="text-sm text-muted-foreground">Athletes Reached</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-500">$5,000</div>
              <div className="text-sm text-muted-foreground">Charity Donation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">∞</div>
              <div className="text-sm text-muted-foreground">Lives Changed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};