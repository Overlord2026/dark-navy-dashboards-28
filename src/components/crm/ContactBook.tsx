import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Search, Plus, Phone, Mail, Calendar, MoreVertical, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  status: 'lead' | 'prospect' | 'client' | 'inactive';
  tags: string[];
  notes?: string;
  last_contact?: string;
  created_at: string;
  user_id: string;
}

export function ContactBook() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    status: 'lead' as const,
    tags: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    try {
      const contactData = {
        ...newContact,
        tags: newContact.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        user_id: user?.id
      };

      const { error } = await supabase
        .from('crm_contacts')
        .insert([contactData]);

      if (error) throw error;

      toast.success('Contact added successfully');
      setIsAddDialogOpen(false);
      setNewContact({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        status: 'lead',
        tags: '',
        notes: ''
      });
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading contacts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="prospect">Prospects</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newContact.status} onValueChange={(value: any) => setNewContact({...newContact, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newContact.tags}
                  onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
              <Button onClick={handleAddContact} className="w-full">
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
                    <AvatarFallback>
                      {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{contact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                    {contact.role && (
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                    <DropdownMenuItem>View History</DropdownMenuItem>
                    <DropdownMenuItem>Add to Pipeline</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(contact.status)}>
                  {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </Badge>
                {contact.last_contact && (
                  <span className="text-xs text-muted-foreground">
                    Last contact: {new Date(contact.last_contact).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                {contact.phone && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                )}
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Meet
                </Button>
              </div>
              
              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{contact.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'No contacts found matching your criteria' 
              : 'No contacts yet. Add your first contact to get started.'}
          </div>
        </div>
      )}
    </div>
  );
}