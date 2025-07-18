
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BellIcon, DollarSignIcon, UsersIcon, LogOutIcon, BarChart4Icon, XIcon, UserPlus } from "lucide-react";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { InviteProspectModal } from "@/components/advisor/InviteProspectModal";
import { ProspectsList } from "@/components/advisor/ProspectsList";
import { ReferralCard } from "@/components/referrals/ReferralCard";

export default function AdvisorDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const { userProfile } = useUser();
  const navigate = useNavigate();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [inviteProspectOpen, setInviteProspectOpen] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  
  // Mock data for demonstration
  const notifications = [
    { id: 1, message: "New client document uploaded by Tom Brady", time: "10 minutes ago" },
    { id: 2, message: "Client meeting scheduled with Sarah Johnson", time: "1 hour ago" },
    { id: 3, message: "Document approval requested by Michael Chen", time: "Yesterday" },
    { id: 4, message: "Monthly report review pending for Wilson family", time: "2 days ago" }
  ];
  
  const clientMetrics = {
    totalAUM: "$347,950,000",
    monthlyFees: "$289,958",
    activeClients: 42,
    pendingReviews: 7
  };
  
  const topClients = [
    { id: 1, name: "Brady Family", aum: "$28.5M", lastActivity: "2 days ago" },
    { id: 2, name: "Johnson Trust", aum: "$19.7M", lastActivity: "5 days ago" },
    { id: 3, name: "Wilson Holdings", aum: "$15.2M", lastActivity: "Today" },
    { id: 4, name: "Chen Investments", aum: "$12.8M", lastActivity: "Yesterday" }
  ];

  const allClients = [
    ...topClients,
    { id: 5, name: "Smith Family", aum: "$9.3M", lastActivity: "3 days ago" },
    { id: 6, name: "Anderson LLC", aum: "$7.8M", lastActivity: "1 week ago" },
    { id: 7, name: "Rodriguez Ventures", aum: "$6.2M", lastActivity: "2 days ago" },
    { id: 8, name: "Parker Trust", aum: "$5.9M", lastActivity: "Yesterday" }
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate("/advisor/login");
    }
  };

  const handleNotificationClick = () => {
    setNotificationsOpen(true);
    setShowNotificationBadge(false);
  };

  const markAllAsRead = () => {
    toast.success("All notifications marked as read");
    setNotificationsOpen(false);
  };
  
  const viewClientDetail = (clientId: number) => {
    // In a real app, you would navigate to a client detail page
    toast.info(`Viewing details for client #${clientId}`);
    setClientsOpen(false);
  };

  // Check if user has advisor or admin role
  const canInviteProspects = userProfile?.role === 'advisor' || userProfile?.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7E8]">
      <header className="w-full flex justify-center items-center py-4 border-b border-[#DCD8C0] bg-[#F9F7E8] sticky top-0 z-50">
        <div className="container flex justify-between items-center max-w-7xl px-4">
          <div className="flex items-center">
            <Link to="/advisor/dashboard">
              <img 
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                alt="Boutique Family Office Logo" 
                className="h-16 w-auto"
              />
            </Link>
          </div>
          <div className="hidden md:flex gap-8 text-[#222222]">
            <Link to="/advisor/dashboard" className="font-medium">Dashboard</Link>
            <Link to="/advisor/clients" className="hover:text-primary font-medium">Clients</Link>
            <Link to="/advisor/documents" className="hover:text-primary font-medium">Documents</Link>
            <Link to="/advisor/calendar" className="hover:text-primary font-medium">Calendar</Link>
          </div>
          <div className="flex gap-4 items-center">
            {canInviteProspects && (
              <Button 
                onClick={() => setInviteProspectOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Invite Prospect
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={handleNotificationClick}
            >
              <BellIcon className="h-5 w-5" />
              {showNotificationBadge && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOutIcon className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[#222222]">Advisor Portal</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#222222]">Total AUM</h2>
                <DollarSignIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-[#222222]">{clientMetrics.totalAUM}</p>
              <p className="text-sm text-gray-500 mt-2">Across {clientMetrics.activeClients} client accounts</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#222222]">Monthly Fees</h2>
                <BarChart4Icon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-[#222222]">{clientMetrics.monthlyFees}</p>
              <p className="text-sm text-gray-500 mt-2">Average of $6,903 per client</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#222222]">Active Clients</h2>
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-[#222222]">{clientMetrics.activeClients}</p>
              <p className="text-sm text-gray-500 mt-2">{clientMetrics.pendingReviews} reviews pending</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-xl font-semibold mb-4 text-[#222222]">Recent Notifications</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="mt-4 w-full"
                onClick={() => setNotificationsOpen(true)}
              >
                View All Notifications
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-xl font-semibold mb-4 text-[#222222]">Top Clients by AUM</h2>
              <div className="space-y-0">
                <div className="grid grid-cols-3 py-2 border-b border-gray-200 font-medium text-gray-600">
                  <div>Client</div>
                  <div>AUM</div>
                  <div>Last Activity</div>
                </div>
                {topClients.map((client) => (
                  <div 
                    key={client.id} 
                    className="grid grid-cols-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => viewClientDetail(client.id)}
                  >
                    <div className="text-[#222222]">{client.name}</div>
                    <div className="text-green-600 font-medium">{client.aum}</div>
                    <div className="text-gray-500 text-sm">{client.lastActivity}</div>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="mt-4 w-full"
                onClick={() => setClientsOpen(true)}
              >
                View All Clients
              </Button>
            </div>

            {/* Referral Program Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#DCD8C0]">
              <ReferralCard userRole={userProfile?.role || 'advisor'} />
            </div>
          </div>

          {/* Prospects Management Section */}
          {canInviteProspects && (
            <div className="mt-8">
              <ProspectsList onInviteClick={() => setInviteProspectOpen(true)} />
            </div>
          )}
        </div>
      </main>

      {/* All Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
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
            <Button variant="outline" onClick={() => setNotificationsOpen(false)}>
              Close
            </Button>
            <Button onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Clients Dialog */}
      <Dialog open={clientsOpen} onOpenChange={setClientsOpen}>
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
            {allClients.map((client) => (
              <div 
                key={client.id} 
                className="grid grid-cols-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                onClick={() => viewClientDetail(client.id)}
              >
                <div className="text-[#222222] font-medium">{client.name}</div>
                <div className="text-green-600">{client.aum}</div>
                <div className="text-gray-500 text-sm">{client.lastActivity}</div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success("New client feature coming soon!");
              setClientsOpen(false);
            }}>
              Add New Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Prospect Modal */}
      <InviteProspectModal 
        open={inviteProspectOpen} 
        onOpenChange={setInviteProspectOpen} 
      />

      <footer className="py-6 px-4 bg-[#1B1B32] text-white text-center">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
