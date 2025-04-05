
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Clock, CreditCard, Wallet, ArrowRight, BellRing, FileText } from "lucide-react";

const ClientPortal = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Client Portal</h1>
        <p className="text-muted-foreground">Manage your accounts, documents, and communications in one place</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Upcoming Payments" 
          icon={<Clock className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Property Tax</span>
              <span className="font-bold">$2,450.00</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Due in 5 days</span>
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <Link to="/finance/bill-pay">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard 
          title="Account Summary" 
          icon={<Wallet className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Assets</span>
              <span className="font-bold">$1,245,300.00</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Across 8 accounts</span>
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <Link to="/accounts">View Details <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard 
          title="Recent Documents" 
          icon={<FileText className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tax Return 2024</span>
              <span className="text-sm text-muted-foreground">Apr 1, 2025</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>2 new documents</span>
              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                <Link to="/documents">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center justify-center">
            <Link to="/finance/bill-pay">
              <CreditCard className="h-8 w-8 mb-2" />
              <span>Pay Bills</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center justify-center">
            <Link to="/finance/banking-transfers">
              <ArrowRight className="h-8 w-8 mb-2" />
              <span>Transfer Funds</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center justify-center">
            <Link to="/documents">
              <FileText className="h-8 w-8 mb-2" />
              <span>View Documents</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center justify-center">
            <Link to="/notifications">
              <BellRing className="h-8 w-8 mb-2" />
              <span>Notifications</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
