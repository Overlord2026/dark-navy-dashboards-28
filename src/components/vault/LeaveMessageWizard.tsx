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
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MessageData {
  title: string;
  description: string;
  message_type: 'video' | 'audio' | 'text';
  trigger_type: 'date' | 'event' | 'manual';
  trigger_date?: Date;
  trigger_event?: string;
  recipients: string[];
  require_executor: boolean;
  personal_message: string;
}

interface VaultMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface LeaveMessageWizardProps {
  vaultId: string;
  members: VaultMember[];
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveMessageWizard({ vaultId, members, onClose, onSuccess }: LeaveMessageWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [messageData, setMessageData] = useState<MessageData>({
    title: '',
    description: '',
    message_type: 'text',
    trigger_type: 'manual',
    recipients: [],
    require_executor: false,
    personal_message: ''
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const messageTypes = [
    { value: 'text', label: 'Written Message', icon: '✍️', description: 'A heartfelt letter or note' },
    { value: 'audio', label: 'Voice Recording', icon: '🎙️', description: 'Record your voice message' },
    { value: 'video', label: 'Video Message', icon: '📹', description: 'Record a video message' }
  ];

  const triggerTypes = [
    { value: 'manual', label: 'Send Now', description: 'Deliver immediately' },
    { value: 'date', label: 'Specific Date', description: 'Schedule for a future date' },
    { value: 'event', label: 'Life Event', description: 'Trigger on special occasions' }
  ];

  const lifeEvents = [
    'Birthday', 'Graduation', 'Wedding', 'New Baby', 'New Job', 
    'Retirement', 'Anniversary', 'Holiday', 'Memorial', 'Other'
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

  const uploadRecording = async (blob: Blob): Promise<string> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const fileExt = messageData.message_type === 'video' ? 'webm' : 'webm';
    const fileName = `${user.id}/messages/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('legacy-vault')
      .upload(fileName, blob);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('legacy-vault')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const saveMessage = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      let contentUrl = '';
      
      // Upload recording if exists
      if (recordedBlob) {
        contentUrl = await uploadRecording(recordedBlob);
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
          content_type: recordedBlob?.type || 'text/plain'
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Create delivery rule
      const deliveryRule: any = {
        legacy_item_id: legacyItem.id,
        trigger_type: messageData.trigger_type,
        require_executor_approval: messageData.require_executor
      };

      if (messageData.trigger_date) {
        deliveryRule.trigger_date = messageData.trigger_date.toISOString();
      }

      if (messageData.trigger_event) {
        deliveryRule.trigger_event = messageData.trigger_event;
      }

      const { error: ruleError } = await supabase
        .from('legacy_delivery_rules')
        .insert(deliveryRule);

      if (ruleError) throw ruleError;

      // Add recipients
      if (messageData.recipients.length > 0) {
        const recipients = messageData.recipients.map(memberId => ({
          legacy_item_id: legacyItem.id,
          vault_member_id: memberId,
          personal_message: messageData.personal_message
        }));

        const { error: recipientsError } = await supabase
          .from('legacy_recipients')
          .insert(recipients);

        if (recipientsError) throw recipientsError;
      }

      toast({
        title: "Message saved!",
        description: "Your legacy message has been created successfully.",
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Message Title</Label>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  rows={8}
                  className="min-h-[200px]"
                />
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
              <Label htmlFor="require-executor">Require executor approval before delivery</Label>
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
                      <p className="font-medium">{member.first_name} {member.last_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
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

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return messageData.title.trim().length > 0;
      case 2:
        if (messageData.message_type === 'text') {
          return messageData.personal_message.trim().length > 0;
        }
        return recordedBlob !== null;
      case 3:
        return messageData.trigger_type === 'manual' || 
               (messageData.trigger_type === 'date' && messageData.trigger_date) ||
               (messageData.trigger_type === 'event' && messageData.trigger_event);
      case 4:
        return messageData.recipients.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Leave a Message
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={saveMessage}
                disabled={loading || !canProceed()}
                className="gap-2"
              >
                {loading ? 'Saving...' : 'Save Message'}
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}