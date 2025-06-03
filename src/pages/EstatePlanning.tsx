
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  ArrowRight,
  MessageSquare,
  PenTool,
  FileSignature,
  Settings,
  RefreshCw,
  Star,
  Award,
  TrendingUp,
  Target,
  Zap
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
      description: "Professional drafting of legally binding wills and trusts tailored to your specific wishes and circumstances.",
      features: ["Custom Will Drafting", "Trust Formation", "Legal Review"],
      highlighted: true
    },
    {
      title: "Estate Tax Planning",
      icon: Shield,
      description: "Strategic planning to minimize tax burdens on your estate and maximize the wealth passed to your beneficiaries.",
      features: ["Tax Optimization", "Wealth Preservation", "Strategy Development"],
      highlighted: false
    },
    {
      title: "Succession Planning",
      icon: Users2,
      description: "Structured approach to transitioning business ownership and management to ensure continuity.",
      features: ["Business Transition", "Leadership Planning", "Continuity Strategy"],
      highlighted: false
    },
    {
      title: "Estate Administration",
      icon: List,
      description: "Professional management of estate settlement processes, including probate navigation and asset distribution.",
      features: ["Probate Navigation", "Asset Distribution", "Legal Compliance"],
      highlighted: false
    },
    {
      title: "Regular Review Services",
      icon: Clock,
      description: "Scheduled reviews of your estate plan to ensure it remains aligned with your goals as laws and circumstances change.",
      features: ["Annual Reviews", "Plan Updates", "Compliance Monitoring"],
      highlighted: false
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Initial Consultation",
      description: "Meet with our estate planning expert to discuss your goals, concerns, and family situation. We'll assess your current situation and identify key priorities.",
      icon: MessageSquare,
      duration: "1-2 hours",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      tasks: ["Assess current situation", "Identify goals", "Review family dynamics"]
    },
    {
      step: 2,
      title: "Plan Design",
      description: "Our team creates a tailored estate plan addressing your specific needs and objectives. We'll present multiple strategies for your consideration.",
      icon: PenTool,
      duration: "1-2 weeks",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      tasks: ["Strategy development", "Plan customization", "Option presentation"]
    },
    {
      step: 3,
      title: "Document Preparation",
      description: "Legal documents are drafted, including wills, trusts, powers of attorney, and healthcare directives. All documents undergo thorough review.",
      icon: FileText,
      duration: "2-3 weeks",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      tasks: ["Document drafting", "Legal review", "Quality assurance"]
    },
    {
      step: 4,
      title: "Review & Execution",
      description: "Review all documents, make necessary adjustments, and formally execute the estate plan with proper witnessing and notarization.",
      icon: FileSignature,
      duration: "1 week",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      tasks: ["Final review", "Document execution", "Witness coordination"]
    },
    {
      step: 5,
      title: "Implementation & Funding",
      description: "Transfer assets to trusts and update beneficiary designations as needed. We ensure your plan is fully operational.",
      icon: Settings,
      duration: "2-4 weeks",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tasks: ["Asset transfers", "Beneficiary updates", "Account coordination"]
    },
    {
      step: 6,
      title: "Ongoing Support",
      description: "Regular reviews to keep your plan current with life changes and law updates. We provide continuous support and guidance.",
      icon: RefreshCw,
      duration: "Annual",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      tasks: ["Annual reviews", "Plan updates", "Ongoing consultation"]
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Expert Guidance",
      description: "Work with certified estate planning professionals with decades of experience."
    },
    {
      icon: Shield,
      title: "Comprehensive Protection",
      description: "Protect your assets, family, and legacy with tailored legal strategies."
    },
    {
      icon: TrendingUp,
      title: "Tax Optimization",
      description: "Minimize estate taxes and maximize wealth transfer to beneficiaries."
    },
    {
      icon: Target,
      title: "Personalized Approach",
      description: "Every plan is customized to your unique family and financial situation."
    }
  ];

  return (
    <ThreeColumnLayout activeMainItem="estate-planning" title="Estate Planning Services">
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Trusted Estate Planning Experts
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Secure Your Legacy
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Protect what matters most with our comprehensive estate planning solutions. Expert guidance, personalized strategies, and peace of mind for you and your family.
            </p>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Dialog open={showAdvisorDialog} onOpenChange={setShowAdvisorDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Free Consultation
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
                <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all duration-300">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started Today
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

        {/* Benefits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full mb-8 h-auto flex-col sm:flex-row bg-muted/50 p-1">
            <TabsTrigger value="services" className="flex-1 w-full sm:w-auto data-[state=active]:bg-background data-[state=active]:shadow-md">
              Our Services
            </TabsTrigger>
            <TabsTrigger value="process" className="flex-1 w-full sm:w-auto data-[state=active]:bg-background data-[state=active]:shadow-md">
              Our Process
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex-1 w-full sm:w-auto data-[state=active]:bg-background data-[state=active]:shadow-md">
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-8">
            {/* Secure Tax Return Analysis */}
            <div className="mb-8">
              <SecureTaxReturnAnalysis />
            </div>
            
            {/* Enhanced Services Grid */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center mb-8">Our Estate Planning Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card 
                    key={service.title} 
                    className={`h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      service.highlighted ? 'ring-2 ring-primary/20 border-primary/20' : ''
                    }`}
                  >
                    <CardHeader className="pb-4">
                      {service.highlighted && (
                        <Badge className="w-fit mb-2">Most Popular</Badge>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <service.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Includes:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button 
                        variant={service.highlighted ? "default" : "outline"} 
                        className="w-full" 
                        onClick={() => setShowInterestDialog(true)}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Why Choose Section */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Why Choose Our Estate Planning Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Personalized Approach",
                      description: "We take the time to understand your unique situation and create customized solutions that reflect your values and goals."
                    },
                    {
                      title: "Comprehensive Protection",
                      description: "Our holistic approach ensures all aspects of your estate and legacy are protected with legally sound strategies."
                    },
                    {
                      title: "Expert Guidance",
                      description: "Work with experienced professionals who specialize in estate planning and wealth preservation with proven track records."
                    }
                  ].map((item, i) => (
                    <div key={i} className="text-center space-y-3">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="space-y-8">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Our Estate Planning Process</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  A comprehensive, step-by-step approach to securing your legacy and protecting what matters most. Our proven process ensures nothing is overlooked.
                </p>
              </div>

              {/* Enhanced Timeline Layout */}
              <div className="relative max-w-6xl mx-auto">
                {/* Vertical line for desktop */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 h-full rounded-full"></div>
                
                <div className="space-y-12">
                  {processSteps.map((step, index) => (
                    <div key={step.step} className="relative">
                      {/* Desktop Layout */}
                      <div className="hidden lg:flex items-center">
                        {/* Left side content (odd steps) */}
                        {index % 2 === 0 && (
                          <div className="w-1/2 pr-12 text-right">
                            <Card className="ml-auto max-w-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <CardContent className="p-8">
                                <div className="flex items-center justify-end gap-4 mb-4">
                                  <div>
                                    <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                                    <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                                  </div>
                                  <div className={`p-4 rounded-xl ${step.color} text-white shadow-lg`}>
                                    <step.icon className="h-6 w-6" />
                                  </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                                <div className="space-y-2">
                                  {step.tasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center justify-end gap-2 text-sm">
                                      <span className="text-muted-foreground">{task}</span>
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Center timeline node */}
                        <div className="relative z-10 flex items-center justify-center">
                          <div className={`w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-lg shadow-xl border-4 border-background`}>
                            {step.step}
                          </div>
                        </div>

                        {/* Right side content (even steps) */}
                        {index % 2 === 1 && (
                          <div className="w-1/2 pl-12">
                            <Card className="mr-auto max-w-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className={`p-4 rounded-xl ${step.color} text-white shadow-lg`}>
                                    <step.icon className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                                    <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                                  </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                                <div className="space-y-2">
                                  {step.tasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-muted-foreground">{task}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Empty space for alternating layout */}
                        {index % 2 === 0 && <div className="w-1/2 pl-12"></div>}
                        {index % 2 === 1 && <div className="w-1/2 pr-12"></div>}
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${step.color} text-white flex-shrink-0 shadow-lg`}>
                                <step.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`w-8 h-8 rounded-full ${step.color} text-white text-sm flex items-center justify-center font-bold shadow-lg`}>
                                    {step.step}
                                  </span>
                                  <h3 className="font-bold text-lg">{step.title}</h3>
                                  <Badge variant="outline" className="text-xs ml-auto">{step.duration}</Badge>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                                <div className="space-y-2">
                                  {step.tasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-muted-foreground">{task}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center pt-8">
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Estate Planning Journey?</h3>
                    <p className="text-muted-foreground mb-6">
                      Let our experienced team guide you through each step of securing your legacy and protecting your family's future.
                    </p>
                    <Button size="lg" onClick={() => setShowInterestDialog(true)} className="shadow-lg">
                      Start Your Plan Today
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
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
