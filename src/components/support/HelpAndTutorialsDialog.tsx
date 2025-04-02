
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Video, MessageCircle, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HelpAndTutorialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChatWithSupport: () => void;
}

export function HelpAndTutorialsDialog({ isOpen, onClose, onChatWithSupport }: HelpAndTutorialsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqItems = [
    {
      question: "How do I connect a bill payment provider?",
      answer: "You can connect bill payment providers through the Advanced Bill Paying Providers dialog. Click on the 'Advanced Bill Paying Providers' button on the Bill Pay page, then select the provider you want to integrate with and follow the on-screen instructions."
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes! We use industry-standard encryption for all data, both in transit and at rest. Your API keys and credentials for third-party services are encrypted and stored securely. We never share your information with unauthorized parties."
    },
    {
      question: "How do I set up automatic bill payments?",
      answer: "Navigate to the Bill Pay section, select the bill you want to automate, and click 'Set Up Autopay'. You can then specify payment frequency, amount limits, and payment methods."
    },
    {
      question: "Can I schedule payments in advance?",
      answer: "Yes, you can schedule payments up to one year in advance. Simply create a new payment and select your desired payment date on the calendar."
    },
    {
      question: "How do I get help with a failed payment?",
      answer: "If you experience a failed payment, first check your payment details and funding source. If everything looks correct, click on 'Chat with Support' for immediate assistance from our team."
    }
  ];
  
  const tutorials = [
    {
      title: "Getting Started with Bill Pay",
      description: "Learn the basics of setting up and managing your bills in the system.",
      videoUrl: "#",
      duration: "3:45"
    },
    {
      title: "Connecting External Payment Providers",
      description: "Step-by-step guide to securely connecting third-party bill payment services.",
      videoUrl: "#",
      duration: "5:12"
    },
    {
      title: "Setting Up Automatic Payments",
      description: "Learn how to schedule and automate recurring bill payments.",
      videoUrl: "#",
      duration: "4:30"
    },
    {
      title: "Managing Payment Approvals",
      description: "How to set up approval workflows for bills above certain amounts.",
      videoUrl: "#",
      duration: "6:18"
    },
    {
      title: "Reconciling Bill Payments",
      description: "Tips for matching payments with invoices and statements.",
      videoUrl: "#",
      duration: "7:22"
    }
  ];
  
  const guides = [
    {
      title: "Complete Bill Pay User Guide",
      description: "Comprehensive guide covering all bill payment features and options.",
      url: "#"
    },
    {
      title: "Security Best Practices",
      description: "Recommendations for keeping your payment information secure.",
      url: "#"
    },
    {
      title: "Provider Integration Guide",
      description: "Detailed instructions for setting up each supported payment provider.",
      url: "#"
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions for frequent questions and problems.",
      url: "#"
    },
    {
      title: "Mobile App Guide",
      description: "Using bill pay features on your mobile device.",
      url: "#"
    }
  ];
  
  const filteredFaqs = searchQuery 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
    
  const filteredTutorials = searchQuery
    ? tutorials.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tutorials;
    
  const filteredGuides = searchQuery
    ? guides.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : guides;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Help & Tutorials
          </DialogTitle>
          <DialogDescription>
            Find answers to common questions or learn how to use our features
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help topics..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="faq" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="faq" className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            <TabsContent value="faq" className="mt-0">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-md">{item.question}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No FAQ items match your search.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tutorials" className="mt-0">
              {filteredTutorials.length > 0 ? (
                <div className="space-y-4">
                  {filteredTutorials.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-md">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">{item.duration}</span>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No tutorials match your search.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="guides" className="mt-0">
              {filteredGuides.length > 0 ? (
                <div className="space-y-4">
                  {filteredGuides.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-md">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Guide
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No guides match your search.
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="border-t pt-4 mt-4">
          <div className="flex w-full justify-between items-center">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onChatWithSupport} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Support
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
