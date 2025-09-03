import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { parseToSwag } from "./parser.ts"; // relative import with .ts




serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const out = parseToSwag(body);
    return new Response(JSON.stringify({ ok: true, ...out }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});