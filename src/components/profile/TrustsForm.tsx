
import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Plus, Minus, ChevronDown, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  documentType: z.string().min(1, { message: "Document type is required" }),
});

export function TrustsForm({ onSave }: { onSave: () => void }) {
  const [trusts, setTrusts] = useState<z.infer<typeof trustSchema>[]>([]);
  const [currentTrust, setCurrentTrust] = useState<z.infer<typeof trustSchema> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{trustId: number, file: File}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof trustSchema>>({
    resolver: zodResolver(trustSchema),
    defaultValues: {
      trustName: "",
      country: "United States",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      documentType: "Trust Formation Document",
    },
  });

  function onSubmit(values: z.infer<typeof trustSchema>) {
    if (currentTrust) {
      // Update existing trust
      setTrusts(prev => 
        prev.map(t => 
          t === currentTrust ? values : t
        )
      );
      setCurrentTrust(null);
    } else {
      // Add new trust
      setTrusts(prev => [...prev, values]);
      
      // If a file was selected, associate it with this trust
      if (selectedFile) {
        setUploadedFiles(prev => [...prev, {
          trustId: trusts.length, // This will be the index of the new trust
          file: selectedFile
        }]);

        toast({
          title: "File uploaded",
          description: `${selectedFile.name} has been attached to the trust`
        });
      }
    }
    
    form.reset({
      trustName: "",
      country: "United States",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      documentType: "Trust Formation Document",
    });
    
    setSelectedFile(null);
    onSave();
  }

  function handleRemoveTrust(trust: z.infer<typeof trustSchema>) {
    setTrusts(prev => prev.filter(t => t !== trust));
    if (currentTrust === trust) {
      setCurrentTrust(null);
      form.reset({
        trustName: "",
        country: "United States",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: "",
        documentType: "Trust Formation Document",
      });
    }
  }

  function handleEditTrust(trust: z.infer<typeof trustSchema>) {
    setCurrentTrust(trust);
    form.reset(trust);
  }
  
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} is ready to be uploaded`
      });
    }
  }

  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} is ready to be uploaded`
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Trusts</h2>
        <p className="text-sm text-gray-400">
          Have a trust in mind for an account or want to make an update? Please add the necessary info for your trust below.
        </p>
      </div>
      
      {trusts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-white">Trust</h3>
          </div>
          
          <div className="flex items-center justify-between border border-gray-700 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Select defaultValue="new">
                <SelectTrigger className="w-[120px] bg-transparent border-gray-700 text-white focus:ring-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                  <SelectItem value="new">New</SelectItem>
                  {trusts.map((trust, i) => (
                    <SelectItem key={i} value={`trust-${i}`}>
                      {trust.trustName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRemoveTrust(trusts[0])}
                className="border-gray-700 text-white hover:bg-gray-800 rounded-full p-0 w-7 h-7 flex items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800 rounded-full p-0 w-7 h-7 flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="trustName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Trust Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John's Trust" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Country</FormLabel>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-gray-700 text-white focus:ring-0 flex-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-gray-200 text-black h-10 w-10 p-0 flex items-center justify-center"
                    >
                      US
                    </Button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Hancock St" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">City</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Los Angeles" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">State</FormLabel>
                  <div className="relative">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-gray-700 text-white focus:ring-0">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Zip Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="bg-transparent border border-r-0 border-gray-700 text-white rounded-l-md px-3 flex items-center">
                        +1
                      </div>
                      <Input 
                        placeholder="123-456-7890" 
                        {...field} 
                        className="bg-transparent border-gray-700 text-white focus:border-blue-500 rounded-l-none" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="johngaydoe@email.com" 
                      {...field} 
                      className="bg-transparent border-gray-700 text-white focus:border-blue-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Document Type 1</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-gray-700 text-white focus:ring-0">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0F0F2D] border-gray-700 text-white">
                      <SelectItem value="Trust Formation Document">Trust Formation Document</SelectItem>
                      <SelectItem value="Trust Amendment">Trust Amendment</SelectItem>
                      <SelectItem value="Trust Certificate">Trust Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div 
              className={`mt-4 border border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-600'} rounded-lg p-6 text-center cursor-pointer`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept=".pdf,.doc,.docx" 
              />
              <div className="flex items-center justify-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={!!selectedFile} readOnly />
                <p className="text-white">Drop pdf file here or <span className="text-green-500 font-medium cursor-pointer">browse</span></p>
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-blue-400">
                  <p>Selected file: {selectedFile.name}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
