
import React from "react";
import { TrustsList } from "./trusts/TrustsList";
import { TrustForm } from "./trusts/TrustForm";
import { TrustViewDialog } from "./TrustViewDialog";
import { useTrustManagement } from "./trusts/useTrustManagement";

export function TrustsFormNew({ onSave }: { onSave: () => void }) {
  const {
    trusts,
    form,
    isLoading,
    editingTrust,
    viewingTrust,
    isViewDialogOpen,
    selectedFile,
    handleSubmit,
    handleView,
    handleEdit,
    cancelEdit,
    removeTrust,
    handleFileChange,
    setIsViewDialogOpen,
  } = useTrustManagement(onSave);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Trusts</h2>
        <p className="text-sm text-muted-foreground">Add and manage your trust information.</p>
      </div>
      
      <TrustsList
        trusts={trusts}
        onView={handleView}
        onEdit={handleEdit}
        onRemove={removeTrust}
      />
      
      <TrustForm
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        editingTrust={editingTrust}
        onCancelEdit={cancelEdit}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
      />
      
      <TrustViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        trust={viewingTrust}
      />
    </div>
  );
}
