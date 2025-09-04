/**
 * Linda Voice Test Component
 * Test Linda's new voice settings with AriaNeural
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { playLindaWelcome, testLindaVoice, getLindaVoice } from '@/utils/lindaVoice';

export const LindaVoiceTest: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string>('');
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    // Check voice support
    setVoiceSupported('speechSynthesis' in window);
    
    // Get Linda's voice info
    if ('speechSynthesis' in window) {
      const checkVoice = () => {
        const voice = getLindaVoice();
        setCurrentVoice(voice ? voice.name : 'Default voice');
      };
      
      if (window.speechSynthesis.getVoices().length > 0) {
        checkVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = checkVoice;
      }
    }
  }, []);

  const testMessages = [
    "Hi, I'm Linda. Welcome to your family's boutique home. Ready to explore?",
    "Hello! This is Linda with my new voice settings. I sound warmer and more caring now.",
    "Welcome to your secure family hub. Let's build your health and wealth blueprint together.",
    "I'm here to guide you through your family's financial journey with care and expertise."
  ];

  const playTestMessage = async (message: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await playLindaWelcome(message);
    } catch (error) {
      console.error('Linda voice test error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!voiceSupported) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5 text-red-500" />
            Voice Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Speech synthesis is not supported in this browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Linda Voice Test Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Voice: {currentVoice}
            </Badge>
            <Badge variant={currentVoice.includes('Aria') ? 'default' : 'outline'}>
              {currentVoice.includes('Aria') ? 'AriaNeural ✓' : 'Fallback Voice'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Linda's New Settings:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Voice: en-US-AriaNeural (preferred)</li>
              <li>• Pitch: 1.3 (warmer, more feminine)</li>
              <li>• Rate: 0.95 (soft, inviting flow)</li>
              <li>• Volume: 0.8 (clear but gentle)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Test Linda's Voice:</h4>
            {testMessages.map((message, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playTestMessage(message)}
                  disabled={isPlaying}
                  className="shrink-0"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <p className="text-sm flex-1">{message}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => testLindaVoice()}
              disabled={isPlaying}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Playing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Quick Voice Test
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={stopSpeech}
              disabled={!isPlaying}
            >
              <VolumeX className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voice Quality Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Warmth:</strong> High (1.3 pitch)
            </div>
            <div>
              <strong>Pace:</strong> Gentle (0.95 rate)
            </div>
            <div>
              <strong>Tone:</strong> Caring & Professional
            </div>
            <div>
              <strong>Gender:</strong> Feminine Voice
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};