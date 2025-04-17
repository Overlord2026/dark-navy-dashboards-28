
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhyChooseUs } from "@/components/estate-planning/WhyChooseUs";
import { FamilyLegacyBox } from "@/components/estate-planning/FamilyLegacyBox";
import { ServicesSection } from "@/components/estate-planning/ServicesSection";
import { InterestDialog } from "@/components/estate-planning/InterestDialog";

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
    console.log("Sending email to advisor with form data:", formData);
    console.log("Alerting advisor about interest:", formData);
    toast.success("Thank you for your interest! An advisor will contact you soon.");
    setShowInterestDialog(false);
  };

  const handleScheduleAppointment = () => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page");
  };

  return (
    <ThreeColumnLayout activeMainItem="estate-planning" title="Estate Planning">
      <div className="space-y-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/50 p-6 sm:p-10 flex flex-col sm:flex-row gap-6 items-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Estate Planning Services</h1>
              <p className="text-muted-foreground">Secure your legacy and protect what matters most with our comprehensive estate planning solutions.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Our Estate Planning Expertise</h2>
              <p className="text-muted-foreground mt-1">
                Meet with our estate planning guru to create a comprehensive plan tailored to your needs.
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button className="w-full sm:w-auto" onClick={() => setShowAdvisorDialog(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setShowInterestDialog(true)}
              >
                I'm Interested
              </Button>
            </div>
          </div>

          <Tabs defaultValue="services" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="services" className="flex-1">Our Services</TabsTrigger>
              <TabsTrigger value="family-legacy-box" className="flex-1">Family Legacy Box</TabsTrigger>
              <TabsTrigger value="process" className="flex-1">Our Process</TabsTrigger>
              <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <ServicesSection onInterestClick={() => setShowInterestDialog(true)} />
            </TabsContent>

            <TabsContent value="family-legacy-box" className="space-y-6">
              <FamilyLegacyBox />
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold">Our Estate Planning Process</h3>
                  <div className="mt-4 space-y-6">
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
                        <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                          <span className="font-bold text-primary">{item.step}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleScheduleAppointment}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Estate Planning Guides</CardTitle>
                    <CardDescription>Free resources to help you understand estate planning</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      "Estate Planning 101: The Basics",
                      "Understanding Wills vs. Trusts",
                      "How to Choose an Executor",
                      "Estate Tax Planning Strategies",
                      "Digital Asset Protection Guide"
                    ].map((guide) => (
                      <div key={guide} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>{guide}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => toast.info("Downloading resources...")}>
                      Download Guides
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Family Legacy Box</CardTitle>
                    <CardDescription>Preserve your family history and values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
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
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
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

        <WhyChooseUs />

        <InterestDialog
          open={showInterestDialog}
          onOpenChange={setShowInterestDialog}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleShowInterest}
          services={[
            { title: "Family Legacy Box" },
            { title: "Will & Trust Creation" },
            { title: "Estate Tax Planning" }
          ]}
        />

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
                    <Button key={time} variant="outline" onClick={() => toast.info(`${time} selected`)}>
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdvisorDialog(false)}>Cancel</Button>
              <Button onClick={handleScheduleAppointment}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThreeColumnLayout>
  );
}
