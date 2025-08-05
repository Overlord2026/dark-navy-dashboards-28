import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Plus, Calendar, Users } from 'lucide-react';

interface IPLogEntry {
  id: string;
  innovationName: string;
  dateOfInvention: string;
  firstUseDate: string;
  inventors: string[];
  description: string;
  category: string;
  status: 'Documented' | 'Patent Pending' | 'Filed' | 'Granted';
  relatedFeatures: string[];
}

export function IPLogExport() {
  const [ipLog, setIpLog] = useState<IPLogEntry[]>([
    {
      id: 'IP001',
      innovationName: 'Family Legacy Vault™',
      dateOfInvention: '2024-01-15',
      firstUseDate: '2024-02-01',
      inventors: ['Tony Gomes', 'Development Team Lead'],
      description: 'Multi-generational digital asset preservation system with time-based message delivery and secure family tree mapping',
      category: 'Core Platform',
      status: 'Patent Pending',
      relatedFeatures: ['Vault Dashboard', 'Message Composer', 'Family Tree Navigator']
    },
    {
      id: 'IP002',
      innovationName: 'SWAG Lead Score™',
      dateOfInvention: '2024-01-20',
      firstUseDate: '2024-02-15',
      inventors: ['Tony Gomes', 'Algorithm Specialist'],
      description: 'Proprietary wealth assessment algorithm combining financial data aggregation with AI-powered lead qualification and advisor matching',
      category: 'AI/Algorithm',
      status: 'Patent Pending',
      relatedFeatures: ['Score Calculator', 'Lead Dashboard', 'Advisor Assignment']
    },
    {
      id: 'IP003',
      innovationName: 'Integrated Advisor Onboarding Engine',
      dateOfInvention: '2024-01-25',
      firstUseDate: '2024-03-01',
      inventors: ['Tony Gomes', 'UX Designer', 'Compliance Specialist'],
      description: 'Automated multi-role professional onboarding with dynamic compliance management and jurisdiction-specific document collection',
      category: 'Workflow Automation',
      status: 'Patent Pending',
      relatedFeatures: ['Role Detection', 'Compliance Forms', 'Progress Tracking']
    },
    {
      id: 'IP004',
      innovationName: 'Linda Voice AI Assistant',
      dateOfInvention: '2024-02-10',
      firstUseDate: '2024-03-15',
      inventors: ['Tony Gomes', 'AI Integration Team'],
      description: 'Intelligent voice-based meeting management system with natural language processing for financial services terminology',
      category: 'AI/Voice Technology',
      status: 'Patent Pending',
      relatedFeatures: ['Voice Commands', 'Meeting Scheduler', 'Client Communications']
    },
    {
      id: 'IP005',
      innovationName: 'Real-Time Multi-Role Compliance Management',
      dateOfInvention: '2024-02-05',
      firstUseDate: '2024-03-10',
      inventors: ['Tony Gomes', 'Compliance Team', 'Backend Developer'],
      description: 'Dynamic regulatory compliance monitoring system with automated enforcement across multiple professional roles and jurisdictions',
      category: 'Compliance/Security',
      status: 'Patent Pending',
      relatedFeatures: ['Compliance Dashboard', 'Regulatory Alerts', 'Audit Trail']
    },
    {
      id: 'IP006',
      innovationName: 'Integrated Family Office Marketplace',
      dateOfInvention: '2024-02-20',
      firstUseDate: '2024-04-01',
      inventors: ['Tony Gomes', 'Marketplace Team', 'Quality Assurance Lead'],
      description: 'Professional services matching platform with AI-powered quality scoring and automated service delivery tracking',
      category: 'Marketplace/Matching',
      status: 'Patent Pending',
      relatedFeatures: ['Professional Matching', 'Quality Ratings', 'Service Tracking']
    }
  ]);

  const [newEntry, setNewEntry] = useState<Partial<IPLogEntry>>({
    innovationName: '',
    dateOfInvention: '',
    firstUseDate: '',
    inventors: [],
    description: '',
    category: '',
    status: 'Documented'
  });

  const handleAddEntry = () => {
    if (newEntry.innovationName && newEntry.dateOfInvention) {
      const entry: IPLogEntry = {
        id: `IP${String(ipLog.length + 1).padStart(3, '0')}`,
        innovationName: newEntry.innovationName || '',
        dateOfInvention: newEntry.dateOfInvention || '',
        firstUseDate: newEntry.firstUseDate || newEntry.dateOfInvention || '',
        inventors: newEntry.inventors || [],
        description: newEntry.description || '',
        category: newEntry.category || 'General',
        status: newEntry.status as any || 'Documented',
        relatedFeatures: []
      };
      
      setIpLog([...ipLog, entry]);
      setNewEntry({
        innovationName: '',
        dateOfInvention: '',
        firstUseDate: '',
        inventors: [],
        description: '',
        category: '',
        status: 'Documented'
      });
    }
  };

  const handleExportCSV = () => {
    const csvHeader = 'ID,Innovation Name,Date of Invention,First Use Date,Inventors,Description,Category,Status,Related Features\n';
    const csvContent = ipLog.map(entry => 
      `"${entry.id}","${entry.innovationName}","${entry.dateOfInvention}","${entry.firstUseDate}","${entry.inventors.join('; ')}","${entry.description}","${entry.category}","${entry.status}","${entry.relatedFeatures.join('; ')}"`
    ).join('\n');
    
    const exportData = csvHeader + csvContent;
    console.log('Exporting IP Log CSV:', exportData);
  };

  const handleExportJSON = () => {
    const exportData = {
      platform: 'BFO Family Office Platform',
      exportDate: new Date().toISOString(),
      totalEntries: ipLog.length,
      categories: [...new Set(ipLog.map(entry => entry.category))],
      inventors: [...new Set(ipLog.flatMap(entry => entry.inventors))],
      log: ipLog
    };
    
    console.log('Exporting IP Log JSON:', exportData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Granted': return 'bg-green-100 text-green-700 border-green-300';
      case 'Filed': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Patent Pending': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryStats = () => {
    const stats = ipLog.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([category, count]) => ({ category, count }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">IP Invention Log & Export</h2>
          <p className="text-muted-foreground">
            Comprehensive record of all platform innovations with dates and inventor attribution
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleExportJSON} className="bg-gradient-to-r from-green-500 to-green-600">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{ipLog.length}</div>
            <div className="text-sm text-muted-foreground">Total Innovations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {[...new Set(ipLog.flatMap(entry => entry.inventors))].length}
            </div>
            <div className="text-sm text-muted-foreground">Inventors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {ipLog.filter(entry => entry.status === 'Patent Pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Patent Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {[...new Set(ipLog.map(entry => entry.category))].length}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New IP Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Innovation Name"
              value={newEntry.innovationName}
              onChange={(e) => setNewEntry({...newEntry, innovationName: e.target.value})}
            />
            <Input
              type="date"
              placeholder="Date of Invention"
              value={newEntry.dateOfInvention}
              onChange={(e) => setNewEntry({...newEntry, dateOfInvention: e.target.value})}
            />
            <Input
              type="date"
              placeholder="First Use Date"
              value={newEntry.firstUseDate}
              onChange={(e) => setNewEntry({...newEntry, firstUseDate: e.target.value})}
            />
            <Input
              placeholder="Category"
              value={newEntry.category}
              onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
            />
          </div>
          <div className="mt-4">
            <Input
              placeholder="Description"
              value={newEntry.description}
              onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
            />
          </div>
          <Button onClick={handleAddEntry} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            {getCategoryStats().map(({ category, count }, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span className="text-sm font-medium">{category}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {ipLog.map((entry, index) => (
          <Card key={entry.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{entry.innovationName}</h3>
                  <p className="text-sm text-muted-foreground">{entry.id}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(entry.status)}>
                  {entry.status}
                </Badge>
              </div>
              
              <p className="text-sm mb-3">{entry.description}</p>
              
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Invented: {entry.dateOfInvention}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>First Use: {entry.firstUseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Inventors: {entry.inventors.join(', ')}</span>
                </div>
                <div>
                  <Badge variant="secondary" className="text-xs">
                    {entry.category}
                  </Badge>
                </div>
              </div>
              
              {entry.relatedFeatures.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-muted-foreground">Related Features: </span>
                  {entry.relatedFeatures.map((feature, featureIndex) => (
                    <Badge key={featureIndex} variant="outline" className="text-xs mr-1">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}