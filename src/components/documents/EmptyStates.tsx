
import React from "react";
import { Button } from "@/components/ui/button";
import { FolderIcon, FileIcon, UploadIcon } from "lucide-react";

export const NoCategorySelectedState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
      <FolderIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        No Category Selected
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
        Please select a document category from the list on the left to view your documents.
      </p>
    </div>
  );
};

export const NoDocumentsState = ({ onUploadClick, categoryName }: { onUploadClick: () => void; categoryName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
      <FileIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        No Documents Found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
        There are no documents in the <span className="font-medium">{categoryName}</span> category yet.
      </p>
      <Button onClick={onUploadClick} className="flex items-center gap-2">
        <UploadIcon className="h-4 w-4" />
        Upload Document
      </Button>
    </div>
  );
};

// Add this to export a combined component
export const EmptyStates = {
  NoCategorySelected: NoCategorySelectedState,
  NoDocuments: NoDocumentsState
};
