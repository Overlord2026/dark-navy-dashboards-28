import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Video, Image, Mic } from 'lucide-react';
import { useVaultUpload } from '@/hooks/useVaultUpload';
import { useVaultItems } from '@/hooks/useVaultItems';
import { Progress } from '@/components/ui/progress';

interface VaultItemUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function VaultItemUpload({ onClose, onSuccess }: VaultItemUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document' as 'document' | 'video' | 'photo' | 'audio' | 'letter',
    tags: [] as string[]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState('');
  
  const { uploadFile, uploadProgress, isUploading } = useVaultUpload();
  const { createItem } = useVaultItems();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Auto-detect type based on file
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, type: 'photo' }));
      } else if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, type: 'video' }));
      } else if (file.type.startsWith('audio/')) {
        setFormData(prev => ({ ...prev, type: 'audio' }));
      } else {
        setFormData(prev => ({ ...prev, type: 'document' }));
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.title.trim()) {
      return;
    }

    try {
      // Upload file if selected
      let fileUrl = '';
      if (selectedFile) {
        const uploadedFileId = await uploadFile('family-vault', selectedFile);
        if (uploadedFileId) {
          fileUrl = `vault/${uploadedFileId}/${selectedFile.name}`;
        }
      }

      // Create vault item
      await createItem({
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        file_url: fileUrl || null,
        file_size: selectedFile?.size || null,
        mime_type: selectedFile?.type || null,
        tags: formData.tags,
        owner_id: '', // Will be set by RLS
        encrypted: true,
        status: 'active'
      });

      onSuccess();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'photo':
        return <Image className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add to Legacy Vault
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label>File Upload</Label>
            <div className="mt-2">
              <input
                type="file"
                onChange={handleFileSelect}
                accept="*/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 mb-4 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Documents, photos, videos, audio files
                  </p>
                </div>
              </label>
            </div>
            {selectedFile && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getTypeIcon(formData.type)}
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <Badge variant="outline">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress.progress)}%</span>
              </div>
              <Progress value={uploadProgress.progress} />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Last Will and Testament"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Legal Document</SelectItem>
                  <SelectItem value="video">Video Message</SelectItem>
                  <SelectItem value="photo">Family Photo</SelectItem>
                  <SelectItem value="audio">Audio Recording</SelectItem>
                  <SelectItem value="letter">Personal Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add any additional context or instructions..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFile || !formData.title.trim() || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add to Vault'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}