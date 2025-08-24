import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { COUNTY_META, getCountiesByState, getCountyMeta, type CountyMeta } from './countyMeta';
import CountyLookupPanel from './CountyLookupPanel';
import { validateFirstPage, getIssueDescription, getIssueSeverity, type LayoutIssue, type IntakeCheck } from './layoutValidators';
import { renderCoverSheetPdf, validateCoverSheetTokens, type CoverSheetTokens } from '@/lib/report/coverSheetPdf';
import { submitERecording, type ERecordingResult } from './erecord';
import { recordReceipt } from '@/features/receipts/record';

interface RecordingIntakeFormProps {
  deedId?: string;
  onSubmitted?: (result: ERecordingResult) => void;
  onRecorded?: (instrumentNumber: string) => void;
}

export function RecordingIntakeForm({ deedId, onSubmitted, onRecorded }: RecordingIntakeFormProps) {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [counties, setCounties] = useState<string[]>([]);
  const [countyMeta, setCountyMeta] = useState<CountyMeta | null>(null);
  
  // Form fields
  const [apn, setApn] = useState('');
  const [returnAddress, setReturnAddress] = useState('');
  const [preparer, setPreparer] = useState('');
  const [granteeAddress, setGranteeAddress] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [consideration, setConsideration] = useState('');
  const [returnEmail, setReturnEmail] = useState('');
  const [deedFile, setDeedFile] = useState<File | null>(null);
  
  // Validation state
  const [validationResult, setValidationResult] = useState<IntakeCheck | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // Recording state
  const [coverSheetGenerated, setCoverSheetGenerated] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ERecordingResult | null>(null);
  const [recordedInstrument, setRecordedInstrument] = useState('');
  const [returnStampedFile, setReturnStampedFile] = useState<File | null>(null);

  const states = [...new Set(Object.keys(COUNTY_META).map(key => key.split('/')[0]))].sort();

  useEffect(() => {
    if (selectedState) {
      const stateCounties = getCountiesByState(selectedState);
      setCounties(stateCounties);
      setSelectedCounty('');
      setCountyMeta(null);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState && selectedCounty) {
      const meta = getCountyMeta(selectedState, selectedCounty);
      setCountyMeta(meta);
    }
  }, [selectedState, selectedCounty]);

  const validateLayout = async () => {
    if (!countyMeta || !deedFile) {
      toast.error('Please select county and upload deed file');
      return;
    }

    setIsValidating(true);
    
    try {
      // Simulate PDF analysis - in production, this would analyze the actual PDF
      const mockAnalysis = {
        hasReturnAddress: !!returnAddress,
        hasPreparer: !!preparer,
        hasGranteeAddress: !!granteeAddress,
        hasAPN: !!apn,
        fontPt: 12, // Mock font size
        inkColor: 'black' as const,
        topMarginIn: 2.8, // Mock measurements
        leftMarginIn: 1.0,
        rightMarginIn: 1.0,
        bottomMarginIn: 1.0,
        firstPageStampFree: true
      };

      const result = validateFirstPage(countyMeta, mockAnalysis);
      setValidationResult(result);

      // Record receipt
      recordReceipt({
        id: `intake_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'E-2025.08',
        inputs_hash: 'sha256:deed-intake',
        result: result.ok ? 'approve' : 'deny',
        reasons: result.ok ? ['INTAKE_PASS'] : result.issues,
        created_at: new Date().toISOString()
      } as any);

      if (result.ok) {
        toast.success('Layout validation passed');
      } else {
        toast.error(`Layout validation failed: ${result.issues.length} issues found`);
      }
    } catch (error) {
      toast.error('Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const generateCoverSheet = async () => {
    if (!countyMeta) {
      toast.error('Please select county first');
      return;
    }

    const tokens: CoverSheetTokens = {
      returnAddress,
      preparer,
      instrumentType: 'Deed',
      propertyAddress,
      apn,
      granteeAddress,
      consideration
    };

    const validation = validateCoverSheetTokens(tokens, countyMeta);
    if (!validation.valid) {
      toast.error(`Missing required fields: ${validation.missing.join(', ')}`);
      return;
    }

    try {
      const coverSheetPdf = await renderCoverSheetPdf(countyMeta, tokens);
      setCoverSheetGenerated(true);
      
      // Record receipt for cover sheet generation
      recordReceipt({
        id: `cover_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'E-2025.08',
        inputs_hash: 'sha256:cover-sheet',
        result: 'approve',
        reasons: ['COVER_SHEET_GENERATED'],
        created_at: new Date().toISOString()
      } as any);

      toast.success('Cover sheet generated successfully');
    } catch (error) {
      toast.error('Failed to generate cover sheet');
    }
  };

  const submitRecording = async () => {
    if (!countyMeta || !deedFile || !validationResult?.ok) {
      toast.error('Please validate layout first');
      return;
    }

    try {
      const deedBytes = new Uint8Array(await deedFile.arrayBuffer());
      
      const result = await submitERecording({
        pdf: deedBytes,
        county: selectedCounty,
        state: selectedState,
        apn,
        seller: '',
        buyer: granteeAddress,
        returnEmail
      });

      setSubmissionResult(result);
      
      // Record submission receipt
      recordReceipt({
        id: `submit_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'E-2025.08',
        inputs_hash: 'sha256:recording-submit',
        result: result.submitted ? 'approve' : 'deny',
        reasons: [result.submitted ? 'RECORDING_SUBMITTED' : 'MANUAL_REQUIRED'],
        created_at: new Date().toISOString()
      } as any);

      if (result.submitted) {
        toast.success(`Recording submitted successfully. Tracking ID: ${result.trackingId}`);
      } else {
        toast.info('Manual recording required. Please file with county recorder.');
      }

      onSubmitted?.(result);
    } catch (error) {
      toast.error('Failed to submit recording');
    }
  };

  const markAsRecorded = () => {
    if (!recordedInstrument) {
      toast.error('Please enter instrument number');
      return;
    }

    // Record completion receipt
    recordReceipt({
      id: `recorded_${Date.now()}`,
      type: 'Decision-RDS',
      policy_version: 'E-2025.08',
      inputs_hash: 'sha256:deed-recorded',
      result: 'approve',
      reasons: [`INSTRUMENT_${recordedInstrument}`],
      created_at: new Date().toISOString()
    } as any);

    toast.success(`Deed recorded with instrument number: ${recordedInstrument}`);
    onRecorded?.(recordedInstrument);
  };

  const handleCountySelect = (meta: CountyMeta) => {
    setSelectedState(meta.state);
    setSelectedCounty(meta.county);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            County Look-up & Recording Intake
          </CardTitle>
          <CardDescription>
            Search counties and validate deed layout for recording
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CountyLookupPanel onUse={handleCountySelect} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recording Intake Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* County Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="county">County</Label>
              <Select value={selectedCounty} onValueChange={setSelectedCounty} disabled={!selectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {counties.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* County Requirements */}
          {countyMeta && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">County Requirements</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Page Size:</strong> {countyMeta.pageSize}</p>
                    <p><strong>Top Margin:</strong> {countyMeta.topMarginIn}"</p>
                    <p><strong>Left/Right Margins:</strong> {countyMeta.leftMarginIn}"/{countyMeta.rightMarginIn}"</p>
                  </div>
                  <div>
                    <p><strong>E-Recording:</strong> {countyMeta.eRecording ? 'Available' : 'Not available'}</p>
                    {countyMeta.providers && <p><strong>Providers:</strong> {countyMeta.providers.join(', ')}</p>}
                    {countyMeta.minFontPt && <p><strong>Min Font:</strong> {countyMeta.minFontPt}pt</p>}
                  </div>
                </div>
                {countyMeta.transferTaxNote && (
                  <p className="text-amber-700"><strong>Tax Note:</strong> {countyMeta.transferTaxNote}</p>
                )}
                {countyMeta.notes && (
                  <p className="text-blue-700"><strong>Notes:</strong> {countyMeta.notes}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Required Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apn">APN/Parcel Number {countyMeta?.requiresAPN && '*'}</Label>
              <Input 
                id="apn" 
                value={apn} 
                onChange={(e) => setApn(e.target.value)}
                placeholder="123-456-789"
              />
            </div>
            <div>
              <Label htmlFor="consideration">Consideration</Label>
              <Input 
                id="consideration" 
                value={consideration} 
                onChange={(e) => setConsideration(e.target.value)}
                placeholder="$100,000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="returnAddress">Return Address {countyMeta?.requiresReturnAddress && '*'}</Label>
            <Input 
              id="returnAddress" 
              value={returnAddress} 
              onChange={(e) => setReturnAddress(e.target.value)}
              placeholder="123 Main St, City, State ZIP"
            />
          </div>

          <div>
            <Label htmlFor="preparer">Preparer {countyMeta?.requiresPreparer && '*'}</Label>
            <Input 
              id="preparer" 
              value={preparer} 
              onChange={(e) => setPreparer(e.target.value)}
              placeholder="Attorney Name, State Bar #12345"
            />
          </div>

          <div>
            <Label htmlFor="granteeAddress">Grantee Address {countyMeta?.requiresGranteeAddress && '*'}</Label>
            <Input 
              id="granteeAddress" 
              value={granteeAddress} 
              onChange={(e) => setGranteeAddress(e.target.value)}
              placeholder="456 Oak Ave, City, State ZIP"
            />
          </div>

          <div>
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input 
              id="propertyAddress" 
              value={propertyAddress} 
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="789 Elm St, City, State ZIP"
            />
          </div>

          <div>
            <Label htmlFor="returnEmail">Return Email (optional)</Label>
            <Input 
              id="returnEmail" 
              type="email"
              value={returnEmail} 
              onChange={(e) => setReturnEmail(e.target.value)}
              placeholder="attorney@lawfirm.com"
            />
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="deedFile">Deed PDF</Label>
            <Input 
              id="deedFile" 
              type="file" 
              accept=".pdf"
              onChange={(e) => setDeedFile(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Validation Section */}
      {deedFile && countyMeta && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Layout Validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={validateLayout} 
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? 'Validating...' : 'Validate Layout'}
            </Button>

            {validationResult && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {validationResult.ok ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={validationResult.ok ? 'text-green-700' : 'text-red-700'}>
                    {validationResult.ok ? 'Layout validation passed' : `${validationResult.issues.length} issues found`}
                  </span>
                </div>

                {!validationResult.ok && (
                  <div className="space-y-1">
                    {validationResult.issues.map((issue, index) => (
                      <Badge 
                        key={index} 
                        variant={getIssueSeverity(issue) === 'high' ? 'destructive' : 'secondary'}
                        className="mr-2"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {getIssueDescription(issue)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cover Sheet Generation */}
      {validationResult?.ok && (
        <Card>
          <CardHeader>
            <CardTitle>Cover Sheet</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateCoverSheet}
              disabled={coverSheetGenerated}
              className="w-full"
            >
              {coverSheetGenerated ? 'Cover Sheet Generated' : 'Generate Cover Sheet'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recording Submission */}
      {coverSheetGenerated && validationResult?.ok && (
        <Card>
          <CardHeader>
            <CardTitle>Submit for Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countyMeta?.eRecording ? (
              <Button 
                onClick={submitRecording}
                disabled={!!submissionResult}
                className="w-full"
              >
                {submissionResult ? 'Recording Submitted' : 'Submit for E-Recording'}
              </Button>
            ) : (
              <div className="p-4 border border-amber-200 bg-amber-50 rounded">
                <p className="text-amber-800">
                  Manual recording required. Please file the deed and cover sheet with the county recorder's office.
                </p>
              </div>
            )}

            {submissionResult && (
              <div className="p-4 border border-green-200 bg-green-50 rounded">
                <p className="text-green-800">
                  {submissionResult.message}
                  {submissionResult.trackingId && (
                    <span className="block mt-1">Tracking ID: {submissionResult.trackingId}</span>
                  )}
                  {submissionResult.estFees && (
                    <span className="block mt-1">Estimated Fees: ${submissionResult.estFees}</span>
                  )}
                </p>
              </div>
            )}

            {/* Manual completion for non e-recording counties or when return stamp received */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Mark as Recorded</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instrumentNumber">Instrument Number</Label>
                  <Input 
                    id="instrumentNumber"
                    value={recordedInstrument}
                    onChange={(e) => setRecordedInstrument(e.target.value)}
                    placeholder="2025-123456"
                  />
                </div>
                <div>
                  <Label htmlFor="returnStamped">Return-Stamped PDF (optional)</Label>
                  <Input 
                    id="returnStamped"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setReturnStampedFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <Button 
                onClick={markAsRecorded}
                disabled={!recordedInstrument}
                className="w-full"
              >
                Mark as Recorded
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}