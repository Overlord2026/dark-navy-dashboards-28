import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';
import { analytics } from '@/lib/analytics';

export function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const heroLogoConfig = getLogoConfig('hero');
  const brandLogoConfig = getLogoConfig('brand');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Track waitlist signup
      analytics.trackEvent('waitlist.signup', {
        email,
        firstName,
        lastName,
        company: company || 'not_provided',
        source: 'prelaunch_mode'
      });

      // TODO: In a real implementation, you would send this to your backend
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
    } catch (err: any) {
      console.error('Waitlist submission error:', err);
      setError('Failed to join waitlist. Please try again.');
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src={brandLogoConfig.src}
            alt=""
            className="w-[600px] h-[600px] object-contain opacity-5"
            style={{ filter: 'sepia(1) saturate(3) hue-rotate(30deg)' }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <Card className="w-full max-w-md bg-card border-white/10 text-center">
            <CardHeader>
              <div className="mb-4">
                <img 
                  src={heroLogoConfig.src}
                  alt="Boutique Family Office™"
                  className="h-16 w-auto mx-auto mb-4"
                />
              </div>
              <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4" />
              <CardTitle className="font-serif text-white text-xl">
                You're on the list!
              </CardTitle>
              <CardDescription className="text-white/70">
                Thank you for your interest. We'll notify you when registration opens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-gold text-gold hover:bg-gold hover:text-navy"
                onClick={() => navigate('/auth')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={brandLogoConfig.src}
          alt=""
          className="w-[600px] h-[600px] object-contain opacity-5"
          style={{ filter: 'sepia(1) saturate(3) hue-rotate(30deg)' }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <Card className="w-full max-w-md bg-card border-white/10">
          <CardHeader className="text-center">
            <div className="mb-4">
              <img 
                src={heroLogoConfig.src}
                alt="Boutique Family Office™"
                className="h-16 w-auto mx-auto mb-4"
              />
            </div>
            
            <CardTitle className="font-serif text-white text-xl">
              Join Our Exclusive Waitlist
            </CardTitle>
            <CardDescription className="text-white/70">
              Be the first to access our premium wealth management platform when we launch.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-white">
                  Company/Organization <span className="text-white/50">(Optional)</span>
                </label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full touch-target font-display" 
                style={{ 
                  backgroundColor: '#FFD700',
                  color: '#14213D',
                  minHeight: '48px'
                }}
                disabled={loading}
              >
                {loading ? 'Joining waitlist...' : 'Join Waitlist'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-white"
                onClick={() => navigate('/auth')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WaitlistPage;