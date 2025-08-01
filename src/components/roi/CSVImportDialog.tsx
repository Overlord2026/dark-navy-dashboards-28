import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CSVImportDialog({ open, onOpenChange }: CSVImportDialogProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [importType, setImportType] = React.useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !importType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and import type.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement CSV import logic
    toast({
      title: "Import Started",
      description: "Your CSV file is being processed.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import CSV Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import leads or campaign data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="importType">Import Type</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select what to import" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="campaigns">Campaigns</SelectItem>
                <SelectItem value="both">Both Leads & Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="csvFile"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> CSV file
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-gray-500">{selectedFile.name}</p>
                  )}
                </div>
                <input
                  id="csvFile"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2">CSV Format Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Leads: name, email, phone, stage, source</li>
              <li>Campaigns: name, source, spend, start_date, end_date</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || !importType}>
              Import Data
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}