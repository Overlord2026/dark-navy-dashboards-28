import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, TrendingUp, Calculator, Shield, Clock, ChevronRight } from 'lucide-react';

interface EmailTemplate {
  day: number;
  subject: string;
  content: {
    elements: string[];
  };
  preview?: string;
}

const emailSequence: EmailTemplate[] = [
  {
    day: 0,
    subject: "Here's how to close more clients without more hours",
    content: {
      elements: ["Deck link", "2-sentence pain + solution", "CTA to book demo"]
    },
    preview: "Advisors lose 30% of opportunities to disconnected systems. See how our all-in-one platform fixes that and grows your book of business."
  },
  {
    day: 1,
    subject: "See how Jane grew her book 2x in 6 months",
    content: {
      elements: ["Case study of advisor using SWAG + Linda AI", "ROI numbers", "Demo CTA"]
    },
    preview: "Jane Thompson increased her AUM from $50M to $100M using our SWAG Lead Score™ and Linda AI automation. Here's exactly how she did it."
  },
  {
    day: 3,
    subject: "What's your ROI potential?",
    content: {
      elements: ["Link to ROI calculator", "Simple steps to see their potential growth"]
    },
    preview: "Calculate your potential growth with our ROI tool. Input your current metrics and see how our platform could increase your close rate."
  },
  {
    day: 5,
    subject: "Your compliance shield + client growth engine",
    content: {
      elements: ["Spotlight on compliance + AI automation combo"]
    },
    preview: "FINRA compliant CRM + AI automation = protected license + more clients. See how we keep you compliant while growing your practice."
  },
  {
    day: 7,
    subject: "Last chance to claim your annual discount",
    content: {
      elements: ["Urgency email with discount reminder"]
    },
    preview: "Save up to $398/year with annual billing. This offer expires soon. Lock in your savings and start growing your book today."
  }
];

export default function AdvisorEmailSequence() {
  const [selectedEmail, setSelectedEmail] = useState<EmailTemplate | null>(null);

  const getEmailIcon = (day: number) => {
    switch (day) {
      case 0: return <Mail className="h-5 w-5 text-gold" />;
      case 1: return <TrendingUp className="h-5 w-5 text-success" />;
      case 3: return <Calculator className="h-5 w-5 text-aqua" />;
      case 5: return <Shield className="h-5 w-5 text-gold" />;
      case 7: return <Clock className="h-5 w-5 text-red-400" />;
      default: return <Mail className="h-5 w-5 text-textSecondary" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-textPrimary">
          Advisor Email Sequence
        </h1>
        <p className="text-xl text-textSecondary">
          Automated 7-day nurture sequence for advisor leads
        </p>
        <Badge variant="outline" className="text-sm">
          Trigger: Advisor lead tagged in CRM
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Timeline */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">Email Timeline</h2>
          {emailSequence.map((email, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-colors ${
                selectedEmail?.day === email.day 
                  ? 'border-gold bg-gold/10' 
                  : 'hover:border-border/50'
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cardBg border border-border">
                      {getEmailIcon(email.day)}
                    </div>
                    {index < emailSequence.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Day {email.day}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-textSecondary" />
                    </div>
                    <h3 className="font-semibold text-textPrimary text-sm mb-2">
                      {email.subject}
                    </h3>
                    <p className="text-xs text-textSecondary line-clamp-2">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email Preview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">Email Preview</h2>
          {selectedEmail ? (
            <Card className="bg-cardBg/50 border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Day {selectedEmail.day}</Badge>
                  <Calendar className="h-4 w-4 text-textSecondary" />
                </div>
                <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-surface/30 rounded-lg p-4">
                  <p className="text-textSecondary text-sm leading-relaxed">
                    {selectedEmail.preview}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-textPrimary">Content Elements:</h4>
                  <ul className="space-y-1">
                    {selectedEmail.content.elements.map((element, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                        <span className="text-textSecondary">{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button size="sm" className="w-full">
                    {selectedEmail.day === 0 && "Book Demo"}
                    {selectedEmail.day === 1 && "See Case Study"}
                    {selectedEmail.day === 3 && "Try ROI Calculator"}
                    {selectedEmail.day === 5 && "Learn About Compliance"}
                    {selectedEmail.day === 7 && "Claim Annual Discount"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-cardBg/30 border-dashed border-border">
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-textSecondary mx-auto mb-4" />
                <p className="text-textSecondary">
                  Select an email from the timeline to preview its content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sequence Stats */}
      <Card className="bg-gradient-to-r from-surface/50 to-cardBg/50 border-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">5</div>
              <div className="text-sm text-textSecondary">Emails</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-aqua">7</div>
              <div className="text-sm text-textSecondary">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">35%</div>
              <div className="text-sm text-textSecondary">Avg Open Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">18%</div>
              <div className="text-sm text-textSecondary">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}