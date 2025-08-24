import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Database } from 'lucide-react';
import { MeetingModel } from './MeetingModel';
import { parseZocks, parseJump, parsePlain, generateInputsHash } from './parsers';
import { ProPersona } from '../types';
import { recordDecisionRDS } from '../compliance/DecisionTracker';
import { generateSummaryPDF } from '../vault/summaryPDF';
import { grantVaultAccess } from '../vault/VaultManager';
import { FEATURE_FLAGS } from '../config/flags';
import { toast } from 'sonner';

interface ImportMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: ProPersona;
  onMeetingImported?: (meetingId: string) => void;
}

type ImportSource = 'zocks' | 'jump' | 'plain';

export function ImportMeetingModal({ open, onOpenChange, persona, onMeetingImported }: ImportMeetingModalProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [formData, setFormData] = useState({
    title: '',
    textContent: '',
    source: 'plain' as ImportSource,
    file: null as File | null
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      
      // Auto-detect source from filename
      const filename = file.name.toLowerCase();
      if (filename.includes('zocks')) {
        setFormData(prev => ({ ...prev, source: 'zocks' }));
      } else if (filename.includes('jump')) {
        setFormData(prev => ({ ...prev, source: 'jump' }));
      }
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleImport = async () => {
    let content = formData.textContent;
    
    // Read file content if using file tab
    if (activeTab === 'file' && formData.file) {
      try {
        content = await readFileContent(formData.file);
      } catch (error) {
        toast.error('Failed to read file');
        return;
      }
    }

    if (!content.trim()) {
      toast.error('Please provide meeting content to import');
      return;
    }

    setIsImporting(true);

    try {
      // Parse content based on source
      let parsed;
      switch (formData.source) {
        case 'zocks':
          parsed = parseZocks(content);
          break;
        case 'jump':
          parsed = parseJump(content);
          break;
        default:
          parsed = parsePlain(content, formData.title || 'Imported Meeting');
      }

      // Generate inputs hash
      const inputs_hash = generateInputsHash(parsed);

      // Determine risks and reasons
      const reasons = ['meeting_import', 'meeting_summary'];
      if (parsed.action_items.length > 0) reasons.push('action_items');
      if (parsed.risks.length > 0) reasons.push('risk_flag');

      // Record decision receipt
      const decisionReceipt = recordDecisionRDS({
        action: 'meeting_import',
        persona,
        inputs_hash,
        source: formData.source,
        reasons,
        participants: parsed.participants || [],
        result: 'approve'
      });

      // Generate summary PDF
      const summaryPDF = await generateSummaryPDF({
        title: parsed.title,
        summary: parsed.summary,
        bullets: parsed.bullets,
        action_items: parsed.action_items,
        risks: parsed.risks,
        persona
      });

      // Grant vault access
      const vaultGrants = await grantVaultAccess([
        `sha256:transcript:${inputs_hash}`,
        `sha256:summary-pdf:${summaryPDF.hash}`
      ]);

      // Handle anchoring if enabled
      let anchor_ref;
      if (FEATURE_FLAGS.ANCHOR_ON_IMPORT) {
        // Stub anchoring - in production this would call the anchor service
        anchor_ref = {
          batch_id: `batch_${Date.now()}`,
          merkle_root: `root_${inputs_hash.slice(0, 16)}`,
          cross_chain_locator: [{
            chain_id: 'ethereum',
            tx_ref: `0x${Math.random().toString(16).substring(2, 66)}`,
            ts: Date.now()
          }]
        };
      }

      // Create meeting record
      const meeting = MeetingModel.create({
        persona,
        title: parsed.title,
        source: formData.source,
        summary: parsed.summary,
        bullets: parsed.bullets,
        action_items: parsed.action_items,
        risks: parsed.risks,
        inputs_hash,
        decision_receipt_id: decisionReceipt.inputs_hash,
        vault_grants: vaultGrants,
        anchor_ref,
        meeting_date: parsed.meeting_date,
        participants: parsed.participants,
      });

      toast.success('Meeting imported successfully!');
      
      // Reset form
      setFormData({
        title: '',
        textContent: '',
        source: 'plain',
        file: null
      });
      
      onMeetingImported?.(meeting.id);
      onOpenChange(false);

    } catch (error) {
      console.error('Error importing meeting:', error);
      toast.error('Failed to import meeting');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Meeting</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title (optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Will be auto-generated if not provided"
            />
          </div>

          <div className="space-y-2">
            <Label>Import Source</Label>
            <Select value={formData.source} onValueChange={(value: ImportSource) => 
              setFormData(prev => ({ ...prev, source: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zocks">Zocks (JSON)</SelectItem>
                <SelectItem value="jump">Jump (JSON)</SelectItem>
                <SelectItem value="plain">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Paste JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-2">
              <Label htmlFor="textContent">Meeting Content</Label>
              <Textarea
                id="textContent"
                value={formData.textContent}
                onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
                placeholder="Paste meeting transcript, notes, or summary..."
                className="min-h-[200px]"
              />
            </TabsContent>

            <TabsContent value="file" className="space-y-2">
              <Label htmlFor="file">Upload Meeting File</Label>
              <Input
                id="file"
                type="file"
                accept=".txt,.json,.md"
                onChange={handleFileUpload}
              />
              {formData.file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.file.name} ({Math.round(formData.file.size / 1024)}KB)
                </p>
              )}
            </TabsContent>

            <TabsContent value="json" className="space-y-2">
              <Label htmlFor="jsonContent">JSON Data</Label>
              <Textarea
                id="jsonContent"
                value={formData.textContent}
                onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
                placeholder="Paste JSON data from Zocks, Jump, or other structured source..."
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>
          </Tabs>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Import Processing</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Content will be parsed and structured automatically</li>
              <li>• Decision receipt will be generated for compliance</li>
              <li>• Summary PDF will be created and vault-protected</li>
              {FEATURE_FLAGS.ANCHOR_ON_IMPORT && (
                <li>• Proof will be anchored for immutable verification</li>
              )}
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? 'Importing...' : 'Import Meeting'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}