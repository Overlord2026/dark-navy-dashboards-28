
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent } from "@/components/ui/card";

export function PracticeDetailsForm() {
  const [practiceDetails, setPracticeDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    logo: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPracticeDetails({
      ...practiceDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoUpload = (file: File) => {
    setPracticeDetails({
      ...practiceDetails,
      logo: file,
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Practice Details</h2>
        <p className="text-gray-400">
          Add information about your practice that will be visible to clients
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="practice-logo">Practice Logo</Label>
          <div className="flex items-center gap-4">
            {practiceDetails.logo && (
              <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                <img 
                  src={URL.createObjectURL(practiceDetails.logo)} 
                  alt="Practice logo preview" 
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <FileUpload
              onUpload={handleLogoUpload}
              accept="image/*"
              maxSize={5242880}
              className="w-full"
            />
          </div>
          <p className="text-xs text-gray-400">Max file size: 5MB. Recommended dimensions: 200x200px.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Practice Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your practice name"
            value={practiceDetails.name}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea
            id="address"
            name="address"
            placeholder="Enter your business address"
            value={practiceDetails.address}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={practiceDetails.phone}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@yourfirm.com"
              value={practiceDetails.email}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            name="website"
            placeholder="https://www.yourfirm.com"
            value={practiceDetails.website}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Practice Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell clients about your practice, specialties, and approach"
            value={practiceDetails.description}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 min-h-[120px]"
          />
        </div>
      </div>

      <Card className="bg-yellow-500/10 border border-yellow-500/30">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-400">
            <strong>Note:</strong> This information will be displayed on your client-facing portal. 
            Make sure all details are accurate and professional.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
