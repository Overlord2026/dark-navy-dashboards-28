import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Clock, ArrowLeft, Phone, Mail, Calendar } from 'lucide-react';

// Use mock data for advisor profiles until API is implemented
interface AdvisorProfile {
  id: string;
  name: string;
  title?: string;
  photo_url?: string;
  location?: string;
  rating?: number;
  tags?: string[];
  bio?: string;
  website?: string;
}

export default function AdvisorDetail() {
  const { id } = useParams<{ id: string }>();
  const [advisor, setAdvisor] = useState<AdvisorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      loadAdvisor();
    }
  }, [id]);

  const loadAdvisor = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Mock advisor data
      const mockAdvisor: AdvisorProfile = {
        id: id,
        name: 'John Smith',
        title: 'Senior Financial Advisor',
        location: 'New York, NY',
        rating: 4.8,
        tags: ['Retirement Planning', 'Estate Planning', 'Tax Strategy'],
        bio: 'Experienced financial advisor with over 15 years helping families achieve their financial goals.',
        website: 'https://example.com'
      };
      setAdvisor(mockAdvisor);
    } catch (error) {
      console.error('Failed to load advisor:', error);
      toast({
        title: "Unable to load advisor profile",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisor || !id) return;

    try {
      setSubmitting(true);

      // Insert into database using the correct schema
      const { data: inquiryData, error: dbError } = await supabase
        .from('pro_inquiries')
        .insert({
          persona: 'advisor',
          pro_id: id,
          full_name: formData.name,
          email: formData.email,
          message: formData.message || null
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Call email edge function
      try {
        await fetch('https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/pro-inquiry-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pro_slug: id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message
          })
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Continue since the inquiry was saved to DB
      }

      toast({
        title: "Inquiry sent. We'll follow up shortly.",
        description: "Thank you for your interest!"
      });

      setShowContactForm(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: "Failed to send inquiry",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
        <BrandHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card p-8 text-center">
            <p className="text-white">Loading advisor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
        <BrandHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card p-8 text-center">
            <p className="text-white mb-4">Coming soon</p>
            <Button asChild className="gold-outline-button">
              <Link to="/marketplace/advisors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Advisors
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <Button asChild variant="ghost" className="mb-4 text-white hover:text-bfo-gold">
            <Link to="/marketplace/advisors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Advisors
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <div className="bfo-card p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-bfo-purple rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {advisor.photo_url ? (
                      <img 
                        src={advisor.photo_url} 
                        alt={advisor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      advisor.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2 text-white">{advisor.name}</h1>
                    <p className="text-xl text-bfo-gold mb-2">{advisor.title || 'Financial Advisor'}</p>
                    <div className="flex items-center gap-4 text-white/70 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{advisor.location || 'US'}</span>
                      </div>
                      {advisor.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-bfo-gold fill-current" />
                          <span className="text-bfo-gold">{advisor.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Specializations */}
                {advisor.tags && advisor.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-white">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {advisor.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs border border-bfo-gold text-bfo-gold rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className="bfo-card p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">About {advisor.name.split(' ')[0]}</h3>
                <p className="text-white/80">
                  {advisor.bio || `Experienced financial advisor specializing in ${advisor.tags?.join(', ').toLowerCase() || 'wealth management'}.`}
                </p>
                {advisor.website && (
                  <div className="mt-4">
                    <a href={advisor.website} target="_blank" rel="noopener noreferrer" className="text-bfo-gold hover:underline">
                      Visit Website →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bfo-card p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Contact this Advisor</h3>
                {!showContactForm ? (
                  <Button 
                    onClick={() => setShowContactForm(true)}
                    className="w-full gold-button"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-bfo-purple border-bfo-gold text-white"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-bfo-purple border-bfo-gold text-white"
                    />
                    <Input
                      type="tel"
                      placeholder="Phone (cell)"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-bfo-purple border-bfo-gold text-white"
                    />
                    <Textarea
                      placeholder="How can this advisor help you?"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="h-28 bg-bfo-purple border-bfo-gold text-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 gold-button"
                      >
                        {submitting ? 'Sending...' : 'Send Inquiry'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                        className="gold-outline-button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}