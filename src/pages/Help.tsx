
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, MessageSquare, Phone, Video } from "lucide-react";

export default function Help() {
  return (
    <ThreeColumnLayout activeMainItem="help" title="Help & Support">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-1">
            Get answers to common questions and contact support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 flex flex-col items-center text-center">
            <BookOpen className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Knowledge Base</h3>
            <p className="text-muted-foreground mb-4">
              Browse our comprehensive guides and tutorials
            </p>
            <Button variant="outline" className="mt-auto">View Articles</Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <MessageSquare className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Live Chat</h3>
            <p className="text-muted-foreground mb-4">
              Chat with our support team in real-time
            </p>
            <Button variant="outline" className="mt-auto">Start Chat</Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <Video className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Video Tutorials</h3>
            <p className="text-muted-foreground mb-4">
              Watch step-by-step guides for using the platform
            </p>
            <Button variant="outline" className="mt-auto">Watch Videos</Button>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I share documents with professionals?</AccordionTrigger>
              <AccordionContent>
                Navigate to the Service Professionals tab, select the professional you want to share with, 
                then click on "Share Documents" to select which files you want to share.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I revoke access to shared documents?</AccordionTrigger>
              <AccordionContent>
                Yes, you can revoke access at any time. Go to the Service Professionals or Family Members 
                tab, find the shared document, and click on "Manage Access" to change permissions or revoke access.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I add family members to my account?</AccordionTrigger>
              <AccordionContent>
                Go to the Family Members tab and click on "Add Family Member." Enter their email address 
                and set their access level, then send the invitation. They'll receive an email with instructions 
                to create their account.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What's the difference between Service Pros and Family Members?</AccordionTrigger>
              <AccordionContent>
                Service Professionals are external advisors like accountants, attorneys, or financial planners 
                who need access to specific documents or information. Family Members are people in your household 
                or trusted relatives who you want to share broader access with for collaborative planning.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Contact Support</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-primary h-5 w-5" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-muted-foreground">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-primary h-5 w-5" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-muted-foreground">support@example.com</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
