import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', is_published: true, sort_order: 0 });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleCreateFAQ = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([newFaq])
        .select()
        .single();

      if (error) throw error;

      setFaqs([...faqs, data]);
      setNewFaq({ question: '', answer: '', is_published: true, sort_order: 0 });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFAQ = async (faq: FAQ) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({
          question: faq.question,
          answer: faq.answer,
          is_published: faq.is_published,
          sort_order: faq.sort_order,
        })
        .eq('id', faq.id);

      if (error) throw error;

      setFaqs(faqs.map(f => f.id === faq.id ? faq : f));
      setEditingFaq(null);
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFaqs(faqs.filter(f => f.id !== id));
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Manage FAQs</h1>
          </div>
          <div>Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage FAQs</h1>
            <p className="text-muted-foreground">
              Create and manage frequently asked questions for your help center.
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {/* Create New FAQ */}
        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Create New FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <Input
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  placeholder="Enter the question..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Answer</label>
                <Textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  placeholder="Enter the answer..."
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newFaq.is_published}
                    onChange={(e) => setNewFaq({ ...newFaq, is_published: e.target.checked })}
                  />
                  <span className="text-sm">Published</span>
                </label>
                <div className="flex items-center space-x-2">
                  <label className="text-sm">Sort Order:</label>
                  <Input
                    type="number"
                    value={newFaq.sort_order}
                    onChange={(e) => setNewFaq({ ...newFaq, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateFAQ} disabled={!newFaq.question || !newFaq.answer}>
                  <Save className="h-4 w-4 mr-2" />
                  Save FAQ
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                {editingFaq?.id === faq.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Question</label>
                      <Input
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Answer</label>
                      <Textarea
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingFaq.is_published}
                          onChange={(e) => setEditingFaq({ ...editingFaq, is_published: e.target.checked })}
                        />
                        <span className="text-sm">Published</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm">Sort Order:</label>
                        <Input
                          type="number"
                          value={editingFaq.sort_order}
                          onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: parseInt(e.target.value) || 0 })}
                          className="w-20"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleUpdateFAQ(editingFaq)} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingFaq(null)} size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-lg">{faq.question}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={faq.is_published ? "default" : "secondary"}>
                          {faq.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingFaq(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFAQ(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Sort Order: {faq.sort_order}</span>
                      <span>Created: {new Date(faq.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {faqs.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No FAQs found. Create your first FAQ to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}