import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Calendar as CalendarIcon,
  Users,
  Settings,
  Heart,
  Upload,
  X,
  Clock,
  Bell,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SecureFileUpload } from './SecureFileUpload';

interface MessageData {
  title: string;
  description: string;
  message_type: 'video' | 'audio' | 'text' | 'file';
  trigger_type: 'date' | 'event' | 'manual';
  trigger_date?: Date;
  trigger_event?: string;
  recipients: string[];
  require_executor: boolean;
  personal_message: string;
  priority: 'low' | 'normal' | 'high';
}

interface VaultMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  permission_level: string;
  is_executor?: boolean;
}

interface EnhancedLeaveMessageWizardProps {
  vaultId: string;
  members: VaultMember[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EnhancedLeaveMessageWizard({ vaultId, members, onClose, onSuccess }: EnhancedLeaveMessageWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  
  const [messageData, setMessageData] = useState<MessageData>({
    title: '',
    description: '',
    message_type: 'text',
    trigger_type: 'manual',
    recipients: [],
    require_executor: false,
    personal_message: '',
    priority: 'normal'
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const messageTypes = [
    { value: 'text', label: 'Written Message', icon: '✍️', description: 'A heartfelt letter or note' },
    { value: 'audio', label: 'Voice Recording', icon: '🎙️', description: 'Record your voice message' },
    { value: 'video', label: 'Video Message', icon: '📹', description: 'Record a video message' },
    { value: 'file', label: 'File Upload', icon: '📎', description: 'Upload documents, photos, or other files' }
  ];

  const triggerTypes = [
    { value: 'manual', label: 'Send Now', description: 'Deliver immediately', icon: <Bell className="h-4 w-4" /> },
    { value: 'date', label: 'Specific Date', description: 'Schedule for a future date', icon: <CalendarIcon className="h-4 w-4" /> },
    { value: 'event', label: 'Life Event', description: 'Trigger on special occasions', icon: <Heart className="h-4 w-4" /> }
  ];

  const lifeEvents = [
    'Birthday', 'Graduation', 'Wedding', 'New Baby', 'New Job', 
    'Retirement', 'Anniversary', 'Holiday', 'Memorial', 'Other'
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ];

  const steps = [
    { number: 1, title: 'Message Details', description: 'Basic information and type' },
    { number: 2, title: 'Create Content', description: 'Record or write your message' },
    { number: 3, title: 'Delivery Settings', description: 'When and how to deliver' },
    { number: 4, title: 'Recipients', description: 'Who will receive this message' },
    { number: 5, title: 'Review & Send', description: 'Confirm and schedule' }
  ];

  const startRecording = async () => {
    try {
      const constraints = messageData.message_type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current && messageData.message_type === 'video') {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: messageData.message_type === 'video' ? 'video/webm' : 'audio/webm' 
        });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Unable to access camera/microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const saveMessage = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      let contentUrl = '';
      
      // Handle different content types
      if (recordedBlob) {
        // Upload recording
        const fileName = `${user.id}/messages/${Date.now()}.${messageData.message_type === 'video' ? 'webm' : 'webm'}`;
        const { error: uploadError } = await supabase.storage
          .from('legacy-vault')
          .upload(fileName, recordedBlob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('legacy-vault')
          .getPublicUrl(fileName);

        contentUrl = publicUrl;
      } else if (uploadedFileId) {
        // Use uploaded file
        const { data: fileData } = await supabase
          .from('vault_files')
          .select('file_path')
          .eq('id', uploadedFileId)
          .single();
        
        if (fileData) {
          contentUrl = fileData.file_path;
        }
      }

      // Create legacy item
      const { data: legacyItem, error: itemError } = await supabase
        .from('legacy_items')
        .insert({
          vault_id: vaultId,
          created_by: user.id,
          item_type: messageData.message_type,
          title: messageData.title,
          description: messageData.description,
          content_url: contentUrl,
          content_type: recordedBlob?.type || 'text/plain',
          status: 'active'
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Create delivery rule with enhanced settings
      const deliveryRule: any = {
        legacy_item_id: legacyItem.id,
        trigger_type: messageData.trigger_type,
        require_executor_approval: messageData.require_executor,
        delivery_status: messageData.trigger_type === 'manual' ? 'pending' : 'scheduled'
      };

      if (messageData.trigger_date) {
        deliveryRule.trigger_date = messageData.trigger_date.toISOString();
        deliveryRule.scheduled_for = messageData.trigger_date.toISOString();
      }

      if (messageData.trigger_event) {
        deliveryRule.trigger_event = messageData.trigger_event;
      }

      const { error: ruleError } = await supabase
        .from('legacy_delivery_rules')
        .insert(deliveryRule);

      if (ruleError) throw ruleError;

      // Add recipients with priority levels
      if (messageData.recipients.length > 0) {
        const recipients = messageData.recipients.map(memberId => ({
          legacy_item_id: legacyItem.id,
          vault_member_id: memberId,
          personal_message: messageData.personal_message,
          delivery_status: 'pending'
        }));

        const { error: recipientsError } = await supabase
          .from('legacy_recipients')
          .insert(recipients);

        if (recipientsError) throw recipientsError;
      }

      // Create notifications for immediate delivery
      if (messageData.trigger_type === 'manual') {
        await supabase.functions.invoke('vault-notifications', {
          body: {
            action: 'send_notification',
            vaultId,
            recipientId: messageData.recipients[0], // For now, send to first recipient
            type: 'legacy_message',
            title: `New Legacy Message: ${messageData.title}`,
            message: messageData.description || 'You have received a new legacy message.',
            deliveryMethod: 'email'
          }
        });
      }

      // Log activity
      await supabase.rpc('log_vault_activity', {
        p_vault_id: vaultId,
        p_action_type: 'message_created',
        p_resource_type: 'legacy_item',
        p_resource_id: legacyItem.id,
        p_details: { 
          title: messageData.title, 
          type: messageData.message_type,
          trigger_type: messageData.trigger_type,
          priority: messageData.priority
        }
      });

      toast({
        title: "Message saved!",
        description: `Your legacy message "${messageData.title}" has been created successfully.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Save failed",
        description: "Failed to save message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return messageData.title.trim().length > 0 && messageData.message_type;
      case 2:
        if (messageData.message_type === 'text') return messageData.personal_message.trim().length > 0;
        if (messageData.message_type === 'file') return uploadedFileId !== null;
        return recordedBlob !== null;
      case 3:
        if (messageData.trigger_type === 'date') return messageData.trigger_date !== undefined;
        if (messageData.trigger_type === 'event') return messageData.trigger_event !== undefined;
        return true;
      case 4:
        return messageData.recipients.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Message Title *</Label>
              <Input
                id="title"
                placeholder="e.g., 18th Birthday Wishes"
                value={messageData.title}
                onChange={(e) => setMessageData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your message..."
                value={messageData.description}
                onChange={(e) => setMessageData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Message Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messageTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      messageData.message_type === type.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setMessageData(prev => ({ ...prev, message_type: type.value as any }))}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="text-2xl">{type.icon}</div>
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select 
                value={messageData.priority} 
                onValueChange={(value: any) => setMessageData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {messageData.message_type === 'text' ? (
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your heartfelt message here..."
                  value={messageData.personal_message}
                  onChange={(e) => setMessageData(prev => ({ ...prev, personal_message: e.target.value }))}
                  rows={12}
                  className="min-h-[300px]"
                />
              </div>
            ) : messageData.message_type === 'file' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload Files</h3>
                <Button onClick={() => setShowFileUpload(true)} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Choose Files
                </Button>
                
                {uploadedFileId && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">✓ File uploaded successfully</p>
                  </div>
                )}

                <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload Files to Legacy Message</DialogTitle>
                    </DialogHeader>
                    <SecureFileUpload
                      vaultId={vaultId}
                      userRole="member"
                      masterKey={new CryptoKey()}
                      onUploadComplete={(fileId) => {
                        setUploadedFileId(fileId);
                        setShowFileUpload(false);
                      }}
                      showMobileCapture={true}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium">
                    Record Your {messageData.message_type === 'video' ? 'Video' : 'Audio'} Message
                  </h3>
                  
                  {messageData.message_type === 'video' && (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full max-w-md mx-auto rounded-lg bg-black"
                    />
                  )}

                  <div className="flex justify-center gap-4">
                    {!recording ? (
                      <Button onClick={startRecording} className="gap-2">
                        {messageData.message_type === 'video' ? <Video className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        Start Recording
                      </Button>
                    ) : (
                      <Button onClick={stopRecording} variant="destructive" className="gap-2">
                        <Square className="h-4 w-4" />
                        Stop Recording
                      </Button>
                    )}
                  </div>

                  {recordedBlob && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">✓ Recording completed</p>
                      <Button
                        variant="outline"
                        onClick={() => setRecordedBlob(null)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Discard & Re-record
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>When to Deliver</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {triggerTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      messageData.trigger_type === type.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setMessageData(prev => ({ ...prev, trigger_type: type.value as any }))}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="flex justify-center">{type.icon}</div>
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {messageData.trigger_type === 'date' && (
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {messageData.trigger_date ? format(messageData.trigger_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={messageData.trigger_date}
                      onSelect={(date) => setMessageData(prev => ({ ...prev, trigger_date: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {messageData.trigger_type === 'event' && (
              <div className="space-y-2">
                <Label>Life Event</Label>
                <Select
                  value={messageData.trigger_event}
                  onValueChange={(value) => setMessageData(prev => ({ ...prev, trigger_event: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {lifeEvents.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="require-executor"
                checked={messageData.require_executor}
                onCheckedChange={(checked) => setMessageData(prev => ({ ...prev, require_executor: checked }))}
              />
              <Label htmlFor="require-executor" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Require executor approval before delivery
              </Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Recipients</Label>
              <p className="text-sm text-muted-foreground">
                Choose who will receive this message from your family circle.
              </p>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      messageData.recipients.includes(member.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      const newRecipients = messageData.recipients.includes(member.id)
                        ? messageData.recipients.filter(id => id !== member.id)
                        : [...messageData.recipients, member.id];
                      setMessageData(prev => ({ ...prev, recipients: newRecipients }));
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.first_name || ''} {member.last_name || ''}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.permission_level === 'admin' ? 'default' : 'secondary'}>
                        {member.permission_level}
                      </Badge>
                      {member.is_executor && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                          Executor
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {messageData.recipients.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="personal-message">Personal Note (Optional)</Label>
                <Textarea
                  id="personal-message"
                  placeholder="Add a personal note that will be included with the delivery..."
                  value={messageData.personal_message}
                  onChange={(e) => setMessageData(prev => ({ ...prev, personal_message: e.target.value }))}
                  rows={3}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Review Your Legacy Message</h3>
              <p className="text-muted-foreground">
                Please review all details before creating your message.
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-medium">Message Title</h4>
                  <p className="text-muted-foreground">{messageData.title}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Type & Priority</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {messageData.message_type}
                    </Badge>
                    <Badge variant={messageData.priority === 'high' ? 'destructive' : 'secondary'}>
                      {messageData.priority} priority
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Delivery</h4>
                  <p className="text-muted-foreground capitalize">
                    {messageData.trigger_type === 'date' && messageData.trigger_date
                      ? `On ${format(messageData.trigger_date, "PPP")}`
                      : messageData.trigger_type === 'event' && messageData.trigger_event
                      ? `When: ${messageData.trigger_event}`
                      : 'Immediately'
                    }
                  </p>
                  {messageData.require_executor && (
                    <p className="text-sm text-yellow-600">⚠️ Requires executor approval</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium">Recipients ({messageData.recipients.length})</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {messageData.recipients.map(recipientId => {
                      const member = members.find(m => m.id === recipientId);
                      return member ? (
                        <Badge key={recipientId} variant="outline">
                          {member.first_name} {member.last_name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Leave a Legacy Message
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.number
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.number}
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="gap-2"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={saveMessage}
              disabled={loading || !canProceed()}
              className="gap-2"
            >
              {loading ? 'Creating...' : 'Create Legacy Message'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}