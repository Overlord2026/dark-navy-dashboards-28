import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  persona: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    target: string;
    result: string;
  };
}

export default function VoiceAssistant({ isOpen, onClose, persona }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      initializeVoiceServices();
      addWelcomeMessage();
    }
    return () => {
      cleanup();
    };
  }, [isOpen, persona]);

  const initializeVoiceServices = () => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          handleUserInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    setIsConnected(true);
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Hello! I'm your ${persona} assistant. I can help you navigate tools, analyze data, schedule meetings, and ensure compliance. How can I assist you today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleUserInput = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setTextInput('');

    // Process the input and generate response
    const response = await processVoiceCommand(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      action: response.action
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Speak the response
    if (synthRef.current && response.content) {
      speak(response.content);
    }
  };

  const processVoiceCommand = async (input: string): Promise<{ content: string; action?: any }> => {
    const lowerInput = input.toLowerCase();

    // Tool navigation commands
    if (lowerInput.includes('open') && lowerInput.includes('tool')) {
      return {
        content: "I can help you open tools. Which specific tool would you like to access?",
        action: { type: 'navigation', target: 'tools', result: 'pending' }
      };
    }

    // Data query commands
    if (lowerInput.includes('show') || lowerInput.includes('display')) {
      return {
        content: "I can display various data for you. What information are you looking for?",
        action: { type: 'data_query', target: 'dashboard', result: 'success' }
      };
    }

    // Compliance commands
    if (lowerInput.includes('compliance') || lowerInput.includes('receipt')) {
      return {
        content: "Your compliance status is excellent. All recent actions have been properly documented with compliance receipts.",
        action: { type: 'compliance_check', target: 'status', result: 'success' }
      };
    }

    // Meeting commands
    if (lowerInput.includes('meeting') || lowerInput.includes('schedule')) {
      return {
        content: "I can help you schedule meetings or review upcoming appointments. Would you like to see your calendar?",
        action: { type: 'calendar_access', target: 'meetings', result: 'success' }
      };
    }

    // Default response
    return {
      content: "I understand you said: '" + input + "'. I'm here to help with tools, data analysis, scheduling, and compliance. What would you like me to do?"
    };
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserInput(textInput.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Assistant
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-accent/10 rounded-lg min-h-[300px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.action && (
                  <div className="mt-2 p-2 bg-accent/20 rounded text-xs">
                    <Badge variant="outline" className="mb-1">
                      {message.action.type}
                    </Badge>
                    <p>Target: {message.action.target}</p>
                    <p>Result: {message.action.result}</p>
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isListening ? 'destructive' : 'default'}
              size="lg"
              onClick={toggleListening}
              disabled={!isConnected}
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>

            <Button
              variant={isSpeaking ? 'destructive' : 'outline'}
              size="lg"
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
              className="flex items-center gap-2"
            >
              {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              {isSpeaking ? 'Stop Speaking' : 'Voice Output'}
            </Button>
          </div>

          {/* Text Input */}
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button type="submit" disabled={!textInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Status indicators */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-1 ${isListening ? 'text-red-500' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isListening ? 'Listening...' : 'Voice inactive'}
              </span>
              <span className={`flex items-center gap-1 ${isSpeaking ? 'text-blue-500' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isSpeaking ? 'Speaking...' : 'Audio inactive'}
              </span>
            </div>
            <span>Persona: {persona}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}