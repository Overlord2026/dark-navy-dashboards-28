import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(input: ArrayBuffer | string): Promise<string> {
  const data = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

export async function computeMerkleRoot(leaves: string[]): Promise<string> {
  if (leaves.length === 0) return await sha256Hex("nil");
  let level = await Promise.all(leaves.map((l) => sha256Hex(l)));
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left; // duplicate last if odd
      next.push(await sha256Hex(left + right));
    }
    level = next;
  }
  return level[0];
}

async function fileToHash(file: File | undefined | null): Promise<string | undefined> {
  if (!file) return undefined;
  const buf = await file.arrayBuffer();
  return sha256Hex(buf);
}

function normalizeNumber(n: number, min = 0, max = 1, digits = 3): number {
  const clamped = Math.min(max, Math.max(min, n));
  return parseFloat(clamped.toFixed(digits));
}

export async function processVerificationPayload(input: {
  mediaBase64?: string;
  selfieBase64?: string;
  deviceAttestation?: Record<string, unknown> | null;
}): Promise<{
  content_hash: string;
  selfie_hash?: string;
  device_hash?: string;
  authenticity_score: number;
  watermark_id: string;
  merkle_root: string;
  evidence_bundle: Record<string, unknown>;
}> {
  const mediaHash = input.mediaBase64
    ? await sha256Hex(atob(input.mediaBase64))
    : await sha256Hex("no-media");
  const selfieHash = input.selfieBase64 ? await sha256Hex(atob(input.selfieBase64)) : undefined;
  const deviceHash = input.deviceAttestation ? await sha256Hex(JSON.stringify(input.deviceAttestation)) : undefined;

  let score = 0.6;
  if (selfieHash) score += 0.2;
  if (deviceHash) score += 0.2;
  const authenticity_score = normalizeNumber(score);
  const watermark_id = `wm_${crypto.randomUUID()}`;

  const leaves = [mediaHash];
  if (selfieHash) leaves.push(selfieHash);
  if (deviceHash) leaves.push(deviceHash);
  const merkle_root = await computeMerkleRoot(leaves);

  const evidence_bundle = {
    schema_version: "1.0",
    media_hash: mediaHash,
    selfie_hash: selfieHash,
    device_hash: deviceHash,
    watermark_id,
    authenticity_score,
    created_at: new Date().toISOString(),
  };

  return {
    content_hash: mediaHash,
    selfie_hash: selfieHash,
    device_hash: deviceHash,
    authenticity_score,
    watermark_id,
    merkle_root,
    evidence_bundle,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    let body: any;
    let mediaHash: string | undefined;
    let selfieHash: string | undefined;
    let deviceAttestation: Record<string, unknown> | null = null;
    let dealId: string | undefined;
    let deliverableId: string | undefined;
    let partyId: string | undefined;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const media = form.get("media") as File | null;
      const selfie = form.get("selfie") as File | null;
      const device = form.get("device_attestation") as string | null;
      dealId = (form.get("deal_id") as string) || undefined;
      deliverableId = (form.get("deliverable_id") as string) || undefined;
      partyId = (form.get("party_id") as string) || undefined;
      mediaHash = await fileToHash(media);
      selfieHash = await fileToHash(selfie);
      deviceAttestation = device ? JSON.parse(device) : null;
    } else {
      body = await req.json();
      dealId = body.deal_id;
      deliverableId = body.deliverable_id;
      partyId = body.party_id;
      const processed = await processVerificationPayload({
        mediaBase64: body.media_base64,
        selfieBase64: body.selfie_base64,
        deviceAttestation: body.device_attestation ?? null,
      });
      mediaHash = processed.content_hash;
      selfieHash = processed.selfie_hash;
      deviceAttestation = body.device_attestation ?? null;
    }

    // Fallback if multipart path didn't compute via helper
    if (!mediaHash) mediaHash = await sha256Hex("no-media");

    // Compute authenticity and bundle
    const { authenticity_score, watermark_id, merkle_root, evidence_bundle } = await processVerificationPayload({
      mediaBase64: undefined, // already hashed above
      selfieBase64: undefined,
      deviceAttestation,
    });

    const eventPayload = {
      event_type: "authenticity_verification",
      deal_id: dealId ?? null,
      deliverable_id: deliverableId ?? null,
      party_id: partyId ?? null,
      authenticity_score,
      content_hash: mediaHash,
      watermark_id,
      merkle_root,
      zk_receipt: "placeholder-zk-receipt",
      verification_metadata: evidence_bundle,
    } as const;

    const { data, error } = await supabase.from("nil_events").insert(eventPayload).select("id").single();
    if (error) {
      console.error("DB insert error", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const response = {
      event_id: data?.id,
      authenticity_score,
      content_hash: mediaHash,
      watermark_id,
      evidence_bundle,
      merkle_root,
      chain_anchor: { status: "stubbed", tx: null },
    };

    return new Response(JSON.stringify(response), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("nil-auth-verify error", err);
    return new Response(JSON.stringify({ error: err?.message ?? "unknown_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
