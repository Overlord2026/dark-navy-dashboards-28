import { RuleDomain } from "./providers";

export type RuleSubscription = {
  id: string;                              // "estate:CA/Los_Angeles"
  domain: RuleDomain;
  county_token: string;
  autoApply: boolean;                      // if true, apply verified updates automatically
  anchorAfterApply: boolean;               // if true, call anchor after successful apply
  lastVersion?: string;                    // last applied policy_version
  lastUpdated?: string;                    // ISO
};

const KEY_RULES = "rulesync.current";      // { "<domain>:<county>" : {policy_version, config, issued_at, ...} }
const KEY_SUBS  = "rulesync.subs";         // [ RuleSubscription, ... ]

function loadJSON<T>(k:string, fallback:T):T { try{ return JSON.parse(localStorage.getItem(k) || "") as T; }catch{ return fallback; } }
function saveJSON(k:string, v:any){ localStorage.setItem(k, JSON.stringify(v)); }

export function getCurrentRule(key:string){ const all = loadJSON<Record<string,any>>(KEY_RULES,{}); return all[key] || null; }
export function setCurrentRule(key:string, rule:any){ const all = loadJSON<Record<string,any>>(KEY_RULES,{}); all[key] = rule; saveJSON(KEY_RULES, all); return all[key]; }

export function listSubscriptions(): RuleSubscription[]{ return loadJSON<RuleSubscription[]>(KEY_SUBS,[]); }
export function upsertSubscription(s:RuleSubscription){ const all = listSubscriptions(); const i = all.findIndex(x=>x.id===s.id); if (i>=0) all[i]=s; else all.push(s); saveJSON(KEY_SUBS, all); return s; }
export function removeSubscription(id:string){ const next = listSubscriptions().filter(s=>s.id!==id); saveJSON(KEY_SUBS, next); return next; }