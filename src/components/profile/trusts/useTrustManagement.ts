import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Trust, TrustFormData, trustSchema } from "./types";

export function useTrustManagement(onSave: () => void) {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTrust, setEditingTrust] = useState<Trust | null>(null);
  const [viewingTrust, setViewingTrust] = useState<Trust | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const form = useForm<TrustFormData>({
    resolver: zodResolver(trustSchema),
    defaultValues: {
      trustName: "",
      country: "United States",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      emailAddress: "",
      documentType: "Trust Formation Document",
    },
  });

  const loadTrusts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_trusts')
      .select(`
        *,
        user_trust_documents (
          id,
          file_name,
          file_path,
          file_size,
          content_type
        )
      `)
      .eq('user_id', user.id);
      
    if (data && !error) {
      setTrusts(data.map(t => ({
        id: t.id,
        trustName: t.trust_name || "",
        country: t.country || "United States",
        address: t.address || "",
        city: t.city || "",
        state: t.state || "",
        zipCode: t.zip_code || "",
        phoneNumber: t.phone_number || "",
        emailAddress: t.email_address || "",
        documentType: t.document_type || "Trust Formation Document",
        documents: t.user_trust_documents || []
      })));
    }
  };

  useEffect(() => {
    loadTrusts();
  }, [user]);

  const uploadDocument = async (file: File, trustId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `trust-documents/${user?.id}/${trustId}/${fileName}`;

      const { error: docError } = await supabase
        .from('user_trust_documents')
        .insert({
          trust_id: trustId,
          user_id: user?.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          content_type: file.type
        });

      if (docError) {
        console.error('Error saving document:', docError);
        toast.error("Failed to save document");
      } else {
        toast.success(`Document ${file.name} saved successfully`);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error("Failed to upload document");
    }
  };

  const handleSubmit = async (values: TrustFormData) => {
    if (!user) {
      toast.error("You must be logged in to save trusts");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const trustData = {
        user_id: user.id,
        trust_name: values.trustName,
        country: values.country,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        phone_number: values.phoneNumber,
        email_address: values.emailAddress,
        document_type: values.documentType,
      };

      if (editingTrust) {
        const { error } = await supabase
          .from('user_trusts')
          .update(trustData)
          .eq('id', editingTrust.id);
          
        if (error) {
          toast.error("Failed to update trust");
          console.error(error);
        } else {
          if (selectedFile && editingTrust.id) {
            await uploadDocument(selectedFile, editingTrust.id);
          }
          
          toast.success("Trust updated successfully");
          setEditingTrust(null);
          await loadTrusts();
        }
      } else {
        const { data: newTrust, error } = await supabase
          .from('user_trusts')
          .insert(trustData)
          .select()
          .single();
          
        if (error) {
          toast.error("Failed to add trust");
          console.error(error);
        } else {
          if (selectedFile && newTrust) {
            await uploadDocument(selectedFile, newTrust.id);
          }
          
          toast.success("Trust added successfully");
          await loadTrusts();
        }
      }
      
      form.reset({
        trustName: "",
        country: "United States",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        emailAddress: "",
        documentType: "Trust Formation Document",
      });
      setSelectedFile(null);
      onSave();
    } catch (error) {
      console.error('Unexpected error saving trust:', error);
      toast.error("An unexpected error occurred while saving trust");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('user_trust_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document:', error);
        toast.error("Failed to delete document");
      } else {
        toast.success("Document deleted successfully");
        await loadTrusts();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("Failed to delete document");
    }
  };

  const handleView = (trust: Trust) => {
    setViewingTrust(trust);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (trust: Trust) => {
    setEditingTrust(trust);
    form.reset(trust);
  };

  const cancelEdit = () => {
    setEditingTrust(null);
    form.reset({
      trustName: "",
      country: "United States",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      emailAddress: "",
      documentType: "Trust Formation Document",
    });
  };

  const removeTrust = async (id: string) => {
    const { error } = await supabase
      .from('user_trusts')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error("Failed to remove trust");
    } else {
      setTrusts(prev => prev.filter(t => t.id !== id));
      toast.success("Trust removed successfully");
    }
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    toast.success(`File ${file.name} selected for upload`);
  };

  return {
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
    deleteDocument,
  };
}
