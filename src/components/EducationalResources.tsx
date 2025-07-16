import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, BookOpen, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Guide {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const guides: Guide[] = [
  {
    title: "How the Endowment Model Can Grow Your Wealth",
    description: "Discover David Swensen's approach to diversified investing and how it can work for your family.",
    icon: <BookOpen className="h-6 w-6 text-primary" />
  },
  {
    title: "Smart Tax Planning for Retirees",
    description: "Comprehensive strategies to minimize your tax burden in retirement and maximize your income.",
    icon: <BookOpen className="h-6 w-6 text-primary" />
  },
  {
    title: "Holistic Retirement Income Workbook",
    description: "A complete guide to building sustainable retirement income from all your assets.",
    icon: <BookOpen className="h-6 w-6 text-primary" />
  }
];

export function EducationalResources() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = async (guideTitle: string) => {
    if (!email) {
      toast.error('Please enter your email address to download the guide');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate email submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Guide "${guideTitle}" will be sent to ${email}`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Free Wealth Guides for Modern Families
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get our expert resources—complimentary for all visitors
        </p>
      </div>

      {/* Email Input */}
      <div className="max-w-md mx-auto space-y-2">
        <Label htmlFor="email" className="text-foreground">Email Address</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <Card key={index} className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start space-x-3 mb-4">
              {guide.icon}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleDownload(guide.title)}
              disabled={isSubmitting}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Guide
            </Button>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          No spam, ever. Unsubscribe at any time. Your information is secure.
        </p>
      </div>
    </div>
  );
}