import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Users, FileText, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

interface IPLogEntry {
  id: string;
  title: string;
  description: string;
  inventors: string[];
  dateOfInvention: string;
  dateOfFirstUse: string;
  category: 'algorithm' | 'workflow' | 'ui' | 'integration' | 'system';
  status: 'documented' | 'pending-review' | 'patent-filed' | 'patent-granted';
  technicalDetails: string;
  noveltyDescription: string;
  attachments: string[];
  lastUpdated: string;
}

export function IPLogSystem() {
  const [entries, setEntries] = useState<IPLogEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Load sample data
  useEffect(() => {
    const sampleEntries: IPLogEntry[] = [
      {
        id: '1',
        title: 'Family Legacy Vault™ Encryption System',
        description: 'Multi-generational secure messaging with time-delayed delivery and biometric access control',
        inventors: ['Tony Gomes', 'Pedro [CTO]', 'Security Team'],
        dateOfInvention: '2024-01-10',
        dateOfFirstUse: '2024-01-15',
        category: 'system',
        status: 'documented',
        technicalDetails: 'AES-256 encryption with role-based key management, blockchain inheritance verification, automated time-release protocols',
        noveltyDescription: 'First system to combine secure multi-generational messaging with automated inheritance triggers and family role hierarchy management',
        attachments: ['vault-architecture.pdf', 'encryption-specs.md'],
        lastUpdated: '2024-03-01'
      },
      {
        id: '2',
        title: 'SWAG Lead Score™ Algorithm',
        description: 'AI-powered HNW prospect scoring using integrated financial, behavioral, and social data',
        inventors: ['Tony Gomes', 'AI Development Team'],
        dateOfInvention: '2024-01-25',
        dateOfFirstUse: '2024-02-01',
        category: 'algorithm',
        status: 'pending-review',
        technicalDetails: 'Machine learning ensemble combining 200+ features from Plaid, Catchlight, social signals, and behavioral patterns',
        noveltyDescription: 'First wealth-tech platform to combine real-time bank data, social signals, and behavioral patterns for HNW prospect identification',
        attachments: ['swag-algorithm.py', 'feature-analysis.xlsx'],
        lastUpdated: '2024-03-05'
      }
    ];
    setEntries(sampleEntries);
  }, []);

  const [newEntry, setNewEntry] = useState<Partial<IPLogEntry>>({
    title: '',
    description: '',
    inventors: [],
    dateOfInvention: new Date().toISOString().split('T')[0],
    dateOfFirstUse: '',
    category: 'workflow',
    status: 'documented',
    technicalDetails: '',
    noveltyDescription: '',
    attachments: []
  });

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const entry: IPLogEntry = {
      id: Date.now().toString(),
      title: newEntry.title!,
      description: newEntry.description!,
      inventors: newEntry.inventors || [],
      dateOfInvention: newEntry.dateOfInvention!,
      dateOfFirstUse: newEntry.dateOfFirstUse || newEntry.dateOfInvention!,
      category: newEntry.category as IPLogEntry['category'] || 'workflow',
      status: newEntry.status as IPLogEntry['status'] || 'documented',
      technicalDetails: newEntry.technicalDetails || '',
      noveltyDescription: newEntry.noveltyDescription || '',
      attachments: newEntry.attachments || [],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      title: '',
      description: '',
      inventors: [],
      dateOfInvention: new Date().toISOString().split('T')[0],
      dateOfFirstUse: '',
      category: 'workflow',
      status: 'documented',
      technicalDetails: '',
      noveltyDescription: '',
      attachments: []
    });
    setIsAddingEntry(false);
    toast.success('IP entry added successfully');
  };

  const exportIPLog = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries,
      metadata: {
        company: 'BFO Family Office',
        exportedBy: 'IP Documentation System',
        categories: ['algorithm', 'workflow', 'ui', 'integration', 'system']
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BFO-IP-Log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('IP log exported successfully');
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'documented': return 'bg-blue-100 text-blue-700';
      case 'pending-review': return 'bg-yellow-100 text-yellow-700';
      case 'patent-filed': return 'bg-purple-100 text-purple-700';
      case 'patent-granted': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold via-primary to-emerald bg-clip-text text-transparent">
            IP Log System
          </h2>
          <p className="text-muted-foreground">
            Track invention dates, first use, and patent status for all innovations
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
            <DialogTrigger asChild>
              <Button className="btn-primary-gold gap-2">
                <Plus className="h-4 w-4" />
                Add IP Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New IP Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry(prev => ({...prev, title: e.target.value}))}
                      placeholder="Innovation title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newEntry.category} onValueChange={(value) => setNewEntry(prev => ({...prev, category: value as IPLogEntry['category']}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="algorithm">Algorithm</SelectItem>
                        <SelectItem value="workflow">Workflow</SelectItem>
                        <SelectItem value="ui">UI/UX</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({...prev, description: e.target.value}))}
                    placeholder="Brief description of the innovation"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfInvention">Date of Invention</Label>
                    <Input
                      id="dateOfInvention"
                      type="date"
                      value={newEntry.dateOfInvention}
                      onChange={(e) => setNewEntry(prev => ({...prev, dateOfInvention: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfFirstUse">Date of First Use</Label>
                    <Input
                      id="dateOfFirstUse"
                      type="date"
                      value={newEntry.dateOfFirstUse}
                      onChange={(e) => setNewEntry(prev => ({...prev, dateOfFirstUse: e.target.value}))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="inventors">Inventors (comma-separated)</Label>
                  <Input
                    id="inventors"
                    value={newEntry.inventors?.join(', ')}
                    onChange={(e) => setNewEntry(prev => ({...prev, inventors: e.target.value.split(',').map(s => s.trim())}))}
                    placeholder="Tony Gomes, Pedro [CTO], Development Team"
                  />
                </div>
                
                <div>
                  <Label htmlFor="technicalDetails">Technical Details</Label>
                  <Textarea
                    id="technicalDetails"
                    value={newEntry.technicalDetails}
                    onChange={(e) => setNewEntry(prev => ({...prev, technicalDetails: e.target.value}))}
                    placeholder="Detailed technical implementation"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="noveltyDescription">Novelty Description</Label>
                  <Textarea
                    id="noveltyDescription"
                    value={newEntry.noveltyDescription}
                    onChange={(e) => setNewEntry(prev => ({...prev, noveltyDescription: e.target.value}))}
                    placeholder="What makes this innovation unique and non-obvious"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEntry} className="btn-primary-gold">
                    Add Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={exportIPLog} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IP entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="algorithm">Algorithm</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
            <SelectItem value="ui">UI/UX</SelectItem>
            <SelectItem value="integration">Integration</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={`capitalize ${getStatusColor(entry.status)}`}>
                    {entry.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {entry.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{entry.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Invention Date</p>
                    <p>{entry.dateOfInvention}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">First Use</p>
                    <p>{entry.dateOfFirstUse}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Inventors</p>
                    <p>{entry.inventors.length} inventor(s)</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p>{entry.lastUpdated}</p>
                </div>
              </div>
              
              {entry.noveltyDescription && (
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Novelty Factor</h4>
                  <p className="text-sm">{entry.noveltyDescription}</p>
                </div>
              )}
              
              {entry.technicalDetails && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1 text-blue-700">Technical Details</h4>
                  <p className="text-sm text-blue-600">{entry.technicalDetails}</p>
                </div>
              )}
              
              {entry.inventors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Inventors</h4>
                  <div className="flex flex-wrap gap-1">
                    {entry.inventors.map((inventor, index) => (
                      <Badge key={index} variant="secondary">{inventor}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No IP entries found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start documenting your innovations by adding your first IP entry'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button onClick={() => setIsAddingEntry(true)} className="btn-primary-gold gap-2">
                <Plus className="h-4 w-4" />
                Add First IP Entry
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}