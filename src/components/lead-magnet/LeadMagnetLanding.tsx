import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Users, Shield, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface LeadMagnetFormData {
  name: string;
  email: string;
  phone?: string;
  persona: string;
}

interface LeadMagnetLandingProps {
  onSubmit: (data: LeadMagnetFormData) => void;
}

export const LeadMagnetLanding: React.FC<LeadMagnetLandingProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LeadMagnetFormData>({
    name: '',
    email: '',
    phone: '',
    persona: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.persona) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Success! Preparing your download...');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Boutique Family Office™</h1>
                <p className="text-sm text-muted-foreground">Marketplace</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Free Download
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  The Boutique Family Office™<br />
                  <span className="text-primary">Wealth & Health Playbook</span>
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Discover the insider secrets that ultra-wealthy families use to protect, grow, and transfer their wealth across generations. This comprehensive guide reveals the exact strategies, tools, and expert network that were once exclusive to billion-dollar family offices.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">What You'll Learn:</h3>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Advanced investment strategies used by family offices managing $100M+</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Tax optimization techniques that save millions annually</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Estate planning structures for multi-generational wealth transfer</p>
                  </div>
                </div>
              </div>

              {/* Preview Image */}
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
                <div className="w-32 h-40 mx-auto bg-background rounded-lg shadow-lg border border-border/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 rounded bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">BFO</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Wealth & Health<br />Playbook</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">47-page comprehensive guide</p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pl-8">
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-foreground">Get Your Free Copy</CardTitle>
                  <p className="text-muted-foreground">Instant download + complimentary marketplace access</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                        className="border-border/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        required
                        className="border-border/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="border-border/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="persona" className="text-foreground">I am a... *</Label>
                      <Select 
                        value={formData.persona} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, persona: value }))}
                        required
                      >
                        <SelectTrigger className="border-border/60">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client / Family</SelectItem>
                          <SelectItem value="advisor">Financial Advisor</SelectItem>
                          <SelectItem value="cpa">CPA / Accountant</SelectItem>
                          <SelectItem value="attorney">Attorney / Legal</SelectItem>
                          <SelectItem value="insurance_agent">Insurance & Medicare Agent</SelectItem>
                          <SelectItem value="healthcare_consultant">Healthcare & Longevity Consultant</SelectItem>
                          <SelectItem value="realtor">Real Estate & Property Manager</SelectItem>
                          <SelectItem value="enterprise_admin">Elite Family Office Executive</SelectItem>
                          <SelectItem value="coach">Coach / Consultant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Download Free Guide</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center text-xs text-muted-foreground">
                    By downloading, you'll also get complimentary access to our marketplace platform and occasional updates about wealth management strategies.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};