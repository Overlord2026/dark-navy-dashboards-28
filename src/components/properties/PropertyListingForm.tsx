import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImagePlus, FileText, AlertTriangle, Users } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

interface PropertyListingFormData {
  listingType: "fsbo" | "with_pro";
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  askingPrice: number;
  description: string;
  features: string[];
  visibility: "private" | "public";
  invitePro: boolean;
  selectedProId?: string;
  photos: File[];
  documents: File[];
}

interface PropertyListingFormProps {
  onSubmit?: (data: PropertyListingFormData) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const PropertyListingForm: React.FC<PropertyListingFormProps> = ({ onSubmit, onCancel, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  
  const form = useForm<PropertyListingFormData>({
    defaultValues: {
      listingType: "fsbo",
      visibility: "private",
      invitePro: false,
      features: [],
      bedrooms: 1,
      bathrooms: 1,
      photos: [],
      documents: []
    }
  });

  const watchListingType = form.watch("listingType");
  const watchVisibility = form.watch("visibility");

  const handlePhotoUpload = (files: FileList | null) => {
    if (files) {
      setPhotos(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (files) {
      setDocuments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = (data: PropertyListingFormData) => {
    if (onSubmit) {
      onSubmit({ ...data, photos, documents });
    }
    toast.success("Property listing created successfully!");
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Listing Type */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Listing Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-4"
                        >
                          <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                            <RadioGroupItem value="fsbo" id="fsbo" />
                            <div className="flex-1">
                              <label htmlFor="fsbo" className="font-medium cursor-pointer">
                                List Myself (For Sale By Owner)
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Save on commission fees and maintain full control
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                            <RadioGroupItem value="with_pro" id="with_pro" />
                            <div className="flex-1">
                              <label htmlFor="with_pro" className="font-medium cursor-pointer">
                                List with a Professional
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Get expert guidance and marketing support
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={nextStep} className="w-full">
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State 12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single_family">Single Family Home</SelectItem>
                            <SelectItem value="condo">Condominium</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="multi_family">Multi-Family</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="askingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asking Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="750000" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sq Ft</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearBuilt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Built</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your property's key features, location benefits, and unique selling points..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Photos & Documents */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos & Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <Label>Property Photos</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <label htmlFor="photos" className="cursor-pointer">
                        <span className="font-medium text-primary">Upload photos</span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </label>
                      <input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e.target.files)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                  {photos.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">{photos.length} photos selected</p>
                    </div>
                  )}
                </div>

                {/* Document Upload */}
                <div>
                  <Label>Documents (Optional)</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <label htmlFor="documents" className="cursor-pointer">
                        <span className="font-medium text-primary">Upload documents</span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </label>
                      <input
                        id="documents"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e.target.files)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Floor plans, disclosures, reports</p>
                  </div>
                  {documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">{documents.length} documents selected</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Visibility & Professional */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Visibility & Professional Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Visibility</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-4"
                        >
                          <div className="flex items-center space-x-2 p-4 border rounded-lg">
                            <RadioGroupItem value="private" id="private" />
                            <div className="flex-1">
                              <label htmlFor="private" className="font-medium cursor-pointer">
                                Private (Family Office Members Only)
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Only visible to verified family office members
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg">
                            <RadioGroupItem value="public" id="public" />
                            <div className="flex-1">
                              <label htmlFor="public" className="font-medium cursor-pointer">
                                Public Marketplace
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Visible to all marketplace users
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchListingType === "with_pro" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Select a Professional</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose from our verified real estate professionals
                    </p>
                    {/* Professional selection would go here */}
                    <Button type="button" variant="outline" className="w-full">
                      Browse Professionals
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Legal & Preview */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Legal Disclaimers & Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {watchListingType === "fsbo" && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important Legal Notice:</strong> You are listing this property without a licensed real estate broker. 
                      We recommend consulting with legal and financial professionals regarding contracts, disclosures, and regulations.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="legal-agreement" required />
                    <label htmlFor="legal-agreement" className="text-sm font-medium">
                      I understand the legal implications and take full responsibility for this listing
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="accuracy" required />
                    <label htmlFor="accuracy" className="text-sm font-medium">
                      All information provided is accurate to the best of my knowledge
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Listing Preview</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {watchListingType === "fsbo" ? "For Sale By Owner" : "With Professional"}</p>
                    <p><strong>Visibility:</strong> {watchVisibility === "private" ? "Private" : "Public"}</p>
                    <p><strong>Address:</strong> {form.watch("address") || "Not specified"}</p>
                    <p><strong>Price:</strong> ${form.watch("askingPrice")?.toLocaleString() || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Publish Listing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
};