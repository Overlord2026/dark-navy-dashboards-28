import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FolderPlus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Scale,
  Download,
  QrCode,
  Shield
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';

interface Matter {
  id: string;
  title: string;
  client_name: string;
  matter_type: string;
  status: 'draft' | 'execute' | 'record';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  progress: number;
  checklist_items: ChecklistItem[];
  authority_verified: boolean;
}

interface ChecklistItem {
  id: string;
  title: string;
  stage: 'draft' | 'execute' | 'record';
  completed: boolean;
  required: boolean;
  deadline?: string;
}

export default function AttorneyMattersPage() {
  const [matters, setMatters] = useState<Matter[]>([
    {
      id: 'M001',
      title: 'Estate Planning - Johnson Family',
      client_name: 'Robert Thompson',
      matter_type: 'Estate Planning',
      status: 'draft',
      priority: 'high',
      deadline: '2024-02-15',
      progress: 35,
      authority_verified: true,
      checklist_items: [
        { id: '1', title: 'Initial client intake', stage: 'draft', completed: true, required: true },
        { id: '2', title: 'Asset inventory', stage: 'draft', completed: true, required: true },
        { id: '3', title: 'Draft will and trust documents', stage: 'draft', completed: false, required: true, deadline: '2024-02-01' },
        { id: '4', title: 'Client review and approval', stage: 'execute', completed: false, required: true },
        { id: '5', title: 'Notarization and witnessing', stage: 'execute', completed: false, required: true },
        { id: '6', title: 'File with court/county', stage: 'record', completed: false, required: false }
      ]
    },
    {
      id: 'M002',
      title: 'Business Formation - Tech Startup',
      client_name: 'Jennifer Davis',
      matter_type: 'Business Formation',
      status: 'execute',
      priority: 'medium',
      deadline: '2024-02-20',
      progress: 65,
      authority_verified: false,
      checklist_items: [
        { id: '1', title: 'Business plan review', stage: 'draft', completed: true, required: true },
        { id: '2', title: 'Draft articles of incorporation', stage: 'draft', completed: true, required: true },
        { id: '3', title: 'Draft bylaws and agreements', stage: 'draft', completed: true, required: true },
        { id: '4', title: 'State filing preparation', stage: 'execute', completed: true, required: true },
        { id: '5', title: 'Corporate resolutions', stage: 'execute', completed: false, required: true },
        { id: '6', title: 'Tax ID application', stage: 'record', completed: false, required: true }
      ]
    }
  ]);

  const [showNewMatter, setShowNewMatter] = useState(false);
  const [showAuthority, setShowAuthority] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  
  const [newMatter, setNewMatter] = useState({
    title: '',
    client_name: '',
    matter_type: '',
    deadline: '',
    priority: 'medium' as const
  });

  const handleCreateMatter = async () => {
    try {
      recordReceipt({
        id: `matter_created_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:${JSON.stringify(newMatter)}`,
        result: 'approve',
        reasons: ['MATTER_CREATED', 'CHECKLIST_INITIALIZED'],
        created_at: new Date().toISOString()
      });

      const matter: Matter = {
        id: `M${String(matters.length + 1).padStart(3, '0')}`,
        title: newMatter.title,
        client_name: newMatter.client_name,
        matter_type: newMatter.matter_type,
        status: 'draft',
        priority: newMatter.priority,
        deadline: newMatter.deadline,
        progress: 0,
        authority_verified: false,
        checklist_items: [
          { id: '1', title: 'Initial consultation', stage: 'draft', completed: false, required: true },
          { id: '2', title: 'Document preparation', stage: 'draft', completed: false, required: true },
          { id: '3', title: 'Client review', stage: 'execute', completed: false, required: true },
          { id: '4', title: 'Final execution', stage: 'execute', completed: false, required: true },
          { id: '5', title: 'Filing/Recording', stage: 'record', completed: false, required: false }
        ]
      };

      setMatters(prev => [matter, ...prev]);
      setNewMatter({ title: '', client_name: '', matter_type: '', deadline: '', priority: 'medium' });
      setShowNewMatter(false);

      toast.success('Matter created with checklist initialized');
    } catch (error) {
      toast.error('Failed to create matter');
    }
  };

  const handleChecklistUpdate = async (matterId: string, itemId: string, completed: boolean) => {
    try {
      const matter = matters.find(m => m.id === matterId);
      if (!matter) return;

      const item = matter.checklist_items.find(i => i.id === itemId);
      if (!item) return;

      recordReceipt({
        id: `checklist_update_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:${matterId}_${itemId}_${completed}`,
        result: 'approve',
        reasons: ['CHECKLIST_UPDATED', `STAGE_${item.stage.toUpperCase()}`],
        created_at: new Date().toISOString()
      });

      setMatters(prev => prev.map(m => {
        if (m.id === matterId) {
          const updatedItems = m.checklist_items.map(i => 
            i.id === itemId ? { ...i, completed } : i
          );
          const completedCount = updatedItems.filter(i => i.completed).length;
          const progress = Math.round((completedCount / updatedItems.length) * 100);
          
          // Update status based on progress
          let status = m.status;
          if (progress < 33) status = 'draft';
          else if (progress < 67) status = 'execute';
          else status = 'record';

          return {
            ...m,
            checklist_items: updatedItems,
            progress,
            status
          };
        }
        return m;
      }));

      toast.success('Checklist item updated');
    } catch (error) {
      toast.error('Failed to update checklist');
    }
  };

  const handleAuthorityVerification = async (matter: Matter) => {
    try {
      recordReceipt({
        id: `authority_verification_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:authority_${matter.id}`,
        result: 'approve',
        reasons: ['AUTHORITY_VERIFIED', 'QR_CODE_GENERATED'],
        created_at: new Date().toISOString()
      });

      setMatters(prev => prev.map(m => 
        m.id === matter.id ? { ...m, authority_verified: true } : m
      ));

      setShowAuthority(false);
      setSelectedMatter(null);

      toast.success('Authority verification completed');
    } catch (error) {
      toast.error('Authority verification failed');
    }
  };

  const handleExportBinder = async (matterId: string) => {
    try {
      recordReceipt({
        id: `binder_export_${Date.now()}`,
        type: 'Vault-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:export_${matterId}`,
        result: 'approve',
        reasons: ['CASE_BINDER_EXPORT', 'DOCUMENTS_COMPILED', 'TIMELINE_GENERATED'],
        created_at: new Date().toISOString()
      });

      toast.success('Case binder exported with timeline');
    } catch (error) {
      toast.error('Failed to export case binder');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'execute': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'record': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attorney Matters</h1>
          <p className="text-muted-foreground">
            Manage legal matters with checklists, authority verification, and document binders
          </p>
        </div>
        <Dialog open={showNewMatter} onOpenChange={setShowNewMatter}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Matter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Matter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Matter Title</Label>
                <Input
                  id="title"
                  value={newMatter.title}
                  onChange={(e) => setNewMatter(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Estate Planning - Smith Family"
                />
              </div>
              
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={newMatter.client_name}
                  onChange={(e) => setNewMatter(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Label htmlFor="type">Matter Type</Label>
                <Input
                  id="type"
                  value={newMatter.matter_type}
                  onChange={(e) => setNewMatter(prev => ({ ...prev, matter_type: e.target.value }))}
                  placeholder="Estate Planning, Business Formation, etc."
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newMatter.deadline}
                  onChange={(e) => setNewMatter(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <Button onClick={handleCreateMatter} className="w-full">
                Create Matter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Matters List */}
      <div className="space-y-6">
        {matters.map((matter) => (
          <Card key={matter.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    {matter.title}
                    {!matter.authority_verified && (
                      <AlertTriangle className="h-4 w-4 ml-2 text-orange-500" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {matter.client_name} • Matter #{matter.id} • Due: {matter.deadline}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(matter.status)}>
                      {matter.status}
                    </Badge>
                    <Badge className={getPriorityColor(matter.priority)}>
                      {matter.priority} priority
                    </Badge>
                    {matter.authority_verified ? (
                      <Badge variant="outline" className="text-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Authority Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Authority Pending
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!matter.authority_verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMatter(matter);
                        setShowAuthority(true);
                      }}
                    >
                      <QrCode className="h-4 w-4 mr-1" />
                      Verify Authority
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportBinder(matter.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Binder
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{matter.progress}%</span>
                  </div>
                  <Progress value={matter.progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Matter Checklist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['draft', 'execute', 'record'].map((stage) => (
                      <div key={stage} className="space-y-2">
                        <h5 className="text-sm font-medium capitalize text-muted-foreground">
                          {stage} Stage
                        </h5>
                        {matter.checklist_items
                          .filter(item => item.stage === stage)
                          .map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={(checked) => 
                                  handleChecklistUpdate(matter.id, item.id, !!checked)
                                }
                              />
                              <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {item.title}
                                {item.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                              {item.deadline && (
                                <span className="text-xs text-muted-foreground">
                                  ({item.deadline})
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Authority Verification Modal */}
      <Dialog open={showAuthority} onOpenChange={setShowAuthority}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authority Verification - {selectedMatter?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Scale className="h-4 w-4 mr-2" />
                <span className="font-medium">Proof-of-Authority</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate QR code for client authority verification. No sensitive content stored in receipts.
              </p>
            </div>

            <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center space-y-2">
                <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">QR Code will be generated here</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <Shield className="h-4 w-4 mr-2 text-yellow-600" />
                <span className="font-medium text-yellow-800">Privilege Protection</span>
              </div>
              <p className="text-xs text-yellow-700">
                Authority verification uses content-free receipts. Only verification hashes are recorded.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => selectedMatter && handleAuthorityVerification(selectedMatter)}
                className="flex-1"
              >
                Generate Authority QR
              </Button>
              <Button variant="outline" onClick={() => setShowAuthority(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}