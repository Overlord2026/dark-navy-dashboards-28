import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VaultWatermark } from './VaultWatermark';
import { PatentPendingBadge } from './PatentPendingBadge';
import { Upload, FileText, Image, Video, Music, Archive, X, Check, FolderPlus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadFile {
  id: string;
  file: File;
  category: string;
  tags: string[];
  description: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface EnhancedUploadSystemProps {
  vaultId: string;
  onUploadComplete?: (files: UploadFile[]) => void;
}

const documentCategories = [
  { value: 'legal', label: 'Legal Documents', icon: FileText },
  { value: 'financial', label: 'Financial Records', icon: FileText },
  { value: 'insurance', label: 'Insurance Policies', icon: FileText },
  { value: 'property', label: 'Property Documents', icon: FileText },
  { value: 'personal', label: 'Personal Documents', icon: FileText },
  { value: 'media', label: 'Photos & Videos', icon: Image },
  { value: 'audio', label: 'Audio Recordings', icon: Music },
  { value: 'other', label: 'Other Files', icon: Archive },
];

export const EnhancedUploadSystem: React.FC<EnhancedUploadSystemProps> = ({
  vaultId,
  onUploadComplete
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('legal');
  const [bulkTags, setBulkTags] = useState<string>('');
  const [bulkDescription, setBulkDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      category: selectedCategory,
      tags: bulkTags.split(',').map(tag => tag.trim()).filter(Boolean),
      description: bulkDescription,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [selectedCategory, bulkTags, bulkDescription]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'audio/*': ['.mp3', '.wav', '.aac', '.flac'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    maxFileSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateFileMetadata = (id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const addTag = (fileId: string, tag: string) => {
    updateFileMetadata(fileId, {
      tags: [...files.find(f => f.id === fileId)?.tags || [], tag.trim()]
    });
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      const newTags = [...file.tags];
      newTags.splice(tagIndex, 1);
      updateFileMetadata(fileId, { tags: newTags });
    }
  };

  const simulateUpload = async (file: UploadFile) => {
    updateFileMetadata(file.id, { status: 'uploading' });
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      updateFileMetadata(file.id, { progress });
    }
    
    updateFileMetadata(file.id, { status: 'completed' });
  };

  const startUpload = async () => {
    setIsUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    // Upload files in parallel with max concurrency
    const concurrency = 3;
    for (let i = 0; i < pendingFiles.length; i += concurrency) {
      const batch = pendingFiles.slice(i, i + concurrency);
      await Promise.all(batch.map(simulateUpload));
    }
    
    setIsUploading(false);
    onUploadComplete?.(files);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    return FileText;
  };

  const overallProgress = files.length > 0 
    ? files.reduce((sum, file) => sum + file.progress, 0) / files.length 
    : 0;

  return (
    <div className="space-y-6 relative">
      <VaultWatermark />
      <PatentPendingBadge />
      
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            {t('vault.upload.title', 'Enhanced Document Upload')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bulk Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">
                {t('vault.upload.category', 'Default Category')}
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tags">
                {t('vault.upload.tags', 'Default Tags (comma-separated)')}
              </Label>
              <Input
                id="tags"
                value={bulkTags}
                onChange={(e) => setBulkTags(e.target.value)}
                placeholder="important, 2024, estate-planning"
              />
            </div>
            
            <div>
              <Label htmlFor="description">
                {t('vault.upload.description', 'Default Description')}
              </Label>
              <Input
                id="description"
                value={bulkDescription}
                onChange={(e) => setBulkDescription(e.target.value)}
                placeholder={t('vault.upload.descriptionPlaceholder', 'Brief description...')}
              />
            </div>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              "hover:border-primary hover:bg-primary/5",
              isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">
                {t('vault.upload.dropFiles', 'Drop files here...')}
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  {t('vault.upload.dragDrop', 'Drag & drop files here, or click to select')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('vault.upload.supportedTypes', 'Supports: PDF, Word, Excel, Images, Videos, Audio (Max 100MB each)')}
                </p>
              </div>
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {t('vault.upload.fileList', 'Files to Upload')} ({files.length})
                </h3>
                {files.some(f => f.status === 'pending') && (
                  <Button onClick={startUpload} disabled={isUploading}>
                    {isUploading ? t('common.uploading', 'Uploading...') : t('common.upload', 'Upload All')}
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('vault.upload.overallProgress', 'Overall Progress')}</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.file.type);
                  return (
                    <Card key={file.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <FileIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium truncate">{file.file.name}</h4>
                            <div className="flex items-center gap-2">
                              {file.status === 'completed' && (
                                <Check className="h-4 w-4 text-emerald-500" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                disabled={file.status === 'uploading'}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <Select
                              value={file.category}
                              onValueChange={(value) => updateFileMetadata(file.id, { category: value })}
                              disabled={file.status === 'uploading'}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {documentCategories.map(cat => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Input
                              value={file.description}
                              onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                              placeholder={t('vault.upload.description', 'Description...')}
                              className="h-8"
                              disabled={file.status === 'uploading'}
                            />
                            
                            <div className="text-sm text-muted-foreground">
                              {(file.file.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {file.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                                {file.status !== 'uploading' && (
                                  <button
                                    onClick={() => removeTag(file.id, index)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </Badge>
                            ))}
                            {file.status !== 'uploading' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  const tag = prompt(t('vault.upload.addTag', 'Add tag:'));
                                  if (tag) addTag(file.id, tag);
                                }}
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {t('common.add', 'Add')}
                              </Button>
                            )}
                          </div>
                          
                          {file.status === 'uploading' && (
                            <Progress value={file.progress} className="h-1" />
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};