
interface BeneficiariesFormHeaderProps {
  onSave: () => void;
}

export function BeneficiariesFormHeader({ onSave }: BeneficiariesFormHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Provide your beneficiary information</h2>
      <p className="text-sm text-muted-foreground mt-1">
        You can add or remove beneficiaries from your profile. Ask your advisor to assign a
        beneficiary to a specific account.
      </p>
    </div>
  );
}
