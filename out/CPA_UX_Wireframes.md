# CPA/Accountant Persona - UX Wireframes & Analysis

## Persona Overview

### Current CPA Routes Coverage
- **Landing:** `/cpas` (CPAAccountantIntroPage) ✅
- **Dashboard:** `/personas/cpa` (AccountantPersonaDashboard) ✅  
- **Professional:** `/pros/cpas` (AccountantDashboard) ✅
- **Tools:** `/tools/tax-hub` ✅
- **Onboarding:** `/accountant/onboarding` ✅

### CPA Persona Home Analysis

**Current Implementation:**
- CPAAccountantIntroPage serves as main landing with features overview
- AccountantPersonaDashboard provides three-column workspace
- AccountantDashboard gives professional-level tools access
- Tax hub available but projection tools missing

**Sections Present:**
- ✅ Overview: Feature highlights and benefits
- ✅ Tools: Tax optimization, entity planning, compliance
- ❌ Learn/CE: Missing continuing education center
- ❌ Receipts: No dedicated CPA receipt interface
- ❌ Automations: Workflow automation not surfaced

## Primary CPA Tasks

### 1. Client Tax Workflows
**Current:** Basic tax hub preview, limited projections
**Gaps:** Multi-year projection tool, entity comparison calculator

### 2. Continuing Education
**Current:** No dedicated CE center
**Gaps:** State requirement tracking, CE hour management, AICPA compliance

### 3. Document Management
**Current:** General document vault
**Gaps:** CPA-specific document templates, client portal integration

### 4. Professional Networking
**Current:** No CPA marketplace
**Gaps:** CPA directory, referral system, professional inquiry handling

## Critical Gaps Analysis

### Publish-Critical (Blocking Production)
1. **CPA Marketplace Missing** - `/marketplace/cpas` returns 404
2. **Individual CPA Profiles Missing** - `/marketplace/cpas/:id` returns 404  
3. **CPA Home Dashboard Missing** - `/cpas/home` returns 404
4. **Multi-Year Tax Projector Missing** - `/tools/tax-projection` returns 404

### Demo-Ready (Affects Customer Experience)
1. **CE Center Missing** - `/learn/ce` returns 404
2. **ProInquiryForm Integration** - Contact forms on CPA profiles need backend
3. **Brand Consistency** - CPAAccountantIntroPage uses standard Cards instead of bfo-card

### Backlog (Enhancement)
1. **Client Portal Integration** - Enhanced document sharing
2. **Workflow Automation Interface** - Task automation for CPAs
3. **Advanced Tax Tools** - Entity comparison, charitable planning

## Suggested File-Scoped Fixes

### 1. Create CPA Home Dashboard (`src/pages/cpas/CpaHome.tsx`)
```tsx
// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { PersonaSubHeader } from '@/components/ui/PersonaSubHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Users, BookOpen } from 'lucide-react';

export default function CpaHome() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <PersonaSubHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <h1 className="text-3xl font-bold mb-4">CPA Command Center</h1>
            <p className="text-muted-foreground mb-6">
              Welcome to your comprehensive tax professional workspace
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="gold-button flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Tax Projections
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button className="gold-outline-button flex items-center gap-2">
                <Users className="h-4 w-4" />
                Client Portal
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button className="gold-outline-button flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                CE Center
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">📊</div>
                <p className="text-sm">Start Tax Projection</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">📁</div>
                <p className="text-sm">Client Documents</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">🎓</div>
                <p className="text-sm">CE Requirements</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">📋</div>
                <p className="text-sm">Compliance Tools</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

### 2. Create CPA Marketplace (`src/pages/marketplace/CpaMarketplace.tsx`)
```tsx
// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function CpaMarketplace() {
  const cpas = [
    { id: 1, name: "Sarah Johnson, CPA", specialty: "Tax Planning", rating: 4.9, location: "New York, NY" },
    { id: 2, name: "Michael Chen, CPA", specialty: "Estate Tax", rating: 4.8, location: "San Francisco, CA" },
    { id: 3, name: "Lisa Rodriguez, CPA", specialty: "Small Business", rating: 4.7, location: "Austin, TX" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Expert CPAs</h1>
            <p className="text-xl text-muted-foreground">
              Connect with certified public accountants specializing in your needs
            </p>
          </section>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input placeholder="Search by specialty or location..." className="flex-1" />
            <Button className="gold-button">Search CPAs</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">All Specialties</Badge>
            <Badge variant="outline">Tax Planning</Badge>
            <Badge variant="outline">Estate Tax</Badge>
            <Badge variant="outline">Business Tax</Badge>
            <Badge variant="outline">Audit</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cpas.map((cpa) => (
              <div key={cpa.id} className="bfo-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    {cpa.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{cpa.name}</h3>
                    <p className="text-sm text-muted-foreground">{cpa.specialty}</p>
                    <p className="text-sm text-muted-foreground">{cpa.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge>★ {cpa.rating}</Badge>
                  <Button 
                    size="sm" 
                    className="gold-outline-button"
                    onClick={() => window.location.href = `/marketplace/cpas/${cpa.id}`}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Create Individual CPA Profile (`src/pages/marketplace/CpaProfile.tsx`)
```tsx
// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { useParams } from 'react-router-dom';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProInquiryForm } from '@/components/ui/ProInquiryForm';

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
```

### 4. Create Multi-Year Tax Projector (`src/pages/tools/TaxProjectionTool.tsx`)
```tsx
// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function TaxProjectionTool() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Tools
            </Button>
          </div>
          
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-gold" />
              <h1 className="text-3xl font-bold">Multi-Year Tax Projector</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Project tax liabilities across multiple years with scenario modeling and optimization recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Features</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 5-year tax projection modeling</li>
                  <li>• Roth conversion optimization</li>
                  <li>• Tax-loss harvesting scenarios</li>
                  <li>• Estate tax projections</li>
                  <li>• Business entity comparisons</li>
                  <li>• Charitable giving strategies</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full gold-button">
                    Start New Projection
                  </Button>
                  <Button className="w-full gold-outline-button">
                    Load Client Template
                  </Button>
                  <Button className="w-full gold-outline-button">
                    View Sample Reports
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Projections</h2>
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projections yet. Create your first projection to get started.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

### 5. Create CE Learning Center (`src/pages/learn/ContinuingEducation.tsx`)
```tsx
// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Clock } from 'lucide-react';

export default function ContinuingEducation() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-gold" />
              <h1 className="text-3xl font-bold">Continuing Education Center</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Track your CE requirements and access professional development courses
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                CE Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Hours (2024)</span>
                    <span>24 / 40</span>
                  </div>
                  <Progress value={60} className="mb-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Ethics Hours</span>
                    <span>2 / 4</span>
                  </div>
                  <Progress value={50} className="mb-2" />
                </div>
                <Button className="w-full gold-outline-button">
                  View Full Report
                </Button>
              </div>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Upcoming Deadlines
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">State License Renewal</span>
                  <span className="text-sm font-semibold text-orange-600">45 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AICPA Membership</span>
                  <span className="text-sm font-semibold text-green-600">120 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ethics Requirement</span>
                  <span className="text-sm font-semibold text-red-600">15 days</span>
                </div>
              </div>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full gold-button">
                  Browse Courses
                </Button>
                <Button className="w-full gold-outline-button">
                  Upload Certificate
                </Button>
                <Button className="w-full gold-outline-button">
                  State Requirements
                </Button>
              </div>
            </div>
          </div>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tax Update 2024</h3>
                <p className="text-sm text-muted-foreground mb-3">Latest tax law changes and their impact</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">8 Hours CE</span>
                  <Button size="sm" className="gold-outline-button">Enroll</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Ethics in Practice</h3>
                <p className="text-sm text-muted-foreground mb-3">Professional ethics and responsibility</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">4 Hours CE</span>
                  <Button size="sm" className="gold-outline-button">Enroll</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Estate Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">Advanced estate tax strategies</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">6 Hours CE</span>
                  <Button size="sm" className="gold-outline-button">Enroll</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

## Data Sources Referenced

### Required Supabase Tables
- `pro_inquiries` - Contact form submissions
- `accountant_ce_records` - CE tracking (exists)
- `accountant_ce_requirements` - State requirements (exists)
- `accountant_license_status` - License tracking (exists)

### Required Edge Functions
- `pro-inquiry-email` - Handle contact form submissions
- `cpa-ce-sync` - Sync CE records with state boards (future)

### Required Components
- `ProInquiryForm` - Professional contact form (provided)
- CPA-specific navigation and layouts
- CE progress tracking components

## Next Steps

1. Create missing route stubs (5 files)
2. Set up ProInquiryForm infrastructure 
3. Implement CPA marketplace functionality
4. Add brand consistency (bfo-card conversions)
5. Integrate CE tracking with existing tables