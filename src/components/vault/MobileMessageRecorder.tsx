import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw,
  Check,
  AlertCircle,
  Volume2,
  Smartphone,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MobileMessageRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export function MobileMessageRecorder({ 
  onRecordingComplete, 
  maxDuration = 300, // 5 minutes default
  className 
}: MobileMessageRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
      console.error('Microphone permission denied:', error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      toast.success('Microphone access granted!');
    } catch (error) {
      setHasPermission(false);
      toast.error('Microphone access is required to record messages.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Start audio level monitoring
      monitorAudioLevel();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            toast.warning(`Maximum recording duration (${Math.floor(maxDuration / 60)} minutes) reached.`);
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            toast.warning(`Maximum recording duration (${Math.floor(maxDuration / 60)} minutes) reached.`);
          }
          return newDuration;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current || (!isRecording || isPaused)) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100));
      
      animationRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const playRecording = () => {
    if (!recordedAudio) return;

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    const audio = new Audio();
    audio.src = URL.createObjectURL(recordedAudio);
    audioElementRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.play();
    setIsPlaying(true);
  };

  const pausePlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setDuration(0);
    setCurrentTime(0);
    setAudioLevel(0);
    
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setIsPlaying(false);
  };

  const confirmRecording = () => {
    if (recordedAudio) {
      onRecordingComplete(recordedAudio, duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Permission required state
  if (hasPermission === false) {
    return (
      <Card className={cn("border-2 border-dashed border-orange-200", className)}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">Microphone Access Required</h3>
          <p className="text-muted-foreground mb-6">
            To record voice messages, please allow microphone access in your browser.
          </p>
          <Button 
            onClick={requestMicrophonePermission}
            className="bg-gradient-to-r from-gold to-emerald text-navy font-semibold hover-scale touch-target"
            size="lg"
          >
            <Mic className="mr-2 h-5 w-5" />
            Enable Microphone
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-white to-gold/5 border-gold/20", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-navy mb-2">Voice Message Recorder</h3>
            <p className="text-sm text-muted-foreground">
              Record a personal message for your family vault
            </p>
          </div>

          {/* Visual Feedback */}
          <div className="text-center">
            <div className={cn(
              "w-32 h-32 mx-auto rounded-full flex items-center justify-center relative",
              "bg-gradient-to-br transition-all duration-300",
              isRecording && !isPaused
                ? "from-red-400 to-red-600 animate-pulse"
                : recordedAudio
                ? "from-emerald-400 to-emerald-600"
                : "from-gold/30 to-emerald/30"
            )}>
              {isRecording && !isPaused && (
                <div 
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  style={{
                    transform: `scale(${1 + (audioLevel / 100) * 0.3})`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              )}
              
              {isRecording ? (
                <Square className="h-12 w-12 text-white" />
              ) : recordedAudio ? (
                <Check className="h-12 w-12 text-white" />
              ) : (
                <Mic className="h-12 w-12 text-white" />
              )}
            </div>

            {/* Timer Display */}
            <div className="mt-4">
              <div className="text-2xl font-mono font-bold text-navy">
                {formatTime(recordedAudio ? currentTime : duration)}
              </div>
              {recordedAudio && (
                <div className="text-sm text-muted-foreground">
                  / {formatTime(duration)}
                </div>
              )}
            </div>

            {/* Audio Level Indicator */}
            {isRecording && !isPaused && (
              <div className="mt-3">
                <div className="flex items-center justify-center gap-1">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gold to-emerald transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Recording Progress */}
            {isRecording && (
              <div className="mt-4">
                <Progress 
                  value={(duration / maxDuration) * 100} 
                  className="h-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor((maxDuration - duration) / 60)}:{String((maxDuration - duration) % 60).padStart(2, '0')} remaining
                </p>
              </div>
            )}
          </div>

          {/* Status Messages */}
          <div className="text-center">
            {isRecording && !isPaused && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                Recording...
              </Badge>
            )}
            {isPaused && (
              <Badge variant="secondary">
                <Pause className="w-3 h-3 mr-1" />
                Paused
              </Badge>
            )}
            {recordedAudio && !isRecording && (
              <Badge variant="outline" className="bg-emerald/10 text-emerald-700 border-emerald/20">
                <Check className="w-3 h-3 mr-1" />
                Recording Complete
              </Badge>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-3">
            {!isRecording && !recordedAudio && (
              <Button
                onClick={startRecording}
                className="bg-gradient-to-r from-gold to-emerald text-navy font-semibold h-14 touch-target hover-scale"
                size="lg"
              >
                <Mic className="mr-3 h-6 w-6" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  variant="outline"
                  className="h-14 touch-target"
                  size="lg"
                >
                  {isPaused ? (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="h-14 touch-target"
                  size="lg"
                >
                  <Square className="mr-2 h-5 w-5" />
                  Stop
                </Button>
              </div>
            )}

            {recordedAudio && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={isPlaying ? pausePlayback : playRecording}
                    variant="outline"
                    className="h-14 touch-target"
                    size="lg"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    className="h-14 touch-target"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Retry
                  </Button>
                </div>
                
                <Button
                  onClick={confirmRecording}
                  className="w-full bg-gradient-to-r from-emerald to-emerald-600 text-white font-semibold h-14 touch-target hover-scale"
                  size="lg"
                >
                  <Check className="mr-3 h-6 w-6" />
                  Use This Recording
                </Button>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {!isRecording && !recordedAudio && "Tap the microphone to start recording"}
              {isRecording && "Speak clearly into your device's microphone"}
              {recordedAudio && "Play to review, or confirm to use this recording"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}