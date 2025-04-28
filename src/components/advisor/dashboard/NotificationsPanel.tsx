
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAllRead: () => void;
}

export const NotificationsPanel = ({ 
  notifications, 
  open, 
  onOpenChange, 
  onMarkAllRead 
}: NotificationsPanelProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>All Notifications</DialogTitle>
          <DialogDescription>
            Stay updated with your client activities and important events.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-[400px] overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex justify-between">
                <p className="text-gray-800 font-medium">{notification.message}</p>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onMarkAllRead}>
            Mark All as Read
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
