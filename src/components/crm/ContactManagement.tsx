import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Filter,
  History,
  Send,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  lead_source: string;
  status: 'prospect' | 'lead' | 'client' | 'inactive';
  tags: string[];
  notes?: string;
  last_contact_date?: string;
  next_follow_up?: string;
  created_at: string;
  updated_at: string;
}

interface CommunicationHistory {
  id: string;
  contact_id: string;
  type: 'email' | 'phone' | 'meeting' | 'note';
  subject?: string;
  content: string;
  created_at: string;
  created_by: string;
}

const contactStatuses = [
  { value: 'prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
  { value: 'lead', label: 'Lead', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'client', label: 'Client', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
];

export function ContactManagement() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [communicationHistory, setCommunicationHistory] = useState<CommunicationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);

  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    lead_source: 'manual',
    status: 'prospect' as const,
    tags: [] as string[],
    notes: ''
  });

  const [newCommunication, setNewCommunication] = useState({
    type: 'note' as const,
    subject: '',
    content: ''
  });

  const allTags = ['high-value', 'qualified', 'referral', 'vip', 'follow-up', 'interested', 'not-interested'];

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter, tagFilter]);

  const loadContacts = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('advisor_id', user.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Mock data for demo
      setContacts([
        {
          id: '1',
          first_name: 'John',
          last_name: 'Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          company: 'Tech Corp',
          title: 'CEO',
          lead_source: 'website',
          status: 'lead',
          tags: ['high-value', 'qualified'],
          notes: 'Interested in retirement planning',
          last_contact_date: new Date().toISOString(),
          next_follow_up: new Date(Date.now() + 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah@example.com',
          phone: '+1-555-0124',
          company: 'Design Co',
          title: 'Founder',
          lead_source: 'referral',
          status: 'client',
          tags: ['vip', 'referral'],
          notes: 'Portfolio management client',
          last_contact_date: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(contact => contact.tags.includes(tagFilter));
    }

    setFilteredContacts(filtered);
  };

  const loadCommunicationHistory = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('communication_history')
        .select('*')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunicationHistory(data || []);
    } catch (error) {
      console.error('Error loading communication history:', error);
      // Mock data
      setCommunicationHistory([
        {
          id: '1',
          contact_id: contactId,
          type: 'email',
          subject: 'Follow-up on portfolio discussion',
          content: 'Thanks for your time today. Attached are the portfolio proposals we discussed.',
          created_at: new Date().toISOString(),
          created_by: 'advisor-1'
        },
        {
          id: '2',
          contact_id: contactId,
          type: 'phone',
          content: 'Called to discuss investment timeline. Client wants to start within 3 months.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          created_by: 'advisor-1'
        }
      ]);
    }
  };

  const createContact = async () => {
    if (!newContact.first_name || !newContact.last_name || !newContact.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          ...newContact,
          advisor_id: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Contact Created",
        description: "New contact has been added",
      });

      setIsCreateOpen(false);
      setNewContact({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        lead_source: 'manual',
        status: 'prospect',
        tags: [],
        notes: ''
      });

      loadContacts();
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: "Error",
        description: "Failed to create contact",
        variant: "destructive",
      });
    }
  };

  const updateContact = async () => {
    if (!selectedContact) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          ...newContact,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedContact.id);

      if (error) throw error;

      toast({
        title: "Contact Updated",
        description: "Contact information has been saved",
      });

      setIsEditOpen(false);
      setSelectedContact(null);
      loadContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  const addCommunication = async () => {
    if (!selectedContact || !newCommunication.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in the communication content",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('communication_history')
        .insert([{
          contact_id: selectedContact.id,
          type: newCommunication.type,
          subject: newCommunication.subject,
          content: newCommunication.content,
          created_by: user.user.id
        }]);

      if (error) throw error;

      // Update contact's last contact date
      await supabase
        .from('contacts')
        .update({ last_contact_date: new Date().toISOString() })
        .eq('id', selectedContact.id);

      toast({
        title: "Communication Added",
        description: "Communication has been logged",
      });

      setIsCommunicationOpen(false);
      setNewCommunication({
        type: 'note',
        subject: '',
        content: ''
      });

      loadCommunicationHistory(selectedContact.id);
      loadContacts();
    } catch (error) {
      console.error('Error adding communication:', error);
      toast({
        title: "Error",
        description: "Failed to add communication",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Contact Deleted",
        description: "Contact has been removed",
      });

      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = contactStatuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {contactStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {filteredContacts.length} contacts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(contact.status)}>
                  {contact.status}
                </Badge>
              </div>

              {contact.company && (
                <p className="text-sm text-muted-foreground mb-2">
                  {contact.title} at {contact.company}
                </p>
              )}

              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Last contact: {contact.last_contact_date ? format(new Date(contact.last_contact_date), 'MMM d') : 'Never'}</span>
                <span>Added: {format(new Date(contact.created_at), 'MMM d')}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedContact(contact);
                    loadCommunicationHistory(contact.id);
                  }}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedContact(contact);
                    setNewContact({
                      first_name: contact.first_name,
                      last_name: contact.last_name,
                      email: contact.email,
                      phone: contact.phone || '',
                      company: contact.company || '',
                      title: contact.title || '',
                      lead_source: contact.lead_source,
                      status: contact.status,
                      tags: contact.tags,
                      notes: contact.notes || ''
                    });
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteContact(contact.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Contact Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input
                value={newContact.first_name}
                onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input
                value={newContact.last_name}
                onChange={(e) => setNewContact({...newContact, last_name: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={newContact.company}
                onChange={(e) => setNewContact({...newContact, company: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newContact.title}
                onChange={(e) => setNewContact({...newContact, title: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={newContact.status} 
                onValueChange={(value: any) => setNewContact({...newContact, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contactStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lead Source</Label>
              <Select 
                value={newContact.lead_source} 
                onValueChange={(value) => setNewContact({...newContact, lead_source: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={newContact.notes}
              onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
              placeholder="Additional notes about this contact..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createContact}>
              Create Contact
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Contact Detail Modal */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContact?.first_name} {selectedContact?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">Communication History</TabsTrigger>
                <TabsTrigger value="add-communication">Add Communication</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Contact Information</Label>
                    <div className="space-y-2 mt-2">
                      <p className="text-sm">{selectedContact.email}</p>
                      {selectedContact.phone && <p className="text-sm">{selectedContact.phone}</p>}
                      {selectedContact.company && (
                        <p className="text-sm">
                          {selectedContact.title && `${selectedContact.title} at `}
                          {selectedContact.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status & Tags</Label>
                    <div className="space-y-2 mt-2">
                      <Badge className={getStatusColor(selectedContact.status)}>
                        {selectedContact.status}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {selectedContact.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedContact.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedContact.notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  {communicationHistory.map((comm) => (
                    <div key={comm.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCommunicationIcon(comm.type)}
                          <span className="font-medium capitalize">{comm.type}</span>
                          {comm.subject && <span className="text-muted-foreground">- {comm.subject}</span>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comm.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comm.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="add-communication" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Communication Type</Label>
                    <Select 
                      value={newCommunication.type} 
                      onValueChange={(value: any) => setNewCommunication({...newCommunication, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(newCommunication.type === 'email' || newCommunication.type === 'meeting') && (
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={newCommunication.subject}
                        onChange={(e) => setNewCommunication({...newCommunication, subject: e.target.value})}
                        placeholder="Communication subject..."
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={newCommunication.content}
                      onChange={(e) => setNewCommunication({...newCommunication, content: e.target.value})}
                      placeholder="Enter communication details..."
                      rows={4}
                    />
                  </div>
                  
                  <Button onClick={addCommunication}>
                    <Send className="h-4 w-4 mr-2" />
                    Add Communication
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as create, but using updateContact function */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={newContact.first_name}
                  onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={newContact.last_name}
                  onChange={(e) => setNewContact({...newContact, last_name: e.target.value})}
                />
              </div>
            </div>
            
            {/* Additional form fields... */}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateContact}>
                Update Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}