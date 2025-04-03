
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AdvisorInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  serviceEmail?: string;
  phone: string;
  office: string;
  bio: string;
  linkedin?: string;
  hometown?: string;
}

interface AdvisorProfileEditFormProps {
  advisorInfo: AdvisorInfo;
  onSave: (advisorInfo: AdvisorInfo) => void;
  onCancel: () => void;
}

export const AdvisorProfileEditForm = ({
  advisorInfo,
  onSave,
  onCancel
}: AdvisorProfileEditFormProps) => {
  const [formData, setFormData] = useState<AdvisorInfo>({...advisorInfo});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.title) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would save to a database
    setTimeout(() => {
      onSave(formData);
      
      // Disable toast to prevent ghost notifications
      // toast.success("Advisor profile updated successfully");
      
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serviceEmail">Service Email</Label>
          <Input
            id="serviceEmail"
            name="serviceEmail"
            type="email"
            value={formData.serviceEmail || ""}
            onChange={handleChange}
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin || ""}
            onChange={handleChange}
            className="bg-[#1c2e4a] border-gray-700"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Current Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="office">Office</Label>
          <Input
            id="office"
            name="office"
            value={formData.office}
            onChange={handleChange}
            className="bg-[#1c2e4a] border-gray-700"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hometown">Hometown</Label>
        <Input
          id="hometown"
          name="hometown"
          value={formData.hometown || ""}
          onChange={handleChange}
          className="bg-[#1c2e4a] border-gray-700"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="bg-[#1c2e4a] border-gray-700 min-h-[150px]"
          rows={6}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-700"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
