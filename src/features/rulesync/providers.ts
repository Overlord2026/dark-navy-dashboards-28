export type RuleDomain = "estate" | "nil" | "advisor" | "cpa" | "attorney" | "insurance" | "medicare" | "healthcare";

export type RulePayload = {
  domain: RuleDomain;
  county_token: string;           // e.g., "CA/Los_Angeles"
  policy_version: string;         // e.g., "ER-2025.09"
  issued_at: string;              // ISO
  valid_from: string;             // ISO
  expires_at?: string;            // optional ISO
  config: any;                    // content-free knobs (margins, stamp box, min font, or NIL modules, etc.)
  provider_kid: string;           // key id for signature
  sig: string;                    // base64 signature over canonical payload (without sig)
};

export type Provider = {
  id: string;                     // "county/estate/official", "nil/edu/providerA", etc.
  domains: RuleDomain[];
  baseUrl: string;                // e.g., https://rules.example.gov/api
  publicKeys: Record<string, string>; // { kid -> PEM/JSON key }
  fetch: (args:{domain:RuleDomain; county_token:string}) => Promise<RulePayload>;
  verify: (r:RulePayload) => Promise<boolean>;
};

// Canonicalizer for signatures (sort keys; omit sig)
export function canonicalizeForSig(obj:any){
  function walk(x:any):any{
    if (Array.isArray(x)) return x.map(walk);
    if (x && typeof x==="object"){
      const out:any = {};
      Object.keys(x).sort().forEach(k=>{
        if (k==="sig") return; // omit signature field
        out[k] = walk(x[k]);
      });
      return out;
    }
    return x;
  }
  return JSON.stringify(walk(obj));
}

// Example provider stubs (wire to your backend later)
export const Providers: Provider[] = [
  {
    id: "county/estate/stub",
    domains: ["estate"],
    baseUrl: "https://stub.local/estate",
    publicKeys: { "kid_1": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----" },
    async fetch({domain,county_token}){
      // simulate a payload update (e.g., raise top margin to 3.0 if smaller)
      const now = new Date();
      const issued = now.toISOString();
      const cfg = {
        pageSize: "Letter", minFontPt: 10,
        marginsIn: { top: 3.0, left: 1.0, right: 1.0, bottom: 1.0 },
        stampBoxIn: { x: 6.25, y: 0.5, w: 2.25, h: 3.0 },
        requires: { APN:true, preparer:true, returnAddress:true },
        eRecording: true, provider: "simplifile"
      };
      const payload: RulePayload = {
        domain, county_token, policy_version: "ER-2025.09",
        issued_at: issued, valid_from: issued,
        config: cfg, provider_kid: "kid_1", sig: "SIGNATURE_PLACEHOLDER"
      };
      return payload;
    },
    async verify(r){ /* real signature verification later */ return true; }
  },
  {
    id: "nil/edu/stub",
    domains: ["nil"],
    baseUrl: "https://stub.local/nil",
    publicKeys: { "kid_n_1": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----" },
    async fetch({domain,county_token}){
      const issued = new Date().toISOString();
      const cfg = { edu_modules:["core","conflicts"], ttl_days:365, disclosure_takedown:"auto" };
      return { domain, county_token, policy_version: "NL-2025.09", issued_at: issued, valid_from: issued, config: cfg, provider_kid:"kid_n_1", sig:"SIGNATURE" };
    },
    async verify(){ return true; }
  }
];

export async function getProviderFor(domain:RuleDomain): Promise<Provider|null>{
  return Providers.find(p => p.domains.includes(domain)) || null;
}