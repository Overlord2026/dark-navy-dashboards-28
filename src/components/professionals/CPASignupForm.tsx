
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schema for CPA signup
const cpaSignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Firm name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please provide a valid address" }),
  phone: z.string().min(5, { message: "Please provide a valid phone number" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  website: z.string().url({ message: "Please provide a valid website URL" }).optional().or(z.literal("")),
  certifications: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  acceptReferrals: z.boolean().default(false),
  collaborateWithRIA: z.boolean().default(false),
  practiceSoftware: z.string().optional(),
  notes: z.string().optional(),
});

type CPAFormValues = z.infer<typeof cpaSignupSchema>;

const defaultSpecialties = [
  "Business Tax",
  "Personal Tax",
  "Tax Planning",
  "Auditing",
  "Bookkeeping",
  "Financial Statements",
  "Payroll Services",
  "CFO Services",
  "Nonprofit Accounting",
  "International Tax",
];

export function CPASignupForm() {
  const { addProfessional } = useProfessionals();
  const { toast } = useToast();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");

  const form = useForm<CPAFormValues>({
    resolver: zodResolver(cpaSignupSchema),
    defaultValues: {
      name: "",
      company: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      acceptReferrals: false,
      collaborateWithRIA: false,
      practiceSoftware: "",
      notes: "",
      specialties: [],
    },
  });

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  const addCustomSpecialty = () => {
    if (newSpecialty && !selectedSpecialties.includes(newSpecialty)) {
      setSelectedSpecialties(prev => [...prev, newSpecialty]);
      setNewSpecialty("");
    }
  };

  const onSubmit = (data: CPAFormValues) => {
    // Add specialties to form data
    data.specialties = selectedSpecialties;
    
    // Create new professional record
    const newProfessional = {
      id: uuidv4(),
      name: data.name,
      type: "Tax Professional / Accountant" as const,
      company: data.company,
      phone: data.phone,
      email: data.email,
      website: data.website || undefined,
      address: data.address,
      notes: data.notes,
      specialties: data.specialties,
      certifications: ["CPA License"],
    };

    // Add to database
    addProfessional(newProfessional);
    
    // Show success message
    toast({
      title: "Profile Created",
      description: "Your CPA profile has been successfully created!",
    });
    
    console.log("CPA profile created:", newProfessional);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle>Certified Public Accountant Registration</CardTitle>
          <CardDescription>
            Create your professional profile to connect with clients and other professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal & Firm Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith Accounting Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address*</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number*</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address*</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.yourfirm.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specialties & Services</h3>
                <div>
                  <div className="mb-2">Select your specialties:</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {defaultSpecialties.map(specialty => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`specialty-${specialty}`} 
                          checked={selectedSpecialties.includes(specialty)}
                          onCheckedChange={() => handleSpecialtyToggle(specialty)}
                        />
                        <label 
                          htmlFor={`specialty-${specialty}`}
                          className="text-sm cursor-pointer"
                        >
                          {specialty}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-end gap-2 mb-2">
                    <div className="flex-1">
                      <label htmlFor="custom-specialty" className="text-sm block mb-1">
                        Add a custom specialty
                      </label>
                      <Input
                        id="custom-specialty"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="E.g., Estate Taxation"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addCustomSpecialty}
                      disabled={!newSpecialty}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {selectedSpecialties.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm mb-1">Selected specialties:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecialties.map(specialty => (
                          <div 
                            key={specialty}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
                          >
                            {specialty}
                            <button
                              type="button"
                              className="ml-1 text-xs"
                              onClick={() => handleSpecialtyToggle(specialty)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="practiceSoftware"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Management/Invoicing Software (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select software or leave blank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="quickbooks">QuickBooks</SelectItem>
                          <SelectItem value="xero">Xero</SelectItem>
                          <SelectItem value="freshbooks">FreshBooks</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                          <SelectItem value="taxdome">TaxDome</SelectItem>
                          <SelectItem value="canopy">Canopy</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        We can integrate with your software for seamless client management
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Collaboration Preferences</h3>
                
                <FormField
                  control={form.control}
                  name="acceptReferrals"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Accept Referrals for Financial Planning</FormLabel>
                        <FormDescription>
                          Allow other professionals to refer clients to you for financial planning
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="collaborateWithRIA"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Collaborate with RIAs</FormLabel>
                        <FormDescription>
                          Indicate interest in collaborating with Registered Investment Advisors
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share additional details about your practice, experience, or services..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Create Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
