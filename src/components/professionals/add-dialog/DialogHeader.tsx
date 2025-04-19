
import { DialogHeader as BaseHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function DialogHeader() {
  return (
    <BaseHeader>
      <DialogTitle>Add Professional</DialogTitle>
      <DialogDescription>
        Add a new professional to your directory.
      </DialogDescription>
    </BaseHeader>
  );
}
