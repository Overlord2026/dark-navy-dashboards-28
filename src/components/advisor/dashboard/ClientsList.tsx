
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  aum: string;
  lastActivity: string;
}

interface ClientsListProps {
  clients: Client[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewDetail: (clientId: number) => void;
}

export const ClientsList = ({ 
  clients, 
  open, 
  onOpenChange, 
  onViewDetail 
}: ClientsListProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>All Clients</DialogTitle>
          <DialogDescription>
            View and manage all your client relationships.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-3 py-2 border-b border-gray-200 font-medium text-gray-600 sticky top-0 bg-white">
            <div>Client</div>
            <div>AUM</div>
            <div>Last Activity</div>
          </div>
          {clients.map((client) => (
            <div 
              key={client.id} 
              className="grid grid-cols-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              onClick={() => onViewDetail(client.id)}
            >
              <div className="text-[#222222] font-medium">{client.name}</div>
              <div className="text-green-600">{client.aum}</div>
              <div className="text-gray-500 text-sm">{client.lastActivity}</div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => {
            toast.success("New client feature coming soon!");
            onOpenChange(false);
          }}>
            Add New Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
