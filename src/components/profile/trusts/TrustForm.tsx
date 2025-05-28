import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText, Download } from "lucide-react";
import { US_STATES } from "./constants";
import { TrustFormData, Trust } from "./types";

interface TrustFormProps {
  form: UseFormReturn<TrustFormData>;
  onSubmit: (values: TrustFormData) => void;
  isLoading: boolean;
  editingTrust: Trust | null;
  onCancelEdit: () => void;
  selectedFile: File | null;
  onFileChange: (file: File) => void;
}

export function TrustForm({ 
  form, 
  onSubmit, 
  isLoading, 
  editingTrust, 
  onCancelEdit, 
  selectedFile, 
  onFileChange 
}: TrustFormProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadExistingDocument = (trustDocument: any) => {
    try {
      console.log('Starting download for existing document:', trustDocument.file_name);
      
      // For now, we'll create a blob with some sample content since we don't have actual file storage
      // In a real implementation, you would fetch the file from Supabase Storage
      const sampleContent = `This is a placeholder for ${trustDocument.file_name}`;
      const blob = new Blob([sampleContent], { type: trustDocument.content_type || 'application/octet-stream' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = trustDocument.file_name;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="border-t border-border pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">
          {editingTrust ? "Edit Trust" : "Add New Trust"}
        </h3>
        {editingTrust && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancelEdit}
            className="text-muted-foreground border-border hover:bg-muted"
          >
            Cancel Edit
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trustName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Trust Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John's Trust" 
                      {...field} 
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Country *</FormLabel>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border text-foreground flex-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-background border-border text-foreground h-10 w-10 p-0 flex items-center justify-center"
                    >
                      US
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Hancock St" 
                      {...field} 
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">City *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Los Angeles" 
                      {...field} 
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">State *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border max-h-60 overflow-y-auto">
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Zip Code *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345" 
                      {...field} 
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Phone Number *</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="bg-background border border-r-0 border-border text-foreground rounded-l-md px-3 flex items-center">
                        +1
                      </div>
                      <Input 
                        placeholder="123-456-7890" 
                        {...field} 
                        className="bg-background border-border text-foreground rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="johngaydoe@email.com" 
                      {...field} 
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Document Type 1 *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="Trust Formation Document">Trust Formation Document</SelectItem>
                    <SelectItem value="Trust Amendment">Trust Amendment</SelectItem>
                    <SelectItem value="Trust Certificate">Trust Certificate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Show existing documents when editing */}
          {editingTrust && editingTrust.documents && editingTrust.documents.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Existing Documents</label>
              <div className="space-y-2">
                {editingTrust.documents.map((trustDocument) => (
                  <div key={trustDocument.id} className="flex items-center justify-between border rounded-md p-3 bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-foreground">{trustDocument.file_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(trustDocument.file_size)} • {trustDocument.content_type}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadExistingDocument(trustDocument)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {editingTrust ? "Upload Additional Document" : "Upload Document"}
            </label>
            <FileUpload
              onFileChange={onFileChange}
              accept=".pdf,.doc,.docx"
              className="border-dashed border-border rounded-lg p-6"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : editingTrust ? "Update Trust" : "Add Trust"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
