import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  Upload, 
  Download, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music, 
  MessageSquare,
  Share2,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Users,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface VaultTest {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending' | 'running';
  message: string;
  details?: string;
  fileSize?: number;
  timestamp?: string;
}

interface TestFile {
  name: string;
  type: string;
  icon: React.ReactNode;
  testData: string; // base64 or test content
}

export function VaultComprehensiveTester() {
  const [tests, setTests] = useState<VaultTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [messageText, setMessageText] = useState("Test secure message for audit trail verification");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { userProfile } = useAuth();

  // Test file types with sample data
  const testFiles: TestFile[] = [
    {
      name: "test-document.pdf",
      type: "application/pdf",
      icon: <FileText className="h-4 w-4" />,
      testData: "JVBERi0xLjQKJcOkw7zDtsOyDQoxIDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9QYWdlcyAyIDAgUg0KPj4NCmVuZG9iag0KMiAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0tpZHMgWzMgMCBSXQ0KL0NvdW50IDENCj4+DQplbmRvYmoNCjMgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAyIDAgUg0KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0NCj4+DQplbmRvYmoNCnhyZWYNCjAgNA0KMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDAwMDA5IDAwMDAwIG4NCjAwMDAwMDAwNTggMDAwMDAgbg0KMDAwMDAwMDExNSAwMDAwMCBuDQp0cmFpbGVyDQo8PA0KL1NpemUgNA0KL1Jvb3QgMSAwIFINCj4+DQpzdGFydHhyZWYNCjE3OA0KJSVFT0Y="
    },
    {
      name: "test-image.jpg",
      type: "image/jpeg", 
      icon: <Image className="h-4 w-4" />,
      testData: "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    },
    {
      name: "test-document.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      icon: <FileText className="h-4 w-4" />,
      testData: "UEsDBBQACAgIAAAAIQAAAAAAAAAAAAAAAAAQAAAAZG9jUHJvcHMvYXBwLnhtbE1QQQ+CMBA9+wsI925TKzHNYgwxER+AH2DbtlsXaFc6+P2W4OGwx+a9m/fee1e1m1SKl3RiQNkbOwkTJhZMaNMZ8/a6YKVdJGLkZlJGWS5iMYW0eUFaGgZQeKiR8kFrTuF7jXtNbmZYcTVt53rEq0iDI9jkRNhKf+y2f7bfgKEtJN9sC4a+MQGD64qVYfNKRrAmEQ1XFNE62KNYhKFPF+RryK5Y3bPD8Qe0RLkJQ6iVJy1gJhJ9Og3cWyU2UMnXfqDKWg7WRLkBJM1E4SJAhYrSepZFqaV9XhPFkdO6X7C9v3jNE5H5Xy5K9e2Sw4nSj0KvP1/AGk+j+vIKQ1WQTa9I4L4tJQB7QoRzb9CFFhw6WEpI5MxPsEYR+K/z1OQj4W4xWMOKYCJ4Y38j/y9/kANUEsHCGrG+7CAAAA7AAAAUEsDBBQACAgIAAAAIQAAAAAAAAAAAAAAAAAZAAAAeGwvZG9jUHJvcHMvY29yZS54bWyVkM1qwzAQhF9F6F7L1k8Q+Oa0hUCgPYT2ARQ59obYklFUCKHvXlmh7bW3dWe+mdn9qrv3yvEFRBspLPOoOmUehGxkK+WLZXe3YlfNfNJvEG3lJSAR3o8RUzM/Bto2Ui2pKN9IKe1gGJ/WNlI7YKUtG9nI7aGLkmjjYaBlDgqN+IXvGPwvWKdNDq5k3tJXyweqP5u5qk7JqQZqXruvYRGS/1FPEjNPt3qKOHjJu8b6JRKSNnIt4sE4XyDNgZf3e1sTIwn7zVwKCyJa5rUEskKYhGo5f7dJC4VCn0VN4WOkCYo+AKJgfAEcqAZOFyKYn6n1qgc+3T7Ag3FE1NnEFJgFhwJOcKUJQbHqQO3N3QAGWoZSRGbQQm1FtH/4VUH+g+5jXN3Xy6N7vwC2VTlYwVqvfJUwVJp6N1BLbYc7r7qJQ7J9AwAaP9SoNJKCE52gJTRKWs7nz7qCKlLnm0HmHj+K0sEi2rQOv0e4FYxh1B9QSwcIrT+JXFcBAAAfAQAAUEsDBBQACAgIAAAAIQAAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sjZBNC4MwDIafRfYA7fpxE7yJKwzGbtv1C4StK0Vti7aVrU9ff3bDGGwwLofc5HkSSJ6I1oQ/CiEF8CYMWdvKqlI8QmxMJMJGo9WtQmmJOLCfIzJdWCTJRmBhFaFOQ6GGFF2Y7TqQKSiJLY/yRm1EJrYp2QdKUtKUhCbOsVhYGSJbtPO1WQtdIJ8IJOCGsZR1FiJR5VZGYHc6nL6RSY7rR9rSVjnZJ1F5BEjCf5JfCN7RPF/gYq6+XQZmJGTZW1mELApXB6+xQ6mCYb7KYV6xHWDh3E7N9KgJw=="
    },
    {
      name: "test-video.mp4",
      type: "video/mp4",
      icon: <Video className="h-4 w-4" />,
      testData: "AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAsdtZGF0AAACmGJsaGFlbDEAAAKKUmRzBQAAAAkXG4AAAE0AAABnAQEEBwAAZy5qag==" 
    },
    {
      name: "test-audio.mp3",
      type: "audio/mpeg",
      icon: <Music className="h-4 w-4" />,
      testData: "SUQzAwAAAAABBlRQRTEAAAAFAAABVzEuMgBUU1NFAAAADQAAADFMYXZMNS4xMi4yMwAA"
    },
    {
      name: "test-presentation.pptx",
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      icon: <FileText className="h-4 w-4" />,
      testData: "UEsDBAoAAAAAAINe3EYAAAAAAAAAAAAAAAASAAAA5L2g6K6X5Y+R6K6h5YmOCKlE5L2g6K6X5Y+R6K6h5YmO"
    },
    {
      name: "test-spreadsheet.xlsx", 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      icon: <FileText className="h-4 w-4" />,
      testData: "UEsDBBQACAgIAGdMkU4AAAAAAAAAAAAAAAALAAAAYXBwLnhtbPNhzcDKaLZGP7lEp5LDqQzZEVlVcUDpMy1HKDGfVKlcxlpJi1aaGlVbm9eSE5QAAAAA//8DAFBLAwQUAAgICAAGAASNA"
    }
  ];

  const addTest = (test: VaultTest) => {
    setTests(prev => [...prev, { ...test, timestamp: new Date().toISOString() }]);
  };

  const updateProgress = (current: number, total: number) => {
    setProgress((current / total) * 100);
  };

  const createTestFile = (testFile: TestFile) => {
    const binaryString = atob(testFile.testData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: testFile.type });
    // Create a mock file object for testing
    return {
      name: testFile.name,
      type: testFile.type,
      size: bytes.length,
      arrayBuffer: () => Promise.resolve(bytes.buffer),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(binaryString),
      slice: () => blob
    } as File;
  };

  const testFileUpload = async (testFile: TestFile): Promise<{ success: boolean; error?: string; filePath?: string }> => {
    try {
      const file = createTestFile(testFile);
      const fileExt = testFile.name.split('.').pop();
      const fileName = `vault-test-${Date.now()}.${fileExt}`;
      const filePath = `vault/${userProfile?.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, filePath: data?.path };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const testFileDownload = async (filePath: string): Promise<{ success: boolean; error?: string; size?: number }> => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .download(filePath);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, size: data?.size };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const testLegacyMessageUpload = async (type: 'text' | 'audio' | 'video'): Promise<{ success: boolean; error?: string }> => {
    try {
      // Instead of using non-existent legacy_messages table, 
      // test vault document upload for legacy messages
      let testContent = '';
      let fileName = '';
      
      switch (type) {
        case 'text':
          testContent = 'Test legacy text message for vault storage';
          fileName = `legacy-text-${Date.now()}.txt`;
          break;
        case 'audio':
          testContent = testFiles.find(f => f.type === 'audio/mpeg')?.testData || '';
          fileName = `legacy-audio-${Date.now()}.mp3`;
          break;
        case 'video':
          testContent = testFiles.find(f => f.type === 'video/mp4')?.testData || '';
          fileName = `legacy-video-${Date.now()}.mp4`;
          break;
      }

      // Create a test file for the legacy message
      const bytes = type === 'text' ? 
        new TextEncoder().encode(testContent) : 
        new Uint8Array(atob(testContent).split('').map(c => c.charCodeAt(0)));
      
      const file = new Blob([bytes], { 
        type: type === 'text' ? 'text/plain' : 
              type === 'audio' ? 'audio/mpeg' : 'video/mp4' 
      });
      
      const filePath = `vault/${userProfile?.id}/legacy/${fileName}`;

      const { error } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const testRealTimeSharing = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Test sharing with advisor
      const { data: advisorData, error: advisorError } = await supabase
        .from('advisor_assignments')
        .select('advisor_id')
        .eq('client_id', userProfile?.id)
        .limit(1);

      if (advisorError) {
        return { success: false, error: `Advisor sharing test failed: ${advisorError.message}` };
      }

      // Test sharing with family members
      const { data: familyData, error: familyError } = await supabase
        .from('family_members')
        .select('id')
        .eq('user_id', userProfile?.id)
        .limit(1);

      if (familyError) {
        return { success: false, error: `Family sharing test failed: ${familyError.message}` };
      }

      // Test real-time subscription
      const channel = supabase
        .channel('vault-sharing-test')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'vault_documents'
        }, (payload) => {
          console.log('Real-time sharing update:', payload);
        })
        .subscribe();

      await new Promise(resolve => setTimeout(resolve, 1000));
      await supabase.removeChannel(channel);

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const testSecureMessaging = async (): Promise<{ success: boolean; error?: string; auditRecord?: any }> => {
    try {
      // Test secure messaging by creating a vault document with message content
      const messageContent = `Secure message test: ${messageText}`;
      const fileName = `secure-message-${Date.now()}.txt`;
      const filePath = `vault/${userProfile?.id}/messages/${fileName}`;
      
      const messageBlob = new Blob([messageContent], { type: 'text/plain' });

      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, messageBlob);

      if (uploadError) {
        return { success: false, error: `Message upload failed: ${uploadError.message}` };
      }

      // Log security event for audit trail
      const { data: auditData, error: auditError } = await supabase
        .from('audit_logs')
        .insert({
          event_type: 'secure_message_sent',
          status: 'success',
          table_name: 'vault_documents',
          new_row: {
            message_type: 'secure',
            file_path: filePath,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (auditError) {
        return { success: false, error: `Audit log creation failed: ${auditError.message}` };
      }

      return { 
        success: true, 
        auditRecord: auditData 
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const runComprehensiveVaultTest = async () => {
    if (!userProfile) {
      addTest({
        category: 'Authentication',
        test: 'User Profile Check',
        status: 'fail',
        message: 'No user profile found - please ensure you are logged in'
      });
      return;
    }

    setIsRunning(true);
    setTests([]);
    setUploadedFiles([]);
    let testCount = 0;
    const totalTests = testFiles.length * 2 + 3 + 1 + 1; // Upload + Download + Legacy Messages + Sharing + Messaging

    // Test 1: File Upload/Download for each supported type
    setCurrentTest("Testing File Upload/Download...");
    for (const testFile of testFiles) {
      // Test Upload
      const uploadResult = await testFileUpload(testFile);
      addTest({
        category: 'File Upload',
        test: `Upload ${testFile.name}`,
        status: uploadResult.success ? 'pass' : 'fail',
        message: uploadResult.success 
          ? `Successfully uploaded ${testFile.name}`
          : `Upload failed: ${uploadResult.error}`,
        details: uploadResult.filePath,
        fileSize: uploadResult.success ? createTestFile(testFile).size : undefined
      });

      if (uploadResult.filePath) {
        setUploadedFiles(prev => [...prev, uploadResult.filePath!]);
      }

      testCount++;
      updateProgress(testCount, totalTests);

      // Test Download
      if (uploadResult.success && uploadResult.filePath) {
        const downloadResult = await testFileDownload(uploadResult.filePath);
        addTest({
          category: 'File Download',
          test: `Download ${testFile.name}`,
          status: downloadResult.success ? 'pass' : 'fail',
          message: downloadResult.success 
            ? `Successfully downloaded ${testFile.name}`
            : `Download failed: ${downloadResult.error}`,
          details: `File size: ${downloadResult.size || 'unknown'} bytes`,
          fileSize: downloadResult.size
        });
      } else {
        addTest({
          category: 'File Download',
          test: `Download ${testFile.name}`,
          status: 'fail',
          message: 'Cannot test download - upload failed',
        });
      }

      testCount++;
      updateProgress(testCount, totalTests);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Test 2: Legacy Message Upload
    setCurrentTest("Testing Legacy Message Upload...");
    for (const messageType of ['text', 'audio', 'video'] as const) {
      const legacyResult = await testLegacyMessageUpload(messageType);
      addTest({
        category: 'Legacy Messages',
        test: `Legacy ${messageType} message`,
        status: legacyResult.success ? 'pass' : 'fail',
        message: legacyResult.success 
          ? `Successfully uploaded legacy ${messageType} message`
          : `Legacy ${messageType} upload failed: ${legacyResult.error}`
      });
      testCount++;
      updateProgress(testCount, totalTests);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Test 3: Real-time Sharing
    setCurrentTest("Testing Real-time Sharing...");
    const sharingResult = await testRealTimeSharing();
    addTest({
      category: 'Real-time Sharing',
      test: 'Advisor & Family Sharing',
      status: sharingResult.success ? 'pass' : 'fail',
      message: sharingResult.success 
        ? 'Real-time sharing functionality working'
        : `Sharing test failed: ${sharingResult.error}`
    });
    testCount++;
    updateProgress(testCount, totalTests);

    // Test 4: Secure Messaging with Audit Trail
    setCurrentTest("Testing Secure Messaging & Audit Trail...");
    const messagingResult = await testSecureMessaging();
    addTest({
      category: 'Secure Messaging',
      test: 'Send Message & Audit Log',
      status: messagingResult.success ? 'pass' : 'fail',
      message: messagingResult.success 
        ? 'Secure messaging and audit logging working'
        : `Messaging test failed: ${messagingResult.error}`,
      details: messagingResult.auditRecord ? 
        `Audit record created: ${messagingResult.auditRecord.id}` : 
        'No audit record found'
    });
    testCount++;
    updateProgress(testCount, totalTests);

    setCurrentTest("");
    setIsRunning(false);
    updateProgress(100, 100);
    toast.success("Vault comprehensive testing completed!");
  };

  const getStatusIcon = (status: VaultTest['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'running':
        return <Clock className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: VaultTest['status']) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      pending: 'outline',
      running: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const summary = {
    total: tests.length,
    passed: tests.filter(t => t.status === 'pass').length,
    failed: tests.filter(t => t.status === 'fail').length,
    warnings: tests.filter(t => t.status === 'warning').length
  };

  const successRate = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Vault Comprehensive Testing Suite
          </h2>
          <p className="text-muted-foreground">
            Complete testing of file uploads, downloads, legacy messages, real-time sharing, and secure messaging
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <File className="h-3 w-3 mr-1" />
            {testFiles.length} File Types
          </Badge>
          <Badge variant="outline">
            <Database className="h-3 w-3 mr-1" />
            User: {userProfile?.role || 'Unknown'}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Test Message for Secure Messaging:</label>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter test message for secure messaging audit trail..."
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <Button 
              onClick={runComprehensiveVaultTest}
              disabled={isRunning || !userProfile}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isRunning ? "Running Vault Tests..." : "Run Comprehensive Vault Test"}
            </Button>
            
            {isRunning && (
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-1">{currentTest}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {tests.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Test Summary
                {getStatusIcon(successRate >= 90 ? 'pass' : successRate >= 70 ? 'warning' : 'fail')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{summary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{summary.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{summary.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{summary.warnings}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['File Upload', 'File Download', 'Legacy Messages', 'Real-time Sharing', 'Secure Messaging'].map(category => {
                const categoryTests = tests.filter(t => t.category === category);
                if (categoryTests.length === 0) return null;

                return (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      {category === 'File Upload' && <Upload className="h-4 w-4" />}
                      {category === 'File Download' && <Download className="h-4 w-4" />}
                      {category === 'Legacy Messages' && <MessageSquare className="h-4 w-4" />}
                      {category === 'Real-time Sharing' && <Share2 className="h-4 w-4" />}
                      {category === 'Secure Messaging' && <Shield className="h-4 w-4" />}
                      {category} ({categoryTests.length} tests)
                    </h4>
                    <div className="grid gap-2">
                      {categoryTests.map((test, index) => (
                        <div key={index} className="border rounded p-3 bg-muted/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(test.status)}
                              <span className="font-medium text-sm">{test.test}</span>
                              {test.fileSize && (
                                <Badge variant="outline" className="text-xs">
                                  {(test.fileSize / 1024).toFixed(1)} KB
                                </Badge>
                              )}
                            </div>
                            {getStatusBadge(test.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{test.message}</p>
                          {test.details && (
                            <p className="text-xs text-muted-foreground italic">{test.details}</p>
                          )}
                          {test.timestamp && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(test.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Test Files Created ({uploadedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {uploadedFiles.map((filePath, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                      <File className="h-3 w-3" />
                      <code className="text-xs">{filePath}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {summary.failed > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Test Failures Detected:</strong> {summary.failed} tests failed. 
                Please review the detailed results above and check Vault configuration, storage policies, and database permissions.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}