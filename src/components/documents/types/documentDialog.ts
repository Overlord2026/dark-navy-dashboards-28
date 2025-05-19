
export interface FileInfo {
  file?: File;
  name: string;
  description?: string;
  url?: string;
  isExternalLink?: boolean;
}

export interface DocumentDialogProps {
  open?: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  category?: string;
  activeCategory?: string;
  documentCategories?: any[];
  onFileUpload?: (file: File, name: string, category?: string) => any;
  onLinkAdd?: (url: string, name: string, description?: string, category?: string) => any;
}
