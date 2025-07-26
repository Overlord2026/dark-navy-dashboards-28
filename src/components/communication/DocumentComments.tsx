import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  MessageCircle, 
  Send, 
  Reply,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCommentsProps {
  onUnreadCountChange: (count: number) => void;
}

interface Comment {
  id: string;
  documentId: string;
  documentName: string;
  author: {
    name: string;
    type: 'client' | 'professional';
    professionalType?: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
  parentId?: string;
  replies?: Comment[];
}

export function DocumentComments({ onUnreadCountChange }: DocumentCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      documentId: 'doc1',
      documentName: 'Tax Return 2024 - Draft',
      author: {
        name: 'John Smith',
        type: 'professional',
        professionalType: 'CPA',
        avatar: ''
      },
      content: 'I notice the home office deduction seems low. Can you provide more details about your home office usage?',
      timestamp: '2024-01-26T10:30:00Z',
      read: false
    },
    {
      id: '2',
      documentId: 'doc1',
      documentName: 'Tax Return 2024 - Draft',
      author: {
        name: 'You',
        type: 'client'
      },
      content: 'I use my home office about 40 hours per week. The room is 200 sq ft and exclusively used for work.',
      timestamp: '2024-01-26T11:45:00Z',
      read: true,
      parentId: '1'
    },
    {
      id: '3',
      documentId: 'doc2',
      documentName: 'Estate Planning - Will Amendment',
      author: {
        name: 'Sarah Johnson',
        type: 'professional',
        professionalType: 'Attorney',
        avatar: ''
      },
      content: 'Please review the beneficiary designations on page 3. There appears to be a discrepancy with your insurance policies.',
      timestamp: '2024-01-25T15:20:00Z',
      read: false
    },
    {
      id: '4',
      documentId: 'doc3',
      documentName: 'Investment Portfolio Analysis',
      author: {
        name: 'Michael Chen',
        type: 'professional',
        professionalType: 'Financial Advisor',
        avatar: ''
      },
      content: 'Great performance this quarter! I recommend rebalancing the tech allocation to lock in gains.',
      timestamp: '2024-01-24T09:15:00Z',
      read: false
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = comments.filter(c => !c.read).length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const documents = Array.from(new Set(comments.map(c => c.documentId)))
    .map(docId => {
      const comment = comments.find(c => c.documentId === docId)!;
      const docComments = comments.filter(c => c.documentId === docId);
      const unreadDocComments = docComments.filter(c => !c.read).length;
      
      return {
        id: docId,
        name: comment.documentName,
        commentCount: docComments.length,
        unreadCount: unreadDocComments,
        lastActivity: Math.max(...docComments.map(c => new Date(c.timestamp).getTime()))
      };
    })
    .sort((a, b) => b.lastActivity - a.lastActivity);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDocument = !selectedDocument || comment.documentId === selectedDocument;
    return matchesSearch && matchesDocument;
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      documentId: selectedDocument || comments[0]?.documentId || 'doc1',
      documentName: comments.find(c => c.documentId === (selectedDocument || comments[0]?.documentId))?.documentName || 'Document',
      author: {
        name: 'You',
        type: 'client'
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      read: true,
      parentId: replyTo || undefined
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
    setReplyTo(null);
  };

  const markAsRead = (commentId: string) => {
    setComments(prev => 
      prev.map(c => c.id === commentId ? { ...c, read: true } : c)
    );
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-medium">Document Comments</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Documents List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 p-4">
              <div
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  !selectedDocument ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedDocument(null)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">All Documents</span>
                  <Badge variant="secondary" className="text-xs">
                    {comments.length}
                  </Badge>
                </div>
              </div>
              
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedDocument === doc.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm truncate">{doc.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.commentCount} comments</span>
                      {doc.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {doc.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {selectedDocument 
                ? documents.find(d => d.id === selectedDocument)?.name 
                : 'All Comments'
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4">
              {filteredComments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No comments found</h3>
                  <p className="text-muted-foreground">No comments match your current filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 border rounded-lg ${
                        !comment.read ? 'bg-accent/20' : ''
                      }`}
                      onClick={() => !comment.read && markAsRead(comment.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {getAuthorInitials(comment.author.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment.author.name}
                              </span>
                              {comment.author.professionalType && (
                                <Badge variant="secondary" className="text-xs">
                                  {comment.author.professionalType}
                                </Badge>
                              )}
                              {!comment.read && (
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                              </span>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm">{comment.content}</p>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyTo(comment.id)}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                            {!selectedDocument && (
                              <Badge variant="outline" className="text-xs">
                                {comment.documentName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Comment Input */}
            <div className="p-4 border-t space-y-3">
              {replyTo && (
                <div className="p-2 bg-muted rounded text-sm">
                  <span className="text-muted-foreground">Replying to:</span>
                  <span className="ml-2 font-medium">
                    {comments.find(c => c.id === replyTo)?.author.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                    className="ml-2 h-auto p-0 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              <div className="flex gap-2">
                <Textarea
                  placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}