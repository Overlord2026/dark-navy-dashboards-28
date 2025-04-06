
import React from "react";
import { FileText, FileImage, FileSpreadsheet, File } from "lucide-react";
import { DocumentIconProps } from "./types/sharedDocuments";

export function DocumentIcon({ type, className = "" }: DocumentIconProps) {
  switch (type) {
    case "pdf":
      return <FileText className={`h-5 w-5 text-red-500 ${className}`} />;
    case "image":
      return <FileImage className={`h-5 w-5 text-blue-500 ${className}`} />;
    case "spreadsheet":
      return <FileSpreadsheet className={`h-5 w-5 text-green-500 ${className}`} />;
    default:
      return <File className={`h-5 w-5 text-gray-500 ${className}`} />;
  }
}
