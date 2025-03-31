
import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewFolderDialogProps {
  onCreateFolder: (folderName: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewFolderDialog = ({ onCreateFolder, open, onOpenChange }: NewFolderDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    onCreateFolder(folderName);
    setFolderName("");
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {!open && (
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter folder name"
              className="col-span-3"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
