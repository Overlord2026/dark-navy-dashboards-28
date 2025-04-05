import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, FilePlus, Upload, Check, AlertTriangle } from "lucide-react";
import { IntegrationStatusBadge } from "@/components/integrations/IntegrationStatusBadge";

export interface ParsedBillData {
  fileName?: string;
  vendorName: { value: string; confidence: number };
  amount: { value: number; confidence: number };
  dueDate: { value: string; confidence: number };
  category: { value: string; confidence: number };
  billImage?: string;
}

interface FileUploadProcessorProps {
  onProcessComplete?: (parsedData: ParsedBillData) => void;
  onUploadComplete: (parsedData: ParsedBillData) => void;
}

export function FileUploadProcessor({ onProcessComplete, onUploadComplete }: FileUploadProcessorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setProgress(0);
  };

  const simulateProcessing = () => {
    setStatus("uploading");
    setProcessing(true);
    setProgress(0);

    // Simulate file upload
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          startAIProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startAIProcessing = () => {
    setStatus("processing");
    setProgress(0);

    // Simulate AI processing
    const processingInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(processingInterval);
          completeProcessing();
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const completeProcessing = () => {
    setStatus("complete");
    setProcessing(false);

    // Mock data that would come from AI processing
    const mockParsedData: ParsedBillData = {
      fileName: file?.name || "Uploaded Bill",
      vendorName: { value: "City Power & Light", confidence: 92 },
      amount: { value: 124.56, confidence: 96 },
      dueDate: { value: "2025-04-25", confidence: 88 },
      category: { value: "Utilities", confidence: 78 },
      billImage: file ? URL.createObjectURL(file) : "",
    };

    // Notify parent component using the appropriate callback
    if (onProcessComplete) {
      onProcessComplete(mockParsedData);
    }
    onUploadComplete(mockParsedData);
  };

  const handleStartProcess = () => {
    if (file) {
      simulateProcessing();
    }
  };

  const renderStatus = () => {
    switch (status) {
      case "idle":
        return null;
      case "uploading":
        return <IntegrationStatusBadge status="pending" className="my-2" />;
      case "processing":
        return <IntegrationStatusBadge status="pending" className="my-2" />;
      case "complete":
        return <IntegrationStatusBadge status="connected" className="my-2" />;
      case "error":
        return <IntegrationStatusBadge status="error" className="my-2" />;
    }
  };

  const renderContent = () => {
    if (!file) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <FilePlus className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="mb-4 text-center text-muted-foreground">
            Upload your bill to have our AI automatically extract the details
          </p>
          <FileUpload 
            onFileChange={handleFileChange} 
            accept="application/pdf,image/*"
            className="w-full"
          />
        </div>
      );
    }

    if (processing) {
      return (
        <div className="py-8">
          <p className="mb-2 text-center font-medium">
            {status === "uploading" ? "Uploading file..." : "AI is analyzing your bill..."}
          </p>
          <Progress value={progress} className="mb-4" />
          <p className="text-sm text-center text-muted-foreground">
            {status === "uploading" 
              ? "We're uploading your file to our secure servers" 
              : "Our AI is extracting vendor details, amount, and due date"}
          </p>
        </div>
      );
    }

    if (status === "complete") {
      return (
        <div className="py-4 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Check className="h-6 w-6 text-green-500" />
            <p className="font-medium">Processing Complete!</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Your bill has been processed. You can now review the extracted information.
          </p>
        </div>
      );
    }

    return (
      <div className="py-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0 h-12 w-12 rounded bg-muted flex items-center justify-center">
            <FilePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB • {file.type}
            </p>
          </div>
        </div>
        <Button onClick={handleStartProcess} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Process Bill
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          AI Bill Processing
        </CardTitle>
        <CardDescription>
          Upload your bill and our AI will automatically extract the details
        </CardDescription>
        {renderStatus()}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      {status === "complete" && (
        <CardFooter>
          <Button className="w-full" onClick={() => {
            setFile(null);
            setStatus("idle");
          }}>
            Process Another Bill
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
