
// This is now just a barrel export file for backwards compatibility
export { UploadDocumentDialog } from './dialogs/UploadDocumentDialog';
export { ShareDocumentDialog } from './dialogs/ShareDocumentDialog';
export { TaxReturnUploadDialog } from './dialogs/TaxReturnUploadDialog';
export type { UploadDocumentDialogProps } from './dialogs/UploadDocumentDialog';
export type { ShareDocumentDialogProps } from './dialogs/ShareDocumentDialog';
export type { TaxReturnUploadDialogProps } from './dialogs/TaxReturnUploadDialog';

// For backwards compatibility
export interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
}
