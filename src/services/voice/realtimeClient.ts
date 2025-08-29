import { EventEmitter } from 'events';
import { VoiceContext } from '@/config/voice';
import { supabase } from '@/integrations/supabase/client';

interface EphemeralToken {
  token: string;
  expiresAt: Date;
}

interface ConnectionOptions {
  persona: string;
  context: VoiceContext;
}

interface AudioChunk {
  data: Float32Array;
  timestamp: number;
}

class RealtimeClient extends EventEmitter {
  private pc: RTCPeerConnection | null = null;
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private isConnected = false;
  private isListening = false;
  private connectionMode: 'webrtc' | 'websocket' = 'webrtc';
  private ephemeralToken: EphemeralToken | null = null;
  private vadThreshold = 0.01;
  private silenceTimeout: NodeJS.Timeout | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;

  constructor() {
    super();
  }

  async getEphemeralToken(): Promise<EphemeralToken> {
    try {
      const { data, error } = await supabase.functions.invoke('rt-token', {
        body: { purpose: 'voice_realtime' }
      });

      if (error) throw error;

      return {
        token: data.token,
        expiresAt: new Date(data.expiresAt)
      };
    } catch (error) {
      console.error('Failed to get ephemeral token:', error);
      throw new Error('Failed to authenticate voice session');
    }
  }

  async connect(options: ConnectionOptions): Promise<void> {
    try {
      // Get ephemeral token
      this.ephemeralToken = await this.getEphemeralToken();
      
      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });

      // Try WebRTC first, fallback to WebSocket
      try {
        await this.connectWebRTC(options);
        this.connectionMode = 'webrtc';
      } catch (webrtcError) {
        console.warn('WebRTC failed, falling back to WebSocket:', webrtcError);
        await this.connectWebSocket(options);
        this.connectionMode = 'websocket';
      }

      this.isConnected = true;
      this.emit('connected');

    } catch (error) {
      console.error('Connection failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  private async connectWebRTC(options: ConnectionOptions): Promise<void> {
    // Get user media
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 24000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // Create peer connection
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Add audio track
    const audioTrack = this.mediaStream.getAudioTracks()[0];
    this.pc.addTrack(audioTrack, this.mediaStream);

    // Handle remote audio
    this.pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.playRemoteAudio(remoteStream);
    };

    // Handle ICE candidates
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate through signaling
        console.log('ICE candidate:', event.candidate);
      }
    };

    // Create offer
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    // Send offer to OpenAI Realtime API via edge function
    const response = await fetch(`https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/functions/v1/realtime-webrtc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.ephemeralToken?.token}`
      },
      body: JSON.stringify({
        offer: offer.sdp,
        persona: options.persona,
        context: options.context
      })
    });

    if (!response.ok) {
      throw new Error('Failed to establish WebRTC connection');
    }

    const { answer } = await response.json();
    await this.pc.setRemoteDescription({ type: 'answer', sdp: answer });

    console.log('WebRTC connection established');
  }

  private async connectWebSocket(options: ConnectionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/functions/v1/realtime-chat`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        
        // Send session configuration
        this.ws?.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `You are a helpful ${options.persona} assistant.`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            tools: this.getToolsForPersona(options.persona),
            tool_choice: 'auto',
            temperature: 0.8,
            max_response_output_tokens: 4096
          }
        }));

        resolve();
      };

      this.ws.onmessage = (event) => {
        this.handleWebSocketMessage(JSON.parse(event.data));
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('WebSocket connection failed'));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected');
      };

      // Setup timeout
      setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);
    });
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'session.created':
        console.log('Session created:', message);
        break;

      case 'session.updated':
        console.log('Session updated:', message);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        this.emit('partialTranscript', message.transcript);
        break;

      case 'response.text.delta':
        this.emit('partialTranscript', message.delta);
        break;

      case 'response.text.done':
        this.emit('finalTranscript', message.text, 1.0);
        break;

      case 'response.audio.delta':
        this.playAudioDelta(message.delta);
        break;

      case 'response.function_call_arguments.done':
        this.emit('toolCall', message.name, JSON.parse(message.arguments));
        break;

      case 'error':
        this.emit('error', new Error(message.error.message));
        break;

      default:
        console.log('Unhandled message type:', message.type);
    }
  }

  private playRemoteAudio(stream: MediaStream): void {
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
  }

  private playAudioDelta(delta: string): void {
    if (!this.audioContext) return;

    try {
      // Decode base64 PCM audio
      const binaryString = atob(delta);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert to Int16Array (PCM16)
      const int16Array = new Int16Array(bytes.buffer);
      
      // Convert to Float32Array for Web Audio API
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      // Play audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();

    } catch (error) {
      console.error('Error playing audio delta:', error);
    }
  }

  async startVAD(): Promise<void> {
    if (!this.mediaStream || !this.audioContext) {
      throw new Error('Audio not initialized');
    }

    // Create audio processor for VAD
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.audioProcessor.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0);
      
      // Calculate RMS for VU meter
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.emit('vuLevel', rms);

      // VAD: detect if speaking
      if (rms > this.vadThreshold) {
        if (this.silenceTimeout) {
          clearTimeout(this.silenceTimeout);
          this.silenceTimeout = null;
        }
        
        // Send audio chunk
        this.sendAudioChunk(inputData);
      } else {
        // Start silence timeout
        if (!this.silenceTimeout) {
          this.silenceTimeout = setTimeout(() => {
            // End of speech detected
            this.silenceTimeout = null;
          }, 1000);
        }
      }
    };

    source.connect(this.audioProcessor);
    this.audioProcessor.connect(this.audioContext.destination);

    this.isListening = true;
    console.log('VAD started');
  }

  private sendAudioChunk(audioData: Float32Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Convert Float32Array to Int16Array (PCM16)
    const int16Array = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      const s = Math.max(-1, Math.min(1, audioData[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Convert to base64
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Audio = btoa(binary);

    // Send to WebSocket
    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.append',
      audio: base64Audio
    }));
  }

  sendText(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected');
    }

    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text
          }
        ]
      }
    }));

    this.ws.send(JSON.stringify({
      type: 'response.create'
    }));
  }

  async stop(): Promise<void> {
    this.isListening = false;

    // Stop audio processing
    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Close WebRTC
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    // Close audio context
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.isConnected = false;
    this.emit('disconnected');
  }

  private getToolsForPersona(persona: string): any[] {
    const baseTools = [
      {
        type: 'function',
        name: 'create_task',
        description: 'Create a new task with title and due date',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            due: { type: 'string', format: 'date' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] }
          },
          required: ['title']
        }
      }
    ];

    switch (persona) {
      case 'insurance':
        return [
          ...baseTools,
          {
            type: 'function',
            name: 'create_fnol_case',
            description: 'Create a First Notice of Loss case for insurance claim',
            parameters: {
              type: 'object',
              properties: {
                policyNumber: { type: 'string' },
                incidentDate: { type: 'string', format: 'date' },
                incidentType: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['policyNumber', 'incidentDate', 'incidentType']
            }
          },
          {
            type: 'function',
            name: 'quote_auto',
            description: 'Generate auto insurance quote',
            parameters: {
              type: 'object',
              properties: {
                vehicle: { type: 'object' },
                driver: { type: 'object' },
                coverage: { type: 'object' }
              },
              required: ['vehicle', 'driver']
            }
          }
        ];

      case 'advisor':
        return [
          ...baseTools,
          {
            type: 'function',
            name: 'fetch_policy_summary',
            description: 'Fetch summary of insurance policy',
            parameters: {
              type: 'object',
              properties: {
                policy_no: { type: 'string' }
              },
              required: ['policy_no']
            }
          }
        ];

      default:
        return baseTools;
    }
  }
}

export const realtimeClient = new RealtimeClient();