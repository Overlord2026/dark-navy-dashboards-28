
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { secureAudit } from "@/services/security/SecureAuditService";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { AuditEventType } from "@/services/auditLog/auditLogService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditLogEntry {
  id: string;
  user_id: string;
  event_type: string;
  status: string;
  details: {
    userName?: string;
    userRole?: string;
    ipAddress?: string;
    resourceId?: string;
    resourceType?: string;
    details?: Record<string, any>;
    reason?: string;
    clientInfo?: {
      userAgent: string;
      platform: string;
      language: string;
      screenSize: {
        width: number;
        height: number;
      };
      timeZone: string;
      timestamp: string;
    };
    timestamp?: string;
    [key: string]: any;
  };
  created_at: string;
}

export function SupabaseAuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState<AuditEventType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failure" | "warning">("all");
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  
  const { userProfile } = useUser();
  const userId = userProfile?.id;
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  
  const fetchLogs = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const eventType = eventTypeFilter !== "all" ? eventTypeFilter as AuditEventType : undefined;
      const status = statusFilter !== "all" ? statusFilter as "success" | "failure" | "warning" : undefined;
      
      // Calculate offset based on current page
      const offset = (currentPage - 1) * itemsPerPage;
      
      const { logs, error } = await secureAudit.getAuditLogs({
        limit: itemsPerPage,
        offset,
        eventType,
        status,
        // If not admin and viewing "my logs" tab, filter by user ID
        userId: currentTab === "my-logs" ? userId : undefined
      });
      
      if (error) {
        toast.error("Failed to load audit logs");
        return;
      }
      
      setLogs(logs as AuditLogEntry[]);
      
      // Estimate total pages (this is approximate since we don't have a count query)
      // In a real app, you would implement a count query
      setTotalPages(Math.max(1, Math.ceil(logs.length / itemsPerPage) + (logs.length === itemsPerPage ? 2 : 0)));
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("An error occurred while fetching audit logs");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchLogs();
    }
  }, [userId, currentPage, eventTypeFilter, statusFilter, currentTab]);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLogs(logs);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = logs.filter(log => 
      log.user_id.toLowerCase().includes(term) ||
      log.event_type.toLowerCase().includes(term) ||
      (log.details?.userName || '').toLowerCase().includes(term) ||
      (log.details?.resourceId || '').toLowerCase().includes(term) ||
      (log.details?.resourceType || '').toLowerCase().includes(term) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(term)
    );
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);
  
  const exportLogs = () => {
    const logsJson = JSON.stringify(filteredLogs.length ? filteredLogs : logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Audit Logs</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="my-logs">My Logs</TabsTrigger>
          </TabsList>
        </Tabs>
      
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={eventTypeFilter} onValueChange={(value) => setEventTypeFilter(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="document_access">Document Access</SelectItem>
                <SelectItem value="permission_change">Permission Change</SelectItem>
                <SelectItem value="settings_change">Settings Change</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin mb-2 text-muted-foreground" />
                      <p>Loading audit logs...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 || logs.length > 0 ? (
                (filteredLogs.length > 0 ? filteredLogs : logs).map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.details?.userName || log.user_id}</div>
                      {log.details?.userRole && (
                        <div className="text-xs text-muted-foreground">Role: {log.details.userRole}</div>
                      )}
                      {log.details?.ipAddress && (
                        <div className="text-xs text-muted-foreground">IP: {log.details.ipAddress}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatEventType(log.event_type)}</div>
                      {log.details?.resourceId && (
                        <div className="text-xs text-muted-foreground">
                          Resource: {log.details.resourceId}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : log.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.details?.details && (
                        <div>
                          {log.details.details.action && (
                            <div className="font-medium">{log.details.details.action}</div>
                          )}
                          {log.details.details.result && (
                            <div className={`text-xs ${
                              log.details.details.result === 'success'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              Result: {log.details.details.result}
                            </div>
                          )}
                          {log.details.reason && (
                            <div className="text-xs text-red-600 mt-1">
                              Reason: {log.details.reason}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <p>No audit logs found.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm ? "Try adjusting your search term or filters." : "No logs match your current filters."}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {(logs.length > 0 || currentPage > 1) && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis if needed */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Previous page if not on first page */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>
              
              {/* Next page if not on last page */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis if needed */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Last page if not already shown */}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
