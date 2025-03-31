
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export interface FileUploadProps {
  onFileChange: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileChange,
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = "",
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (maxSize && file.size > maxSize) {
      setError(`File size exceeds the ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`);
      return;
    }

    onFileChange(file);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        type="button"
        onClick={handleClick}
        className="gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0 w-full py-6 flex items-center justify-center"
      >
        <Upload className="h-5 w-5" />
        Choose File to Upload
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
