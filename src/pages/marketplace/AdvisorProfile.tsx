import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchAdvisorById, submitProInquiry, type Advisor } from '@/services/pros';
import { Star, MapPin, Clock, ArrowLeft, Phone, Mail, Calendar } from 'lucide-react';

export default function AdvisorProfile() {
  const { id } = useParams<{ id: string }>();
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
    consent_tos: false
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
      const data = await fetchAdvisorById(id);
      setAdvisor(data);
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
      const result = await submitProInquiry({
        pro_id: id,
        persona: 'advisor',
        full_name: formData.full_name,
        email: formData.email,
        message: formData.message,
        consent_tos: formData.consent_tos
      });

      toast({
        title: "Inquiry sent successfully!",
        description: "We'll be in touch soon. Reference: " + result.receipt_hash?.slice(0, 8)
      });

      setShowContactForm(false);
      setFormData({ full_name: '', email: '', message: '', consent_tos: false });
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
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card p-8 text-center">
            <p className="text-muted-foreground">Loading advisor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card p-8 text-center">
            <p className="text-muted-foreground mb-4">Advisor not found.</p>
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
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/marketplace/advisors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Advisors
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <Card className="bfo-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
                      {advisor.avatar_url ? (
                        <img 
                          src={advisor.avatar_url} 
                          alt={advisor.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        advisor.name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{advisor.name}</h1>
                      <p className="text-xl text-muted-foreground mb-2">{advisor.title}</p>
                      <div className="flex items-center gap-4 text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{advisor.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{advisor.years}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-semibold">{advisor.rating}</span>
                        <span className="text-muted-foreground">Rating</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bfo-gold">15+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bfo-gold">500+</div>
                      <div className="text-sm text-muted-foreground">Clients Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bfo-gold">$50M+</div>
                      <div className="text-sm text-muted-foreground">Assets Managed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bfo-gold">{advisor.rating}</div>
                      <div className="text-sm text-muted-foreground">Client Rating</div>
                    </div>
                  </div>
                  
                  {/* Specializations */}
                  <div>
                    <h3 className="font-semibold mb-3">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {advisor.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card className="bfo-card">
                <CardHeader>
                  <CardTitle>About {advisor.name.split(' ')[0]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With {advisor.years} of experience in financial planning, {advisor.name} specializes in 
                    helping individuals and families achieve their financial goals through comprehensive 
                    planning and investment strategies. Licensed and experienced in {advisor.tags.join(', ').toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="bfo-card">
                <CardHeader>
                  <CardTitle>Contact {advisor.name.split(' ')[0]}</CardTitle>
                </CardHeader>
                <CardContent>
                  {!showContactForm ? (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setShowContactForm(true)}
                        className="w-full gold-button"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button className="w-full gold-outline-button">
                        <Phone className="h-4 w-4 mr-2" />
                        Request Call
                      </Button>
                      <Button className="w-full gold-outline-button">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Your name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <Textarea
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="h-28"
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
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Schedule Options */}
              <Card className="bfo-card">
                <CardHeader>
                  <CardTitle>Schedule Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full gold-outline-button">
                    📞 15-min Consultation (Free)
                  </Button>
                  <Button className="w-full gold-outline-button">
                    💼 Strategy Session ($200)
                  </Button>
                  <Button className="w-full gold-outline-button">
                    📊 Portfolio Review ($500)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}