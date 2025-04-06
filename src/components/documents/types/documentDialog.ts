
export interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  category?: string;
  activeCategory?: string;
  documentCategories?: any;
  onFileUpload?: (file: File, customName: string, category?: string) => any;
}

export interface FileInfo {
  file: File;
  name: string;
  description?: string;
}
