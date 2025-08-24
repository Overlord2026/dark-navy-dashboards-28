/**
 * Universal notary request component for all personas
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Users, Clock, Shield } from 'lucide-react';
import { getRonRule, validateRonRequest } from '../states/ronRules';
import { recordDecisionRDS } from '@/lib/rds';
import { useToast } from '@/hooks/use-toast';

interface NotaryRequestProps {
  docId?: string;
  docName?: string;
  onSubmit?: (sessionId: string) => void;
  standalone?: boolean;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export function NotaryRequest({ docId, docName, onSubmit, standalone = false }: NotaryRequestProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    docId: docId || '',
    docName: docName || '',
    state: '',
    mode: 'RON' as 'RON' | 'IN_PERSON',
    signerName: '',
    signerEmail: '',
    signerPhone: '',
    govtIdType: 'drivers_license',
    witnessCount: 0,
    witnessType: 'platform' as 'platform' | 'user',
    witnessEmails: ['', ''],
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    agreedToTerms: false,
    agreedToRecording: false
  });

  const [ronRule, setRonRule] = useState(getRonRule(''));
  const [loading, setLoading] = useState(false);
  const [showWitnessDetails, setShowWitnessDetails] = useState(false);

  const handleStateChange = (state: string) => {
    setFormData(prev => ({ ...prev, state }));
    const rule = getRonRule(state);
    setRonRule(rule);
    
    // Auto-adjust mode if RON not allowed
    if (!rule.allowed && formData.mode === 'RON') {
      setFormData(prev => ({ ...prev, mode: 'IN_PERSON' }));
    }
    
    // Auto-set witness requirements
    if (rule.witnessPolicy !== 'none') {
      setShowWitnessDetails(true);
      setFormData(prev => ({ 
        ...prev, 
        witnessType: rule.witnessPolicy as 'platform' | 'user',
        witnessCount: rule.witnessPolicy === 'platform' ? 1 : 0 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.docId || !formData.docName || !formData.state || !formData.signerName || !formData.signerEmail) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.agreedToTerms) {
        throw new Error('Please agree to the terms and conditions');
      }

      if (formData.mode === 'RON' && !formData.agreedToRecording) {
        throw new Error('Recording consent required for remote notarization');
      }

      // Validate RON request
      const validation = validateRonRequest(formData.state, formData.mode);
      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      // Generate session ID
      const sessionId = `notary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Record Decision-RDS for notary request
      recordDecisionRDS({
        action: 'notary.request',
        sessionId,
        state: formData.state,
        mode: formData.mode,
        reasons: [
          'notarization_request',
          formData.mode.toLowerCase(),
          formData.state,
          ronRule.witnessPolicy !== 'none' ? 'witnesses_required' : 'no_witnesses',
          ronRule.kbaLevel !== 'none' ? 'kba_required' : 'no_kba'
        ],
        result: 'approve',
        metadata: {
          docId: formData.docId,
          docName: formData.docName,
          signerEmail: formData.signerEmail,
          witnessCount: formData.witnessCount,
          witnessType: formData.witnessType
        }
      });

      // Create notary session (stub - in production, save to database)
      console.log('[Notary Session Created]', {
        sessionId,
        docId: formData.docId,
        docName: formData.docName,
        state: formData.state,
        mode: formData.mode,
        signer: {
          name: formData.signerName,
          email: formData.signerEmail,
          phone: formData.signerPhone,
          govtIdType: formData.govtIdType
        },
        witnesses: formData.witnessCount > 0 ? {
          type: formData.witnessType,
          count: formData.witnessCount,
          emails: formData.witnessEmails.filter(email => email.trim())
        } : undefined,
        ronRule,
        scheduledAt: formData.preferredDate && formData.preferredTime ? 
          `${formData.preferredDate}T${formData.preferredTime}:00.000Z` : undefined
      });

      toast({
        title: "Notarization Requested",
        description: `Session ${sessionId} created successfully. You'll receive scheduling confirmation shortly.`
      });

      if (onSubmit) {
        onSubmit(sessionId);
      }

    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {standalone && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Professional Notarization</h1>
          <p className="text-muted-foreground">
            Secure remote online notarization (RON) and in-person services
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notarization Request
          </CardTitle>
          <CardDescription>
            Complete this form to request professional notarization services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Document Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docName">Document Name *</Label>
                  <Input
                    id="docName"
                    value={formData.docName}
                    onChange={(e) => setFormData(prev => ({ ...prev, docName: e.target.value }))}
                    placeholder="e.g., Power of Attorney"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="docId">Document ID</Label>
                  <Input
                    id="docId"
                    value={formData.docId}
                    onChange={(e) => setFormData(prev => ({ ...prev, docId: e.target.value }))}
                    placeholder="Internal document reference"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={handleStateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Notarization Method *</Label>
                  <Select 
                    value={formData.mode} 
                    onValueChange={(value: 'RON' | 'IN_PERSON') => setFormData(prev => ({ ...prev, mode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RON" disabled={!ronRule.allowed}>
                        Remote Online (RON)
                        {!ronRule.allowed && <Badge variant="secondary" className="ml-2">Not Available</Badge>}
                      </SelectItem>
                      <SelectItem value="IN_PERSON">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.state && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {formData.state} Requirements
                  </h4>
                  <div className="text-sm space-y-1">
                    {ronRule.allowed && formData.mode === 'RON' && (
                      <>
                        <p>✓ Remote Online Notarization available</p>
                        {ronRule.kbaLevel !== 'none' && <p>• Knowledge-based authentication required ({ronRule.kbaLevel.toUpperCase()})</p>}
                        {ronRule.idScanRequired && <p>• Government ID scan required</p>}
                        {ronRule.livenessRequired && <p>• Live identity verification required</p>}
                        {ronRule.witnessPolicy !== 'none' && <p>• Witnesses required ({ronRule.witnessPolicy})</p>}
                        {ronRule.eJournalRequired && <p>• Electronic journal entry required</p>}
                      </>
                    )}
                    {(!ronRule.allowed || formData.mode === 'IN_PERSON') && (
                      <p>• In-person notarization required</p>
                    )}
                    {ronRule.notes && (
                      <p className="text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {ronRule.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Signer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Signer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signerName">Full Name *</Label>
                  <Input
                    id="signerName"
                    value={formData.signerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, signerName: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signerEmail">Email Address *</Label>
                  <Input
                    id="signerEmail"
                    type="email"
                    value={formData.signerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, signerEmail: e.target.value }))}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signerPhone">Phone Number</Label>
                  <Input
                    id="signerPhone"
                    type="tel"
                    value={formData.signerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, signerPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="govtIdType">Government ID Type</Label>
                  <Select value={formData.govtIdType} onValueChange={(value) => setFormData(prev => ({ ...prev, govtIdType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="state_id">State ID</SelectItem>
                      <SelectItem value="military_id">Military ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Witnesses */}
            {(showWitnessDetails || ronRule.witnessPolicy !== 'none') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Witnesses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witnessCount">Number of Witnesses</Label>
                    <Select 
                      value={formData.witnessCount.toString()} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, witnessCount: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No witnesses</SelectItem>
                        <SelectItem value="1">1 witness</SelectItem>
                        <SelectItem value="2">2 witnesses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.witnessCount > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="witnessType">Witness Source</Label>
                      <Select 
                        value={formData.witnessType} 
                        onValueChange={(value: 'platform' | 'user') => setFormData(prev => ({ ...prev, witnessType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="platform">Platform Provided</SelectItem>
                          <SelectItem value="user">I'll Provide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {formData.witnessCount > 0 && formData.witnessType === 'user' && (
                  <div className="space-y-2">
                    <Label>Witness Email Addresses</Label>
                    {Array.from({ length: formData.witnessCount }, (_, i) => (
                      <Input
                        key={i}
                        type="email"
                        value={formData.witnessEmails[i] || ''}
                        onChange={(e) => {
                          const newEmails = [...formData.witnessEmails];
                          newEmails[i] = e.target.value;
                          setFormData(prev => ({ ...prev, witnessEmails: newEmails }));
                        }}
                        placeholder={`Witness ${i + 1} email`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Scheduling */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Preferred Scheduling
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>

            {/* Consent & Terms */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToTerms: checked as boolean }))}
                />
                <Label htmlFor="agreedToTerms" className="text-sm">
                  I agree to the terms and conditions of notarization services
                </Label>
              </div>
              
              {formData.mode === 'RON' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreedToRecording"
                    checked={formData.agreedToRecording}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToRecording: checked as boolean }))}
                  />
                  <Label htmlFor="agreedToRecording" className="text-sm">
                    I consent to audio/video recording for remote notarization (required by law)
                  </Label>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Request Notarization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}