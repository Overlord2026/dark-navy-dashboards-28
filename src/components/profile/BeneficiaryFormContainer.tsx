
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { BeneficiaryList } from "./BeneficiaryList";
import { BeneficiaryFormHeader } from "./BeneficiaryFormHeader";
import { BeneficiaryFormFields } from "./BeneficiaryFormFields";
import { 
  beneficiarySchema, 
  Beneficiary, 
  defaultBeneficiaryValues 
} from "./beneficiarySchema";

interface BeneficiaryFormContainerProps {
  onSave: () => void;
}

export function BeneficiaryFormContainer({ onSave }: BeneficiaryFormContainerProps) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Beneficiary | null>(null);

  const form = useForm<Beneficiary>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: defaultBeneficiaryValues,
  });

  function handleRemoveBeneficiary(beneficiary: Beneficiary) {
    setBeneficiaries(prev => prev.filter(b => b !== beneficiary));
    if (currentBeneficiary === beneficiary) {
      setCurrentBeneficiary(null);
      form.reset(defaultBeneficiaryValues);
    }
  }

  function handleEditBeneficiary(beneficiary: Beneficiary) {
    setCurrentBeneficiary(beneficiary);
    form.reset(beneficiary);
  }

  function handleCancelEdit() {
    setCurrentBeneficiary(null);
    form.reset(defaultBeneficiaryValues);
  }

  return (
    <>
      <BeneficiaryList 
        beneficiaries={beneficiaries}
        onEdit={handleEditBeneficiary}
        onRemove={handleRemoveBeneficiary}
      />
      
      <BeneficiaryFormHeader 
        isEditing={currentBeneficiary !== null}
        onCancelEdit={handleCancelEdit}
      />
      
      <div className="space-y-8">
        <Form {...form}>
          <BeneficiaryFormFields form={form} />
        </Form>
      </div>
    </>
  );
}
