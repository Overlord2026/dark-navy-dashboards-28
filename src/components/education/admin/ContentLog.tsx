import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Calendar, User, FileText, PlayCircle, BookOpen, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface ContentLogEntry {
  id: string;
  content_id: string;
  action_type: string;
  old_data?: any;
  new_data?: any;
  performed_at: string;
  performed_by: string;
  notes?: string;
  education_content?: {
    title: string;
    content_type: string;
    category: string;
  };
}

export function ContentLog() {
  const [logs, setLogs] = useState<ContentLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('content_upload_log')
        .select(`
          *,
          education_content!inner(title, content_type, category)
        `)
        .order('performed_at', { ascending: false })
        .limit(100);

      if (filterAction !== 'all') {
        query = query.eq('action_type', filterAction);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Filter by content type
      if (filterType !== 'all') {
        filteredData = filteredData.filter(log => 
          log.education_content?.content_type === filterType
        );
      }

      // Filter by search term
      if (searchTerm) {
        filteredData = filteredData.filter(log =>
          log.education_content?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setLogs(filteredData);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch content logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterAction, filterType]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'created':
        return <Badge className="bg-green-500 text-white">Created</Badge>;
      case 'updated':
        return <Badge className="bg-blue-500 text-white">Updated</Badge>;
      case 'deleted':
        return <Badge className="bg-red-500 text-white">Deleted</Badge>;
      case 'published':
        return <Badge className="bg-purple-500 text-white">Published</Badge>;
      case 'unpublished':
        return <Badge className="bg-gray-500 text-white">Unpublished</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'course':
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'book':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="guide">Guides</SelectItem>
            <SelectItem value="course">Courses</SelectItem>
            <SelectItem value="book">Books</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={fetchLogs} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Log Entries */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No content logs found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2 mt-1">
                      {getContentTypeIcon(log.education_content?.content_type || '')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">
                          {log.education_content?.title || 'Unknown Content'}
                        </h4>
                        {getActionBadge(log.action_type)}
                        <Badge variant="outline" className="text-xs">
                          {log.education_content?.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.performed_by || 'Unknown User'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(log.performed_at), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                      
                      {log.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Could open a modal with detailed change information
                      toast.info('Detailed view coming soon');
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Show change summary for updates */}
                {log.action_type === 'updated' && log.old_data && log.new_data && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Changes:</p>
                    <div className="text-sm">
                      {Object.keys(log.new_data).map((key) => {
                        if (log.old_data[key] !== log.new_data[key]) {
                          return (
                            <div key={key} className="flex items-center gap-2 text-xs">
                              <span className="font-medium">{key}:</span>
                              <span className="text-red-600 line-through">
                                {JSON.stringify(log.old_data[key])}
                              </span>
                              <span>→</span>
                              <span className="text-green-600">
                                {JSON.stringify(log.new_data[key])}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}