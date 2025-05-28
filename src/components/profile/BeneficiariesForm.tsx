
import { BeneficiariesFormHeader } from "./BeneficiariesFormHeader";
import { BeneficiaryFormContainer } from "./BeneficiaryFormContainer";

export function BeneficiariesForm({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-6">
      <BeneficiariesFormHeader onSave={onSave} />
      <BeneficiaryFormContainer onSave={onSave} />
    </div>
  );
}
