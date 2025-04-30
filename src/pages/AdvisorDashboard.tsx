
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BellIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MetricsCard } from "@/components/advisor/dashboard/MetricsCard";
import { NotificationsPanel } from "@/components/advisor/dashboard/NotificationsPanel";
import { ClientsList } from "@/components/advisor/dashboard/ClientsList";

export default function AdvisorDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
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
  
  const allClients = [
    { id: 1, name: "Brady Family", aum: "$28.5M", lastActivity: "2 days ago" },
    { id: 2, name: "Johnson Trust", aum: "$19.7M", lastActivity: "5 days ago" },
    { id: 3, name: "Wilson Holdings", aum: "$15.2M", lastActivity: "Today" },
    { id: 4, name: "Chen Investments", aum: "$12.8M", lastActivity: "Yesterday" },
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
    toast.info(`Viewing details for client #${clientId}`);
    setClientsOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7E8] pt-[80px]">
      <div className="flex justify-end px-4 py-2 border-b border-[#DCD8C0]">
        <div className="flex gap-4 items-center">
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

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* New welcome section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold mb-4 text-[#1B1B32]">Welcome to Boutique Family Office</h1>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Founded in 2025 by financial industry veteran Antonio Gomes, alongside fintech and data entrepreneurs, 
                Boutique Family Office (BFO) is dedicated to empowering financial advisors and their clients 
                to excel in the era of artificial intelligence.
              </p>
              
              <p className="mb-4">
                At BFO, we believe financial advisors will not only remain vital but will thrive as technological 
                advancements accelerate. Rather than replacing advisors, we envision AI as an essential partner, 
                enabling advisors to focus on their most impactful work: building deep, trusting relationships with 
                their clients and guiding them through life's most significant financial decisions.
              </p>
              
              <p className="mb-6">
                Our vision is clear: to develop innovative technology solutions that empower both advisors and 
                the families they serve, enhancing every aspect of financial advisory services.
              </p>
              
              <h2 className="text-xl font-semibold mb-3 mt-6">Explore the comprehensive suite of services we enable advisors to offer their clients:</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">Education & Solutions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Education Center</li>
                    <li>Courses</li>
                    <li>Guides & Whitepapers</li>
                    <li>Books</li>
                    <li>Planning Examples</li>
                    <li>Presentations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">Wealth Management</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Secure Family Vault</li>
                    <li>Accounts</li>
                    <li>Financial Plans</li>
                    <li>Investments</li>
                    <li>Tax & Budgets</li>
                    <li>Properties</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">Planning & Services</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Financial Planning</li>
                    <li>Investments</li>
                    <li>Tax Planning</li>
                    <li>Estate Planning</li>
                    <li>Insurance</li>
                    <li>Lending</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-3 mt-6">Our Advisor Platform provides powerful tools designed specifically for financial advisors:</h2>
              
              <h3 className="text-lg font-semibold mb-2 mt-4">Key Features:</h3>
              
              <ul className="list-none space-y-2">
                <li className="flex gap-2">
                  <span className="font-semibold">Prospect Management:</span> 
                  <span>Streamline prospect verification and management using advanced verification tools.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">Meeting Intelligence:</span> 
                  <span>AI-powered recording, transcription, and analysis to capture actionable insights from client interactions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">Questionnaires:</span> 
                  <span>Automate client questionnaires and analyze responses efficiently, aligning insights directly with client meetings.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">Email Templates:</span> 
                  <span>Create personalized email communication effortlessly with customizable templates.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">ROI Tracker:</span> 
                  <span>Analyze the effectiveness of your marketing campaigns and track client conversions seamlessly.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">Integrations:</span> 
                  <span>Connect effortlessly with popular CRM systems, email providers, and verification services.</span>
                </li>
              </ul>
              
              <div className="mt-8 bg-[#1B1B32] text-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Ready to streamline your advisory practice?</h3>
                <p>Experience the future of advisory services today with Boutique Family Office.</p>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-[#222222]">Advisor Portal</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricsCard 
              type="aum"
              value={clientMetrics.totalAUM}
              subtitle={`Across ${clientMetrics.activeClients} client accounts`}
              trend={{ value: "$124,500 (5.3%)", isPositive: true }}
            />
            
            <MetricsCard 
              type="fees"
              value={clientMetrics.monthlyFees}
              subtitle="Average of $6,903 per client"
              trend={{ value: "$12,300 (1.5%)", isPositive: true }}
            />
            
            <MetricsCard 
              type="clients"
              value={String(clientMetrics.activeClients)}
              subtitle={`${clientMetrics.pendingReviews} reviews pending`}
              trend={{ value: "2 new this month", isPositive: true }}
            />
          </div>
        </div>
      </main>

      <NotificationsPanel 
        notifications={notifications}
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        onMarkAllRead={markAllAsRead}
      />

      <ClientsList 
        clients={allClients}
        open={clientsOpen}
        onOpenChange={setClientsOpen}
        onViewDetail={viewClientDetail}
      />

      <footer className="py-6 px-4 bg-[#1B1B32] text-white text-center">
        <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
      </footer>
    </div>
  );
}
