
import React, { useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Bill, BillCategory, BillStatus } from "@/types/bill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, AlertCircleIcon, ClockIcon, CreditCardIcon, InfoIcon, SearchIcon, FilterIcon } from "lucide-react";
import { format } from "date-fns";
import { BillDetailsDialog } from "./BillDetailsDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BillsListProps {
  bills: Bill[];
  showCategory?: boolean;
}

export function BillsList({ bills, showCategory = false }: BillsListProps) {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case "Overdue":
        return <AlertCircleIcon className="h-4 w-4 text-red-500" />;
      case "Upcoming":
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <InfoIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleOpenDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetailsOpen(true);
  };

  // Get unique categories from bills
  const uniqueCategories = useMemo(() => {
    const categories = bills.map(bill => bill.category);
    return ["all", ...Array.from(new Set(categories))];
  }, [bills]);

  // Filter bills based on search query and filters
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesSearch = 
        searchQuery === "" || 
        bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        bill.status === statusFilter;
      
      const matchesCategory = 
        categoryFilter === "all" || 
        bill.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bills, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bills by name, provider, or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <span className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                <span>Status</span>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {showCategory && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <span className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <span>Category</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No bills match your search criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <Card 
              key={bill.id}
              className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{bill.name}</h3>
                    {showCategory && (
                      <span className="text-sm text-gray-500">{bill.category}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  
                  <Badge 
                    variant="outline"
                    className={`flex items-center gap-1 ${getStatusColor(bill.status)}`}
                  >
                    {getStatusIcon(bill.status)} {bill.status}
                  </Badge>
                </div>
                
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDetails(bill)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedBill && (
        <BillDetailsDialog
          bill={selectedBill}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}
