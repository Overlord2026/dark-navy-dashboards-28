
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadFieldProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
  description?: string;
  showPreview?: boolean;
}

export function FileUploadField({
  onFileSelect,
  accept = "application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  maxSizeMB = 10,
  className,
  label = "Upload File",
  description = "Drag & drop or click to browse",
  showPreview = true,
}: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
    
    // Create preview for images
    if (file.type.startsWith('image/') && showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    handleFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center text-center",
          isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary",
          selectedFile && "border-primary/50 bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {!selectedFile ? (
          <>
            <Upload className="h-10 w-10 mb-2 text-gray-400" />
            <p className="text-sm font-medium">{description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Max file size: {maxSizeMB}MB
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            {preview ? (
              <div className="relative mb-2">
                <img 
                  src={preview} 
                  alt="File preview" 
                  className="h-24 w-auto object-contain rounded"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center mb-2">
                <File className="h-8 w-8 mr-2 text-primary" />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-sm font-medium text-primary truncate w-full">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
        
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
