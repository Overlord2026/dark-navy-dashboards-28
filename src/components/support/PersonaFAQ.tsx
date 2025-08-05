import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  ChevronDown,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePersona } from '@/context/PersonaContext';
import { PersonaType } from '@/types/personas';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  personas?: PersonaType[];
}

const FAQ_DATA: FAQItem[] = [
  // Universal Questions
  {
    question: "How do I import my clients?",
    answer: "Navigate to your dashboard and click 'Import Clients'. You can upload a CSV file or connect your CRM via our integrations panel. We support most major platforms including Salesforce, HubSpot, and Redtail.",
    category: "Getting Started",
    personas: ['advisor', 'accountant', 'attorney']
  },
  {
    question: "How do I upgrade my account?",
    answer: "Go to Settings > Billing or click the 'Upgrade' button in your dashboard. Choose from Professional ($99/mo) or Enterprise ($299/mo) plans. All upgrades include a 14-day free trial.",
    category: "Billing"
  },
  {
    question: "How do I connect my Google Calendar/Zoom/Stripe?",
    answer: "Visit Settings > Integrations to connect your favorite tools. We support 50+ integrations including Google Workspace, Zoom, Stripe, QuickBooks, and more. Most connections take under 2 minutes.",
    category: "Integrations"
  },
  {
    question: "What is SWAG Lead Score™?",
    answer: "SWAG Lead Score™ is our AI-powered 0-100 scoring system that evaluates prospects based on engagement, profile completeness, verified accounts, and conversion likelihood. Higher scores indicate better qualified leads.",
    category: "SWAG Scoring"
  },
  {
    question: "How do I invite colleagues for referral rewards?",
    answer: "Use the 'Invite Colleague' button in your dashboard or welcome modal. Each professional who joins gives you 1 month free! Share via LinkedIn, email, or SMS.",
    category: "Referrals"
  },

  // Advisor-specific
  {
    question: "How do I create my first proposal?",
    answer: "Go to CRM > Proposals > New Proposal. Our AI-assisted builder includes compliance-approved templates, risk assessments, and fee calculators. Proposals can be sent via secure link or PDF.",
    category: "Proposals",
    personas: ['advisor']
  },
  {
    question: "How do I set my availability for client meetings?",
    answer: "Navigate to Settings > Availability to configure your calendar. Set time blocks, meeting types, and buffer times. Your booking link automatically syncs with Google/Outlook.",
    category: "Scheduling",
    personas: ['advisor']
  },

  // Accountant-specific
  {
    question: "How do I upload tax returns and documents?",
    answer: "Use the Document Vault in your CPA dashboard. Drag and drop files or use bulk upload. All documents are encrypted and can be organized by client and tax year.",
    category: "Document Management",
    personas: ['accountant']
  },
  {
    question: "How do I track my CE requirements?",
    answer: "Visit Compliance > CE Tracking to monitor your continuing education. Set alerts for upcoming deadlines and upload certificates for automatic tracking.",
    category: "Compliance",
    personas: ['accountant']
  },

  // Attorney-specific
  {
    question: "How do I set up secure document sharing with clients?",
    answer: "Create client portals in Documents > Client Access. Each client gets a secure login to view and sign documents. All access is logged for compliance.",
    category: "Document Security",
    personas: ['attorney']
  },
  {
    question: "How do I track my CLE hours?",
    answer: "Use Compliance > CLE Management to log hours by jurisdiction. Upload certificates and set renewal reminders. We track requirements for all 50 states.",
    category: "CLE Tracking",
    personas: ['attorney']
  },

  // Insurance-specific
  {
    question: "How do I generate quotes and track commissions?",
    answer: "Use the Quote Builder in your Insurance Hub. Connect to carrier systems for real-time rates. Commission tracking automatically syncs with your agency management system.",
    category: "Quote Management",
    personas: ['insurance_agent']
  },

  // Coach-specific
  {
    question: "How do I upload and sell my training content?",
    answer: "Go to Content > Training Library to upload courses, worksheets, and videos. Set your pricing and access levels. Our platform handles payments and client access.",
    category: "Content Management",
    personas: ['coach']
  }
];

interface PersonaFAQProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: string;
}

export const PersonaFAQ: React.FC<PersonaFAQProps> = ({
  isOpen,
  onToggle,
  context = 'general'
}) => {
  const { currentPersona } = usePersona();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter FAQs based on persona and search
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesPersona = !faq.personas || faq.personas.includes(currentPersona);
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesPersona && matchesSearch && matchesCategory;
  });

  // Get unique categories for filtering
  const categories = ['all', ...Array.from(new Set(FAQ_DATA.map(faq => faq.category)))];

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 left-6 z-50"
      >
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg group"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 left-0 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          FAQ & Help
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 left-6 z-50 w-96 max-h-[70vh]"
    >
      <Card className="shadow-xl border-purple-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>
              FAQ & Help
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </Badge>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No FAQs found matching your search.</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm font-medium pr-2">{faq.question}</span>
                    {expandedItems.has(index) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 text-sm text-muted-foreground border-t">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>

          {/* Support Contact */}
          <div className="border-t pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Still need help?
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Live Chat
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Support
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};