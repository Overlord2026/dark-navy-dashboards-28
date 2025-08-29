import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { VOICE_CONFIG, VoiceContext, VoicePersona } from '@/config/voice';
import { realtimeClient } from '@/services/voice/realtimeClient';
import { useAuth } from '@/hooks/useAuth';

interface VoiceBarProps {
  persona: VoicePersona;
  context?: Partial<VoiceContext>;
  className?: string;
}

interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
  confidence?: number;
}

export const VoiceBar: React.FC<VoiceBarProps> = ({ 
  persona, 
  context = {}, 
  className = '' 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [vuLevel, setVuLevel] = useState(0);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [saveToVault, setSaveToVault] = useState<boolean>(VOICE_CONFIG.AUTO_SAVE_TRANSCRIPTS);
  const [hasConsented, setHasConsented] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const vuMeterRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(Date.now().toString());

  // Check if voice is enabled for this persona
  const isVoiceEnabled = VOICE_CONFIG.VOICE_ENABLED && VOICE_CONFIG.VOICE_PER_PERSONA[persona];

  useEffect(() => {
    if (!isVoiceEnabled) return;

    // Initialize realtime client
    realtimeClient.on('connected', () => {
      setIsConnected(true);
      setError(null);
    });

    realtimeClient.on('disconnected', () => {
      setIsConnected(false);
      setIsListening(false);
    });

    realtimeClient.on('partialTranscript', (text: string) => {
      handlePartialTranscript(text);
    });

    realtimeClient.on('finalTranscript', (text: string, confidence: number) => {
      handleFinalTranscript(text, confidence);
    });

    realtimeClient.on('toolCall', (toolName: string, args: any) => {
      handleToolCall(toolName, args);
    });

    realtimeClient.on('error', (error: Error) => {
      handleError(error);
    });

    realtimeClient.on('vuLevel', (level: number) => {
      setVuLevel(level);
    });

    return () => {
      realtimeClient.removeAllListeners();
      if (isConnected) {
        realtimeClient.stop();
      }
    };
  }, [isVoiceEnabled, persona]);

  const handlePartialTranscript = (text: string) => {
    const redactedText = VOICE_CONFIG.REDACTION_ENABLED ? redactPII(text) : text;
    
    setTranscriptSegments(prev => {
      const withoutPartial = prev.filter(seg => seg.isFinal);
      return [...withoutPartial, {
        id: `partial-${Date.now()}`,
        text: redactedText,
        timestamp: new Date(),
        isFinal: false
      }];
    });
  };

  const handleFinalTranscript = async (text: string, confidence: number) => {
    const redactedText = VOICE_CONFIG.REDACTION_ENABLED ? redactPII(text) : text;
    
    const finalSegment: TranscriptSegment = {
      id: `final-${Date.now()}`,
      text: redactedText,
      timestamp: new Date(),
      isFinal: true,
      confidence
    };

    setTranscriptSegments(prev => {
      const withoutPartial = prev.filter(seg => seg.isFinal);
      return [...withoutPartial, finalSegment];
    });

    // Emit receipt for transcript
    if (saveToVault && user) {
      await emitTranscriptReceipt(text, confidence);
    }

    // Analytics
    analytics.track('voice.transcript_final', {
      persona,
      confidence,
      length: text.length,
      sessionId: sessionIdRef.current,
      ...context
    });
  };

  const handleToolCall = async (toolName: string, args: any) => {
    try {
      // Echo tool execution to user
      const echoText = `I'm ${getToolEchoMessage(toolName, args)}...`;
      setTranscriptSegments(prev => [...prev, {
        id: `tool-echo-${Date.now()}`,
        text: echoText,
        timestamp: new Date(),
        isFinal: true
      }]);

      // Execute tool
      const result = await executeToolCall(toolName, args);
      
      // Analytics
      analytics.track('voice.toolCalled', {
        toolName,
        persona,
        success: true,
        sessionId: sessionIdRef.current,
        ...context
      });

      // Show success toast
      toast({
        title: "Action Completed",
        description: `Successfully executed ${toolName}`,
      });

    } catch (error) {
      console.error('Tool execution failed:', error);
      
      analytics.track('voice.toolCalled', {
        toolName,
        persona,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId: sessionIdRef.current,
        ...context
      });

      toast({
        title: "Action Failed",
        description: `Failed to execute ${toolName}`,
        variant: "destructive"
      });
    }
  };

  const handleError = (error: Error) => {
    console.error('Voice error:', error);
    setError(error.message);
    setIsListening(false);
    
    analytics.track('voice.error', {
      error: error.message,
      persona,
      sessionId: sessionIdRef.current,
      ...context
    });

    toast({
      title: "Voice Error",
      description: error.message,
      variant: "destructive"
    });
  };

  const startListening = async () => {
    if (!isVoiceEnabled) return;

    try {
      // Check consent first
      if (!hasConsented) {
        const consented = await showConsentModal();
        if (!consented) return;
        setHasConsented(true);
        await emitConsentReceipt();
      }

      // Connect if not already connected
      if (!isConnected) {
        await realtimeClient.connect({ persona, context: { ...context, sessionId: sessionIdRef.current, persona } });
      }

      // Start VAD
      await realtimeClient.startVAD();
      setIsListening(true);
      setError(null);

      // Analytics
      analytics.track('voice.start', {
        persona,
        sessionId: sessionIdRef.current,
        ...context
      });

    } catch (error) {
      handleError(error as Error);
    }
  };

  const stopListening = async () => {
    try {
      await realtimeClient.stop();
      setIsListening(false);

      // Analytics
      analytics.track('voice.stop', {
        persona,
        sessionId: sessionIdRef.current,
        transcriptSegments: transcriptSegments.filter(s => s.isFinal).length,
        ...context
      });

    } catch (error) {
      handleError(error as Error);
    }
  };

  const saveTranscriptsToVault = async () => {
    if (!user || transcriptSegments.length === 0) return;

    try {
      const finalTranscripts = transcriptSegments.filter(s => s.isFinal);
      const fullTranscript = finalTranscripts.map(s => s.text).join(' ');

      // TODO: Implement vault storage
      console.log('Saving transcript to vault:', fullTranscript);

      toast({
        title: "Transcript Saved",
        description: "Voice transcript has been saved to your vault",
      });

    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save transcript to vault",
        variant: "destructive"
      });
    }
  };

  // Helper functions
  const redactPII = (text: string): string => {
    // Simple PII redaction patterns
    return text
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD-REDACTED]')
      .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL-REDACTED]');
  };

  const showConsentModal = async (): Promise<boolean> => {
    // TODO: Implement consent modal
    return new Promise((resolve) => {
      const consent = window.confirm(
        `This voice assistant will record and process your speech. Do you consent to voice recording for ${persona} services?`
      );
      resolve(consent);
    });
  };

  const emitConsentReceipt = async () => {
    // TODO: Emit MeetingConsent-RDS
    console.log('Emitting consent receipt for voice:', { voice: true, persona });
  };

  const emitTranscriptReceipt = async (text: string, confidence: number) => {
    // TODO: Emit Transcript-RDS
    console.log('Emitting transcript receipt:', { 
      content_free_hash: hashText(text),
      confidence,
      timestamp: new Date()
    });
  };

  const executeToolCall = async (toolName: string, args: any): Promise<any> => {
    // TODO: Implement actual tool execution
    console.log('Executing tool:', toolName, args);
    
    switch (toolName) {
      case 'create_fnol_case':
        return { caseId: 'case-' + Date.now() };
      case 'create_task':
        return { taskId: 'task-' + Date.now() };
      case 'fetch_policy_summary':
        return { summary: 'Policy summary for ' + args.policy_no };
      case 'quote_auto':
        return { quoteId: 'quote-' + Date.now(), premium: 1200 };
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  };

  const getToolEchoMessage = (toolName: string, args: any): string => {
    switch (toolName) {
      case 'create_fnol_case':
        return 'starting your insurance claim';
      case 'create_task':
        return `creating task "${args.title}"`;
      case 'fetch_policy_summary':
        return `looking up policy ${args.policy_no}`;
      case 'quote_auto':
        return 'generating your auto insurance quote';
      default:
        return `executing ${toolName}`;
    }
  };

  const hashText = (text: string): string => {
    // Simple hash for content-free logging
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  };

  if (!isVoiceEnabled) {
    return null;
  }

  return (
    <Card className={`voice-bar ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* Mic Button & Status */}
          <div className="flex items-center space-x-3">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={!isVoiceEnabled}
              className="relative"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>

            {/* Connection Status */}
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>

            {/* VU Meter */}
            {isListening && (
              <div className="flex items-center space-x-1">
                <Volume2 className="h-3 w-3 text-muted-foreground" />
                <div ref={vuMeterRef} className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-75"
                    style={{ width: `${Math.min(vuLevel * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
            <Switch
              checked={saveToVault}
              onCheckedChange={setSaveToVault}
            />
              <span className="text-muted-foreground">Save to Vault</span>
            </div>

            {transcriptSegments.filter(s => s.isFinal).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={saveTranscriptsToVault}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Captions Area */}
        {transcriptSegments.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-foreground">Live Captions:</div>
            <div className="max-h-32 overflow-y-auto space-y-1 text-sm bg-muted/50 p-3 rounded">
              {transcriptSegments.slice(-5).map((segment) => (
                <div key={segment.id} className={`${segment.isFinal ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                  <span className="text-xs text-muted-foreground mr-2">
                    {segment.timestamp.toLocaleTimeString()}
                  </span>
                  {segment.text}
                  {segment.confidence && segment.isFinal && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({Math.round(segment.confidence * 100)}%)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceBar;