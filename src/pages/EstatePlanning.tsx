import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArchiveIcon, 
  CheckCircle2, 
  Clock, 
  FileText, 
  List, 
  Shield, 
  Users2, 
  ExternalLink,
  Upload,
  Lock,
  FileCheck,
  CheckCircle,
  Circle,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { SecureTaxReturnAnalysis } from "@/components/estate-planning/SecureTaxReturnAnalysis";

export default function EstatePlanning() {
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [showAdvisorDialog, setShowAdvisorDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShowInterest = () => {
    // Send email to advisor
    console.log("Sending email to advisor with form data:", formData);
    
    // Alert advisor in real-time
    console.log("Alerting advisor about interest:", formData);
    
    toast.success("Thank you for your interest! An advisor will contact you soon.");
    setShowInterestDialog(false);
  };

  const handleScheduleAppointment = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page");
  };

  const services = [
    {
      title: "Will & Trust Creation",
      icon: FileText,
      description: "Professional drafting of legally binding wills and trusts tailored to your specific wishes and circumstances."
    },
    {
      title: "Estate Tax Planning",
      icon: Shield,
      description: "Strategic planning to minimize tax burdens on your estate and maximize the wealth passed to your beneficiaries."
    },
    {
      title: "Succession Planning",
      icon: Users2,
      description: "Structured approach to transitioning business ownership and management to ensure continuity."
    },
    {
      title: "Estate Administration",
      icon: List,
      description: "Professional management of estate settlement processes, including probate navigation and asset distribution."
    },
    {
      title: "Regular Review Services",
      icon: Clock,
      description: "Scheduled reviews of your estate plan to ensure it remains aligned with your goals as laws and circumstances change."
    }
  ];

  return (
    <ThreeColumnLayout activeMainItem="estate-planning" title="Estate Planning Services">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="text-left">
            <p className="text-sm text-muted-foreground max-w-3xl">
              Secure your legacy and protect what matters most with our comprehensive estate planning solutions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Dialog open={showAdvisorDialog} onOpenChange={setShowAdvisorDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule a Meeting</DialogTitle>
                  <DialogDescription>
                    Schedule a meeting with our estate planning expert to discuss your needs.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred-time">Preferred Time</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Morning", "Afternoon", "Evening"].map((time) => (
                        <Button key={time} variant="outline" size="sm" onClick={() => toast.info(`${time} selected`)}>
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setShowAdvisorDialog(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleAppointment} className="w-full sm:w-auto">
                    Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showInterestDialog} onOpenChange={setShowInterestDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  I'm Interested
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Express Interest</DialogTitle>
                  <DialogDescription>
                    Let us know what estate planning services you're interested in.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="interest-name">Full Name</Label>
                    <Input id="interest-name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest-email">Email</Label>
                    <Input id="interest-email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest-services">Services of Interest</Label>
                    <div className="flex flex-wrap gap-2">
                      {services.slice(0, 3).map((service) => (
                        <Button key={service.title} variant="outline" size="sm" onClick={() => toast.info(`${service.title} selected`)}>
                          {service.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your estate planning needs..." className="min-h-[80px]" />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setShowInterestDialog(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleShowInterest} className="w-full sm:w-auto">
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full mb-6 h-auto flex-col sm:flex-row">
            <TabsTrigger value="services" className="flex-1 w-full sm:w-auto">Our Services</TabsTrigger>
            <TabsTrigger value="process" className="flex-1 w-full sm:w-auto">Our Process</TabsTrigger>
            <TabsTrigger value="resources" className="flex-1 w-full sm:w-auto">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {/* Secure Tax Return Analysis */}
            <div className="mb-8">
              <SecureTaxReturnAnalysis />
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.title} className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => setShowInterestDialog(true)}>
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Why Choose Section - Only in Services Tab */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Why Choose Our Estate Planning Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Personalized Approach",
                      description: "We take the time to understand your unique situation and create customized solutions."
                    },
                    {
                      title: "Comprehensive Protection",
                      description: "Our holistic approach ensures all aspects of your estate and legacy are protected."
                    },
                    {
                      title: "Expert Guidance",
                      description: "Work with experienced professionals who specialize in estate planning and wealth preservation."
                    }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <h3 className="font-semibold text-base">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Our Estate Planning Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Initial Consultation",
                      description: "Meet with our estate planning expert to discuss your goals, concerns, and family situation."
                    },
                    {
                      step: 2,
                      title: "Plan Design",
                      description: "Our team creates a tailored estate plan addressing your specific needs and objectives."
                    },
                    {
                      step: 3,
                      title: "Document Preparation",
                      description: "Legal documents are drafted, including wills, trusts, powers of attorney, and healthcare directives."
                    },
                    {
                      step: 4,
                      title: "Review & Execution",
                      description: "Review all documents, make necessary adjustments, and formally execute the estate plan."
                    },
                    {
                      step: 5,
                      title: "Implementation & Funding",
                      description: "Transfer assets to trusts and update beneficiary designations as needed."
                    },
                    {
                      step: 6,
                      title: "Ongoing Support",
                      description: "Regular reviews to keep your plan current with life changes and law updates."
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start">
                      <div className="bg-primary/10 rounded-full p-3 flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <span className="font-bold text-primary text-sm">{item.step}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleScheduleAppointment} className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Estate Planning Guides</CardTitle>
                  <CardDescription>Free resources to help you understand estate planning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Estate Planning 101: The Basics",
                    "Understanding Wills vs. Trusts",
                    "How to Choose an Executor",
                    "Estate Tax Planning Strategies",
                    "Digital Asset Protection Guide"
                  ].map((guide) => (
                    <div key={guide} className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{guide}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Downloading resources...")}>
                    Download Guides
                  </Button>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Family Legacy Box</CardTitle>
                  <CardDescription>Preserve your family history and values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our Family Legacy Box is a comprehensive digital solution that helps you preserve important memories, 
                    documents, and personal messages for future generations. It includes:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Digital storage of important documents",
                      "Family history preservation",
                      "Video and audio recording capabilities",
                      "Ethical will creation tools",
                      "Secure access for designated family members"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setShowInterestDialog(true)}>
                    Learn More About Legacy Box
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
