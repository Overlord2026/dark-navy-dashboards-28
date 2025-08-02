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
import { PlayCircle, X } from 'lucide-react';

const categories = ['Tax', 'Retirement', 'Estate', 'Investment', 'Insurance', 'Planning', 'Business'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const availableBadges = ['popular', 'editor-choice', 'new', 'premium', 'free'];

export function CourseUploadForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
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
    video_url: '',
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

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `thumbnail-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error } = await supabase.storage
      .from('education-content')
      .upload(filePath, file);

    if (error) throw error;
    return filePath;
  };

  const extractVideoId = (url: string) => {
    // Extract video ID from Vimeo or YouTube URLs
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const validateVideoUrl = (url: string) => {
    return url.includes('vimeo.com') || url.includes('youtube.com') || url.includes('youtu.be');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.category || !formData.video_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateVideoUrl(formData.video_url)) {
      toast.error('Please enter a valid Vimeo or YouTube URL');
      return;
    }

    setLoading(true);
    try {
      // Upload thumbnail if provided
      let thumbnailPath = null;
      if (thumbnailImage) {
        thumbnailPath = await uploadThumbnail(thumbnailImage);
      }

      // Save to database
      const { error } = await supabase
        .from('education_content')
        .insert({
          title: formData.title,
          description: formData.description,
          content_type: 'course',
          category: formData.category,
          difficulty: formData.difficulty,
          author: formData.author || user.email?.split('@')[0],
          duration: formData.duration,
          tags,
          badges: selectedBadges,
          video_url: formData.video_url,
          cover_image_path: thumbnailPath,
          is_featured: formData.is_featured,
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Course added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        author: '',
        category: '',
        difficulty: 'Beginner',
        duration: '',
        video_url: '',
        is_featured: false
      });
      setThumbnailImage(null);
      setTags([]);
      setSelectedBadges([]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Advanced Tax Planning Strategies"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Instructor</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            placeholder="Instructor name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Comprehensive course covering..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video_url">Video URL (Vimeo/YouTube) *</Label>
        <Input
          id="video_url"
          type="url"
          value={formData.video_url}
          onChange={(e) => handleInputChange('video_url', e.target.value)}
          placeholder="https://vimeo.com/123456789 or https://youtube.com/watch?v=..."
          required
        />
        <p className="text-sm text-muted-foreground">
          Enter a Vimeo or YouTube URL for the course video
        </p>
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
            placeholder="e.g., 2.5 hours"
          />
        </div>
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

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Course Thumbnail (optional)</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnailImage(e.target.files?.[0] || null)}
        />
        {thumbnailImage && (
          <div className="text-sm text-muted-foreground">
            {thumbnailImage.name}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Upload a custom thumbnail or we'll use the video's default thumbnail
        </p>
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
            <PlayCircle className="mr-2 h-4 w-4 animate-spin" />
            Adding Course...
          </>
        ) : (
          <>
            <PlayCircle className="mr-2 h-4 w-4" />
            Add Course
          </>
        )}
      </Button>
    </form>
  );
}