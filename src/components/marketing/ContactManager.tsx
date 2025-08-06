import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Linkedin, 
  ExternalLink,
  Tag,
  Users,
  UserCheck,
  UserX,
  Download
} from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  title?: string;
  linkedinUrl?: string;
  phone?: string;
  persona: string;
  status: 'active' | 'bounced' | 'unsubscribed' | 'pending';
  tags: string[];
  lastContact?: string;
  campaignStatus: 'not_sent' | 'sent' | 'opened' | 'clicked' | 'replied';
  source: string;
  vipLevel: 'standard' | 'vip' | 'founding';
}

export function ContactManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Mock data - replace with real data from your backend
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@wealth.com',
      organization: 'Smith Wealth Advisors',
      title: 'Senior Financial Advisor',
      linkedinUrl: 'https://linkedin.com/in/johnsmith',
      phone: '+1-555-0123',
      persona: 'advisor',
      status: 'active',
      tags: ['vip', 'referral'],
      lastContact: '2024-01-10',
      campaignStatus: 'opened',
      source: 'LinkedIn',
      vipLevel: 'vip'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@johnsoncpa.com',
      organization: 'Johnson CPA Firm',
      title: 'Managing Partner',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      persona: 'accountant',
      status: 'active',
      tags: ['founding'],
      lastContact: '2024-01-08',
      campaignStatus: 'clicked',
      source: 'Referral',
      vipLevel: 'founding'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike.wilson@law.com',
      organization: 'Wilson & Associates',
      title: 'Estate Planning Attorney',
      persona: 'attorney',
      status: 'bounced',
      tags: [],
      campaignStatus: 'sent',
      source: 'CSV Upload',
      vipLevel: 'standard'
    }
  ]);

  const personas = ['all', 'advisor', 'accountant', 'attorney', 'property_manager', 'healthcare', 'family_office'];
  const statuses = ['all', 'active', 'bounced', 'unsubscribed', 'pending'];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPersona = selectedPersona === 'all' || contact.persona === selectedPersona;
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    
    return matchesSearch && matchesPersona && matchesStatus;
  });

  const handleBulkAction = (action: 'tag' | 'campaign' | 'delete' | 'export') => {
    console.log(`Bulk action: ${action} on contacts:`, selectedContacts);
    // Implement bulk actions
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleAllSelection = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length 
        ? [] 
        : filteredContacts.map(c => c.id)
    );
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignStatusColor = (status: Contact['campaignStatus']) => {
    switch (status) {
      case 'not_sent': return 'bg-gray-100 text-gray-600';
      case 'sent': return 'bg-blue-100 text-blue-600';
      case 'opened': return 'bg-purple-100 text-purple-600';
      case 'clicked': return 'bg-green-100 text-green-600';
      case 'replied': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getVipBadge = (vipLevel: Contact['vipLevel']) => {
    switch (vipLevel) {
      case 'founding': return <Badge className="bg-gold text-white">Founding</Badge>;
      case 'vip': return <Badge variant="secondary">VIP</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contact Database</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <select 
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {personas.map(persona => (
                <option key={persona} value={persona}>
                  {persona === 'all' ? 'All Personas' : persona.charAt(0).toUpperCase() + persona.slice(1)}
                </option>
              ))}
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
              <span className="text-sm font-medium">{selectedContacts.length} selected</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('tag')}>
                  <Tag className="h-3 w-3 mr-1" />
                  Tag
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('campaign')}>
                  <Mail className="h-3 w-3 mr-1" />
                  Add to Campaign
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Contact Table */}
          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={toggleAllSelection}
                        className="rounded"
                      />
                    </th>
                    <th className="p-3 text-left font-medium">Contact</th>
                    <th className="p-3 text-left font-medium">Organization</th>
                    <th className="p-3 text-left font-medium">Persona</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Campaign</th>
                    <th className="p-3 text-left font-medium">Last Contact</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/25">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                              {getVipBadge(contact.vipLevel)}
                            </div>
                            <div className="text-sm text-muted-foreground">{contact.email}</div>
                            {contact.phone && (
                              <div className="text-xs text-muted-foreground">{contact.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{contact.organization}</div>
                          {contact.title && (
                            <div className="text-sm text-muted-foreground">{contact.title}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="capitalize">
                          {contact.persona}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getCampaignStatusColor(contact.campaignStatus)}>
                          {contact.campaignStatus.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-muted-foreground">
                          {contact.lastContact || 'Never'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="h-3 w-3" />
                          </Button>
                          {contact.linkedinUrl && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contacts found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}