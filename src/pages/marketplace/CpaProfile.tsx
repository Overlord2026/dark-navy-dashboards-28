// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { useParams } from 'react-router-dom';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import the ProInquiryForm component
const ProInquiryForm = ({ proId, persona = 'cpa' }: { proId: string; persona?: string }) => {
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState<string|undefined>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    // For now, just show success message since we don't have the full backend yet
    setTimeout(() => {
      setOk('inquiry_' + Date.now());
      setLoading(false);
    }, 1000);
  }

  return (
    <form onSubmit={onSubmit} className="bfo-card p-4 space-y-3">
      <div className="flex gap-3">
        <input name="name" placeholder="Your name" className="input flex-1 px-3 py-2 border rounded" required/>
        <input name="email" type="email" placeholder="you@example.com" className="input flex-1 px-3 py-2 border rounded" required/>
      </div>
      <input name="phone" placeholder="Phone (optional)" className="input w-full px-3 py-2 border rounded"/>
      <textarea name="message" placeholder="How can we help?" className="input w-full px-3 py-2 border rounded h-28"/>
      <Button disabled={loading} className="gold-button w-full">{loading ? 'Sending…' : 'Send Inquiry'}</Button>

      {ok && (
        <div className="text-xs text-gray-400">
          Receipt (content-free): <code>{ok}</code>
        </div>
      )}
    </form>
  );
};

export default function CpaProfile() {
  const { id } = useParams();
  
  // Mock CPA data - replace with actual data fetching
  const cpa = {
    name: "Sarah Johnson, CPA",
    specialty: "Tax Planning & Estate Tax",
    location: "New York, NY",
    rating: 4.9,
    experience: "15+ years",
    bio: "Specializing in complex tax strategies for high-net-worth individuals and families.",
    certifications: ["CPA", "CFP", "Estate Planning"],
    languages: ["English", "Spanish"]
  };

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bfo-card p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
                  {cpa.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{cpa.name}</h1>
                  <p className="text-xl text-muted-foreground mb-2">{cpa.specialty}</p>
                  <p className="text-muted-foreground mb-3">{cpa.location} • {cpa.experience}</p>
                  <Badge className="mb-4">★ {cpa.rating} Rating</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">500+</div>
                  <div className="text-sm text-muted-foreground">Clients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">$50M+</div>
                  <div className="text-sm text-muted-foreground">Tax Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">4.9</div>
                  <div className="text-sm text-muted-foreground">Client Rating</div>
                </div>
              </div>
              
              <p className="text-muted-foreground">{cpa.bio}</p>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4">Certifications & Expertise</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {cpa.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">{cert}</Badge>
                ))}
              </div>
              
              <h3 className="font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {cpa.languages.map((lang) => (
                  <Badge key={lang} variant="outline">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Sarah</h2>
              <ProInquiryForm proId={id || ''} persona="cpa" />
            </div>
            
            <div className="bfo-card p-6">
              <h3 className="font-semibold mb-4">Schedule Options</h3>
              <div className="space-y-3">
                <Button className="w-full gold-button">
                  📞 15-min Consultation (Free)
                </Button>
                <Button className="w-full gold-outline-button">
                  💼 Strategy Session ($200)
                </Button>
                <Button className="w-full gold-outline-button">
                  📊 Tax Review ($500)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}