import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export function UploadDocumentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Error",
        description: "Please select a document category",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setFile(null);
    setCategory("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="col-span-4">
              Select File
            </Label>
            <Input 
              id="file" 
              type="file" 
              className="col-span-4" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="col-span-4">
              Document Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="will">Will</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
                <SelectItem value="power-of-attorney">Power of Attorney</SelectItem>
                <SelectItem value="healthcare-directive">Healthcare Directive</SelectItem>
                <SelectItem value="insurance">Insurance Policies</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="col-span-4">
              Description (Optional)
            </Label>
            <Textarea 
              id="description" 
              className="col-span-4" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional details about this document"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDocumentDialog({ open, onClose, documentId }: { open: boolean; onClose: () => void; documentId: string }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      toast({
        title: "Success",
        description: `Document shared with ${email}`,
      });
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setEmail("");
    setPermission("view");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="col-span-4">
              Email Address
            </Label>
            <Input 
              id="email" 
              type="email" 
              className="col-span-4" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recipient's email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="permission" className="col-span-4">
              Permission Level
            </Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="comment">Can Comment</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSharing}>
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TaxReturnUploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [taxYear, setTaxYear] = useState("");
  const [filingStatus, setFilingStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a tax return file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!taxYear) {
      toast({
        title: "Error",
        description: "Please enter the tax year",
        variant: "destructive",
      });
      return;
    }

    if (!filingStatus) {
      toast({
        title: "Error",
        description: "Please select your filing status",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Success",
        description: "Tax return uploaded successfully. Your advisor has been notified.",
      });
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setFile(null);
    setTaxYear("");
    setFilingStatus("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Tax Return</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="col-span-4">
              Select Tax Return File
            </Label>
            <Input 
              id="file" 
              type="file" 
              className="col-span-4" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tax-year" className="col-span-4">
              Tax Year
            </Label>
            <Input 
              id="tax-year" 
              type="text" 
              className="col-span-4"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              placeholder="E.g., 2023"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filing-status" className="col-span-4">
              Filing Status
            </Label>
            <Select value={filingStatus} onValueChange={setFilingStatus}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                <SelectItem value="head-household">Head of Household</SelectItem>
                <SelectItem value="qualifying-widow">Qualifying Widow(er)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="col-span-4">
              Additional Notes (Optional)
            </Label>
            <Textarea 
              id="notes" 
              className="col-span-4" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant details or questions for your advisor"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Tax Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
