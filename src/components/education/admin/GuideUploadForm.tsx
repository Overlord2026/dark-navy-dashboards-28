import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';

const categories = ['Tax', 'Retirement', 'Estate', 'Investment', 'Insurance', 'Planning', 'Business'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const availableBadges = ['popular', 'editor-choice', 'new', 'premium', 'free'];

export function GuideUploadForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    difficulty: 'Beginner',
    duration: '',
    external_url: '',
    is_featured: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('education-content')
      .upload(filePath, file);

    if (error) throw error;
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pdfFile || !formData.title || !formData.category) {
      toast.error('Please fill in all required fields and upload a PDF');
      return;
    }

    setLoading(true);
    try {
      // Upload PDF file
      const pdfPath = await uploadFile(pdfFile, 'guides');
      
      // Upload cover image if provided
      let coverImagePath = null;
      if (coverImage) {
        coverImagePath = await uploadFile(coverImage, 'covers');
      }

      // Save to database
      const { error } = await supabase
        .from('education_content')
        .insert({
          title: formData.title,
          description: formData.description,
          content_type: 'guide',
          category: formData.category,
          difficulty: formData.difficulty,
          author: formData.author || user.email?.split('@')[0],
          duration: formData.duration,
          tags,
          badges: selectedBadges,
          pdf_path: pdfPath,
          cover_image_path: coverImagePath,
          external_url: formData.external_url || null,
          file_size: pdfFile.size,
          is_featured: formData.is_featured,
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Guide uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        author: '',
        category: '',
        difficulty: 'Beginner',
        duration: '',
        external_url: '',
        is_featured: false
      });
      setPdfFile(null);
      setCoverImage(null);
      setTags([]);
      setSelectedBadges([]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload guide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="The Complete Guide to..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            placeholder="Author name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the guide content..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 30 min read"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="external_url">External URL (optional)</Label>
        <Input
          id="external_url"
          type="url"
          value={formData.external_url}
          onChange={(e) => handleInputChange('external_url', e.target.value)}
          placeholder="https://designer.com/guide-link"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <Label>Badges</Label>
        <div className="flex flex-wrap gap-2">
          {availableBadges.map(badge => (
            <Badge
              key={badge}
              variant={selectedBadges.includes(badge) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleBadge(badge)}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pdf">PDF File *</Label>
          <Input
            id="pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            required
          />
          {pdfFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover">Cover Image (optional)</Label>
          <Input
            id="cover"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          />
          {coverImage && (
            <div className="text-sm text-muted-foreground">
              {coverImage.name}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.is_featured}
          onChange={(e) => handleInputChange('is_featured', e.target.checked)}
        />
        <Label htmlFor="featured">Mark as featured content</Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Guide
          </>
        )}
      </Button>
    </form>
  );
}