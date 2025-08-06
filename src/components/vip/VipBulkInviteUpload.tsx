import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  FileText, 
  Trash2, 
  Eye,
  Edit3,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VipContact {
  id?: string;
  name: string;
  email: string;
  firm: string;
  persona_type: string;
  linkedin_url?: string;
  phone?: string;
  specialty?: string;
  location?: string;
  source?: string;
  batch_name?: string;
  errors?: string[];
}

interface VipBulkInviteUploadProps {
  onUploadComplete: () => void;
  availablePersonas: string[];
}

const PERSONA_DISPLAY_NAMES = {
  advisor: 'Financial Advisor',
  attorney: 'Legal Counsel',
  cpa: 'CPA',
  accountant: 'Accountant',
  insurance_agent: 'Insurance Professional',
  consultant: 'Consultant',
  coach: 'Coach',
  healthcare_consultant: 'Healthcare Consultant'
};

export const VipBulkInviteUpload: React.FC<VipBulkInviteUploadProps> = ({
  onUploadComplete,
  availablePersonas
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [contacts, setContacts] = useState<VipContact[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [defaultBatch, setDefaultBatch] = useState('');
  const [defaultPersona, setDefaultPersona] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      toast.error('CSV must contain at least a header row and one data row');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredFields = ['name', 'email'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    const parsedContacts: VipContact[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const contact: VipContact = {
        name: '',
        email: '',
        firm: '',
        persona_type: defaultPersona || 'advisor',
        batch_name: defaultBatch || `Batch-${new Date().toISOString().split('T')[0]}`,
        errors: []
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'name':
            contact.name = value;
            break;
          case 'email':
            contact.email = value;
            break;
          case 'firm':
          case 'company':
          case 'organization':
            contact.firm = value;
            break;
          case 'persona':
          case 'persona_type':
          case 'type':
            if (value && availablePersonas.includes(value.toLowerCase())) {
              contact.persona_type = value.toLowerCase();
            }
            break;
          case 'linkedin':
          case 'linkedin_url':
            contact.linkedin_url = value;
            break;
          case 'phone':
          case 'phone_number':
            contact.phone = value;
            break;
          case 'specialty':
          case 'specialization':
            contact.specialty = value;
            break;
          case 'location':
          case 'city':
          case 'state':
            contact.location = value;
            break;
          case 'source':
            contact.source = value;
            break;
          case 'batch':
          case 'batch_name':
            if (value) contact.batch_name = value;
            break;
        }
      });

      // Validation
      if (!contact.name) contact.errors?.push('Name is required');
      if (!contact.email || !isValidEmail(contact.email)) {
        contact.errors?.push('Valid email is required');
      }
      if (!contact.firm) contact.errors?.push('Firm/Company is required');

      // Auto-detect persona from title/firm if not set
      if (!contact.persona_type || contact.persona_type === 'advisor') {
        contact.persona_type = detectPersonaFromTitle(contact.name, contact.firm);
      }

      parsedContacts.push(contact);
    }

    setContacts(parsedContacts);
    setShowPreview(true);
    toast.success(`Parsed ${parsedContacts.length} contacts from CSV`);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const detectPersonaFromTitle = (name: string, firm: string): string => {
    const text = (name + ' ' + firm).toLowerCase();
    
    if (text.includes('attorney') || text.includes('lawyer') || text.includes('law') || text.includes('legal')) {
      return 'attorney';
    }
    if (text.includes('cpa') || text.includes('accountant') || text.includes('tax')) {
      return 'cpa';
    }
    if (text.includes('insurance') || text.includes('agent')) {
      return 'insurance_agent';
    }
    if (text.includes('consultant') || text.includes('consulting')) {
      return 'consultant';
    }
    if (text.includes('coach') || text.includes('coaching')) {
      return 'coach';
    }
    if (text.includes('health') || text.includes('medical') || text.includes('doctor') || text.includes('clinic')) {
      return 'healthcare_consultant';
    }
    
    return 'advisor'; // Default
  };

  const updateContact = (index: number, field: keyof VipContact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    
    // Re-validate
    const errors: string[] = [];
    if (!updated[index].name) errors.push('Name is required');
    if (!updated[index].email || !isValidEmail(updated[index].email)) {
      errors.push('Valid email is required');
    }
    if (!updated[index].firm) errors.push('Firm/Company is required');
    
    updated[index].errors = errors;
    setContacts(updated);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const uploadContacts = async () => {
    const validContacts = contacts.filter(c => !c.errors || c.errors.length === 0);
    
    if (validContacts.length === 0) {
      toast.error('No valid contacts to upload');
      return;
    }

    setUploading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('bulk-create-vip-invites', {
        body: { contacts: validContacts }
      });

      if (error) throw error;

      toast.success(`Successfully uploaded ${validContacts.length} VIP invitations`);
      setContacts([]);
      setShowPreview(false);
      onUploadComplete();
      
    } catch (error) {
      console.error('Error uploading contacts:', error);
      toast.error('Failed to upload contacts');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'name',
      'email', 
      'firm',
      'persona_type',
      'linkedin_url',
      'phone',
      'specialty',
      'location',
      'source',
      'batch_name'
    ];
    
    const sampleData = [
      'John Doe',
      'john@wealthpro.com',
      'WealthPro Advisors',
      'advisor',
      'https://linkedin.com/in/johndoe',
      '+1-555-0123',
      'Retirement Planning',
      'New York, NY',
      'LinkedIn',
      'Founding-100-Advisors'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'vip-invite-template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const validCount = contacts.filter(c => !c.errors || c.errors.length === 0).length;
  const errorCount = contacts.length - validCount;

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk VIP Invite Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Batch Name</Label>
                <Input
                  value={defaultBatch}
                  onChange={(e) => setDefaultBatch(e.target.value)}
                  placeholder={`Batch-${new Date().toISOString().split('T')[0]}`}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Persona Type</Label>
                <Select value={defaultPersona} onValueChange={setDefaultPersona}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePersonas.map(persona => (
                      <SelectItem key={persona} value={persona}>
                        {PERSONA_DISPLAY_NAMES[persona as keyof typeof PERSONA_DISPLAY_NAMES] || persona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drag & drop your CSV file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="csv-upload"
                />
                <div className="flex gap-2 justify-center mt-4">
                  <Button asChild variant="outline">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">CSV Format Requirements:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Required fields:</strong> name, email</li>
                <li>• <strong>Optional fields:</strong> firm, persona_type, linkedin_url, phone, specialty, location, source, batch_name</li>
                <li>• Persona types will be auto-detected from titles/firms if not specified</li>
                <li>• Use the template above for proper formatting</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Review & Edit Contacts ({contacts.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                {validCount > 0 && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {validCount} Valid
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errorCount} Errors
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {contacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`border rounded-lg p-4 ${
                      contact.errors && contact.errors.length > 0 
                        ? 'border-destructive bg-destructive/5' 
                        : 'border-border'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateContact(index, 'name', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Email</Label>
                        <Input
                          value={contact.email}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Firm</Label>
                        <Input
                          value={contact.firm}
                          onChange={(e) => updateContact(index, 'firm', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Persona</Label>
                        <Select 
                          value={contact.persona_type} 
                          onValueChange={(value) => updateContact(index, 'persona_type', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePersonas.map(persona => (
                              <SelectItem key={persona} value={persona}>
                                {PERSONA_DISPLAY_NAMES[persona as keyof typeof PERSONA_DISPLAY_NAMES] || persona}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {contact.errors && contact.errors.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {contact.errors.join(', ')}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {contact.batch_name}
                        </Badge>
                        {contact.specialty && (
                          <Badge variant="secondary" className="text-xs">
                            {contact.specialty}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back to Upload
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setContacts([]);
                    setShowPreview(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={uploadContacts}
                  disabled={uploading || validCount === 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {uploading ? 'Uploading...' : `Upload ${validCount} Valid Contacts`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};