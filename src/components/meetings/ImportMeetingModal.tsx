import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, Code, Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { parseZocks, toDecisionRdsFromZocks, vaultPackForZocks } from '@/tools/imports/zocks';
import { parseJump, toDecisionRdsFromJump, vaultPackForJump } from '@/tools/imports/jump';
import { generateSummaryPdf } from '@/lib/summary/pdf';
import { recordDecisionRDS } from '@/lib/rds';
import { recordReceipt } from '@/features/receipts/record';
import { getFlag } from '@/config/flags';

interface ImportMeetingModalProps {
  onImportComplete?: () => void;
}

type SourceType = 'zocks' | 'jump' | 'plain';

interface ParsedData {
  summary: string;
  bullets: string[];
  actions: string[];
  risks: string[];
  speakers: string[];
  inputs_hash: string;
  transcriptText: string;
  originalData: any;
}

export function ImportMeetingModal({ onImportComplete }: ImportMeetingModalProps) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<SourceType>('zocks');
  const [pastedText, setPastedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedJson, setPastedJson] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ParsedData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const processInput = async () => {
    setIsProcessing(true);
    try {
      let input: File | string;
      let inputType: string;

      // Determine input source
      if (uploadedFile) {
        input = uploadedFile;
        inputType = 'file';
      } else if (pastedJson.trim()) {
        input = pastedJson;
        inputType = 'json';
      } else if (pastedText.trim()) {
        input = pastedText;
        inputType = 'text';
      } else {
        throw new Error('Please provide input data');
      }

      // Parse based on source type
      let parsed: ParsedData;
      if (source === 'zocks') {
        parsed = await parseZocks(input);
      } else if (source === 'jump') {
        parsed = await parseJump(input);
      } else {
        // Plain text parsing
        const textContent = input instanceof File ? await input.text() : input;
        parsed = {
          summary: textContent.length > 300 ? textContent.substring(0, 300) + '...' : textContent,
          bullets: [],
          actions: [],
          risks: [],
          speakers: ['Unknown'],
          inputs_hash: await hashContent(textContent),
          transcriptText: textContent,
          originalData: null
        };
      }

      setPreviewData(parsed);
      setShowPreview(true);
    } catch (error) {
      console.error('Error processing input:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process input",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = async () => {
    if (!previewData) return;

    setIsProcessing(true);
    try {
      // Generate RDS records
      let decisionRds;
      let vaultPack;
      
      const rawInput = uploadedFile ? await uploadedFile.text() : 
                      pastedJson.trim() || pastedText.trim();

      if (source === 'zocks') {
        decisionRds = toDecisionRdsFromZocks(previewData);
        const pdfBytes = generateSummaryPdf({
          title: 'Zocks Meeting Import',
          summary: previewData.summary,
          bullets: previewData.bullets,
          actions: previewData.actions,
          risks: previewData.risks,
          speakers: previewData.speakers,
          date: new Date().toLocaleDateString()
        });
        vaultPack = await vaultPackForZocks(rawInput, pdfBytes);
      } else if (source === 'jump') {
        decisionRds = toDecisionRdsFromJump(previewData);
        const pdfBytes = generateSummaryPdf({
          title: 'Jump Meeting Import',
          summary: previewData.summary,
          bullets: previewData.bullets,
          actions: previewData.actions,
          risks: previewData.risks,
          speakers: previewData.speakers,
          date: new Date().toLocaleDateString()
        });
        vaultPack = await vaultPackForJump(rawInput, pdfBytes);
      } else {
        // Plain text
        decisionRds = {
          action: 'meeting_import',
          policy_version: 'v1.0',
          inputs_hash: previewData.inputs_hash,
          reasons: ['meeting_import'],
          source: 'plain_text',
          summary_length: previewData.summary.length
        };
        
        const pdfBytes = generateSummaryPdf({
          title: 'Plain Text Meeting Import',
          summary: previewData.summary,
          bullets: [],
          actions: [],
          risks: [],
          speakers: previewData.speakers,
          date: new Date().toLocaleDateString()
        });
        
        vaultPack = {
          grant: {
            type: 'PRE',
            files: [`sha256:${await hashContent(rawInput)}`, `sha256:${await hashContent(pdfBytes)}`],
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            granted_to: 'meeting_import',
            access_level: 'read'
          },
          files: [`sha256:${await hashContent(rawInput)}`, `sha256:${await hashContent(pdfBytes)}`]
        };
      }

      // Record Decision-RDS
      const decisionRecord = recordDecisionRDS(decisionRds);
      recordReceipt({
        id: `decision-${Date.now()}`,
        type: 'Decision-RDS',
        timestamp: decisionRecord.timestamp,
        payload: decisionRds,
        inputs_hash: decisionRecord.inputs_hash,
        policy_version: decisionRecord.policy_version
      });

      // Record Vault-RDS
      const vaultRds = {
        type: 'Vault-RDS',
        inputs_hash: await hashContent(vaultPack.grant),
        policy_version: 'v1.0',
        payload: {
          action: 'vault_grant',
          files: vaultPack.files,
          grant_type: vaultPack.grant.type,
          expires_at: vaultPack.grant.expires_at
        },
        timestamp: new Date().toISOString()
      };

      recordReceipt({
        id: `vault-${Date.now()}`,
        type: 'Vault-RDS',
        timestamp: vaultRds.timestamp,
        payload: vaultRds.payload,
        inputs_hash: vaultRds.inputs_hash,
        policy_version: vaultRds.policy_version
      });

      // Optional anchoring
      if (getFlag('ANCHOR_ON_IMPORT')) {
        const anchorHash = await hashContent({
          id: decisionRecord.inputs_hash,
          inputs_hash: decisionRecord.inputs_hash
        });
        
        // In a real implementation, this would call an anchoring service
        console.log('[ANCHOR]', `Anchoring hash: ${anchorHash}`);
        
        // Update receipt with anchor reference
        const anchorRef = `anchor:${anchorHash.slice(0, 16)}`;
        // Would update the stored receipt with anchor_ref
      }

      toast({
        title: "Import Complete",
        description: "Meeting imported and proofed successfully",
      });

      setOpen(false);
      setShowPreview(false);
      setPreviewData(null);
      setPastedText('');
      setPastedJson('');
      setUploadedFile(null);
      
      onImportComplete?.();

    } catch (error) {
      console.error('Error confirming import:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import meeting",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Meeting Data</DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Source Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Source Format</Label>
              <RadioGroup value={source} onValueChange={(value) => setSource(value as SourceType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="zocks" id="zocks" />
                  <Label htmlFor="zocks">Zocks Transcript JSON</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jump" id="jump" />
                  <Label htmlFor="jump">Jump Summary JSON</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="plain" id="plain" />
                  <Label htmlFor="plain">Plain Text</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Input Tabs */}
            <Tabs defaultValue="paste-text" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paste-text">
                  <FileText className="h-4 w-4 mr-2" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="upload-file">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="paste-json">
                  <Code className="h-4 w-4 mr-2" />
                  Paste JSON
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paste-text" className="space-y-4">
                <Textarea
                  placeholder="Paste your meeting transcript or notes here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  rows={8}
                />
              </TabsContent>

              <TabsContent value="upload-file" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept=".json,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload .json, .txt, or .md file
                    </span>
                  </label>
                  {uploadedFile && (
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                      <span className="text-sm">Selected: {uploadedFile.name}</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="paste-json" className="space-y-4">
                <Textarea
                  placeholder="Paste JSON data from Zocks, Jump, or other meeting platforms..."
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  rows={8}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={processInput} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Preview'}
              </Button>
            </div>
          </div>
        ) : (
          /* Preview Section */
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Import Preview</h3>
              <Badge variant="secondary">{source.toUpperCase()}</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Meeting Summary</CardTitle>
                <CardDescription>
                  {previewData?.speakers.length} participants • {previewData?.summary.length} characters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-gray-600">{previewData?.summary}</p>
                </div>

                {previewData?.bullets && previewData.bullets.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Key Points ({previewData.bullets.length})</h4>
                    <ul className="text-sm space-y-1">
                      {previewData.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewData?.actions && previewData.actions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Action Items ({previewData.actions.length})</h4>
                    <ul className="text-sm space-y-1">
                      {previewData.actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewData?.risks && previewData.risks.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Risks & Concerns ({previewData.risks.length})</h4>
                    <ul className="text-sm space-y-1">
                      {previewData.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Badge variant="outline">
                    Hash: {previewData?.inputs_hash.slice(0, 8)}...
                  </Badge>
                  {getFlag('ANCHOR_ON_IMPORT') && (
                    <Badge variant="outline">Anchoring Enabled</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back to Edit
              </Button>
              <Button onClick={confirmImport} disabled={isProcessing}>
                {isProcessing ? 'Importing...' : 'Confirm Import'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function
async function hashContent(content: any): Promise<string> {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const encoder = new TextEncoder();
  const data = encoder.encode(textContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}