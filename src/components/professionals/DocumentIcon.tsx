
import React from "react";
import { FileText, Image, FileSpreadsheet, File } from "lucide-react";

interface DocumentIconProps {
  type: string;
}

export function DocumentIcon({ type }: DocumentIconProps) {
  switch (type) {
    case "pdf":
    case "document":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "image":
      return <Image className="h-4 w-4 text-green-500" />;
    case "spreadsheet":
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
}
