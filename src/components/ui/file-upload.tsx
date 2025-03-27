
import React, { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

export interface FileUploadProps {
  onFileSelect: (file: File, filename: string) => void;
  onCancel?: () => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  buttonText?: string;
  placeholder?: string;
  filenameInputLabel?: string;
  showFilenameInput?: boolean;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  onCancel,
  className,
  accept = "*/*",
  multiple = false,
  maxSize = 20, // Default max size is 20MB
  label = "Upload a file",
  buttonText = "Browse Files",
  placeholder = "Drag and drop your files here or click to browse",
  filenameInputLabel = "Name",
  showFilenameInput = true,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File exceeds maximum size of ${maxSize}MB`);
      return false;
    }
    
    if (accept !== "*/*") {
      const fileType = file.type;
      const acceptedTypes = accept.split(",").map(type => type.trim());
      
      // Check if the file type matches any of the accepted types
      const isAccepted = acceptedTypes.some(type => {
        if (type.includes("*")) {
          const typeParts = type.split("/");
          const fileParts = fileType.split("/");
          return typeParts[0] === "*" || (typeParts[0] === fileParts[0] && (typeParts[1] === "*" || typeParts[1] === fileParts[1]));
        }
        return type === fileType;
      });
      
      if (!isAccepted) {
        setError(`File type not accepted. Please upload a file with the following types: ${accept}`);
        return false;
      }
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && !disabled) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0] && !disabled) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    if (validateFile(file)) {
      setSelectedFile(file);
      setFilename(file.name);
      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const handleSubmit = () => {
    if (selectedFile && filename) {
      onFileSelect(selectedFile, filename);
      // Reset state
      setSelectedFile(null);
      setFilename("");
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      <div
        className={cn(
          "border-2 border-dashed border-muted rounded-lg p-10 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {placeholder}
        </p>
        <Button variant="outline" size="sm" disabled={disabled}>
          {buttonText}
        </Button>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
      
      {selectedFile && !isUploading && (
        <div className="space-y-4">
          {showFilenameInput && (
            <div className="space-y-2">
              <label htmlFor="filename" className="text-sm font-medium">
                {filenameInputLabel}
              </label>
              <Textarea
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter file name"
                className="min-h-[40px] h-10 py-2"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit}>
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
