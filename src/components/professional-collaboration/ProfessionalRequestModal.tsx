import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfessionalCollaboration, CreateCollaborationRequest } from '@/hooks/useProfessionalCollaboration';
import { Calendar, Clock, MessageSquare, Users } from 'lucide-react';

interface ProfessionalRequestModalProps {
  open: boolean;
  onClose: () => void;
  toolData?: any;
  defaultRequestType?: 'estate_review' | 'swag_analysis_review' | 'tax_planning' | 'insurance_review';
  defaultProfessionalType?: 'advisor' | 'attorney' | 'accountant' | 'insurance_agent';
}

export const ProfessionalRequestModal: React.FC<ProfessionalRequestModalProps> = ({
  open,
  onClose,
  toolData,
  defaultRequestType,
  defaultProfessionalType
}) => {
  const { createCollaborationRequest, loading } = useProfessionalCollaboration();
  
  const [formData, setFormData] = useState<CreateCollaborationRequest>({
    professional_type: defaultProfessionalType || 'advisor',
    request_type: defaultRequestType || 'swag_analysis_review',
    tool_data: toolData,
    message: '',
    due_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCollaborationRequest(formData);
      onClose();
      // Reset form
      setFormData({
        professional_type: defaultProfessionalType || 'advisor',
        request_type: defaultRequestType || 'swag_analysis_review',
        tool_data: toolData,
        message: '',
        due_date: '',
      });
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const professionalTypes = [
    { value: 'advisor', label: 'Financial Advisor', icon: '💼' },
    { value: 'attorney', label: 'Estate Attorney', icon: '⚖️' },
    { value: 'accountant', label: 'CPA/Tax Professional', icon: '📊' },
    { value: 'insurance_agent', label: 'Insurance Specialist', icon: '🛡️' }
  ];

  const requestTypes = [
    { value: 'swag_analysis_review', label: 'SWAG™ Analysis Review', description: 'Review retirement roadmap and provide recommendations' },
    { value: 'estate_review', label: 'Estate Plan Review', description: 'Review estate planning documents and provide legal guidance' },
    { value: 'tax_planning', label: 'Tax Planning Review', description: 'Review tax situation and provide optimization strategies' },
    { value: 'insurance_review', label: 'Insurance Review', description: 'Analyze insurance coverage and recommend improvements' }
  ];

  const selectedProfessional = professionalTypes.find(p => p.value === formData.professional_type);
  const selectedRequestType = requestTypes.find(r => r.value === formData.request_type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Request Professional Review
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Professional Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Professional Type</Label>
            <div className="grid grid-cols-2 gap-4">
              {professionalTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-all ${
                    formData.professional_type === type.value 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setFormData({ ...formData, professional_type: type.value as any })}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium text-sm">{type.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Request Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Review Type</Label>
            <Select 
              value={formData.request_type} 
              onValueChange={(value) => setFormData({ ...formData, request_type: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select review type" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Request Summary */}
          <Card className="bg-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Request Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{selectedProfessional?.label}</Badge>
                <Badge variant="outline">{selectedRequestType?.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedRequestType?.description}
              </p>
              {toolData && (
                <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary">
                    Your tool data will be shared with the professional for review
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add any specific questions or context for the professional..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Timeline (Optional)
            </Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending Request...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};