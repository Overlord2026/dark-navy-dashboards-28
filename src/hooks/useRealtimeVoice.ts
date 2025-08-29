import React from 'react';

type RealtimeState = {
  ready: boolean;
  live: boolean;
  error?: string;
  start: (opts?: { tokenPath?: string }) => Promise<void>;
  stop: () => void;
  audioElRef: React.RefObject<HTMLAudioElement>;
};

export function useRealtimeVoice(): RealtimeState {
  const [ready, setReady] = React.useState(false);
  const [live, setLive]  = React.useState(false);
  const [error, setError] = React.useState<string|undefined>(undefined);

  const audioElRef = React.useRef<HTMLAudioElement>(null);
  const pcRef = React.useRef<RTCPeerConnection | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);

  React.useEffect(() => {
    setReady(typeof RTCPeerConnection !== 'undefined' && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  async function start(opts?: { tokenPath?: string }) {
    setError(undefined);
    try {
      if (!ready) throw new Error('WebRTC not supported in this browser');

      // 1) get a short-lived token from our Supabase edge function
      const tokenEndpoint = (opts?.tokenPath ?? '/functions/v1/realtime-ephemeral-token').replace(/^\//,'/');
      const tokenRes = await fetch(tokenEndpoint, { method: 'POST' });
      if (!tokenRes.ok) throw new Error(`Token error: ${tokenRes.status}`);
      const session = await tokenRes.json();
      const EPHEMERAL = session?.client_secret?.value;
      if (!EPHEMERAL) throw new Error('Invalid ephemeral token payload');

      // 2) set up peer connection
      const pc = new RTCPeerConnection({
        // Optional: add TURN/STUN here if you need it; OpenAI handles most NATs
        // iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
      });

      // remote track → audio element
      pc.ontrack = (e) => {
        const [remoteStream] = e.streams;
        if (audioElRef.current) audioElRef.current.srcObject = remoteStream;
      };

      pc.onconnectionstatechange = () => {
        const st = pc.connectionState;
        if (st === 'failed' || st === 'disconnected' || st === 'closed') {
          stop(); // auto-teardown
        }
      };

      // 3) local mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      localStreamRef.current = stream;

      // 4) (optional) data channel for app messages
      pc.createDataChannel('oai-events');

      // 5) create offer and send SDP to OpenAI Realtime
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResp = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EPHEMERAL}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });
      if (!sdpResp.ok) {
        const t = await sdpResp.text().catch(()=> '');
        throw new Error(`Realtime SDP error: ${sdpResp.status} ${t}`);
      }
      const answerSDP = await sdpResp.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });

      pcRef.current = pc;
      setLive(true);
    } catch (e:any) {
      setError(e?.message ?? 'start failed');
      stop();
    }
  }

  function stop() {
    setLive(false);
    try {
      pcRef.current?.getSenders().forEach(s => s.track?.stop());
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;

    try {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
    localStreamRef.current = null;
  }

  return { ready, live, error, start, stop, audioElRef };
}