import { runRuleSyncOnce } from "./runner";
import { recordReceipt } from "@/features/receipts/store";

// persisted config
const KEY_CFG = "rulesync.scheduler.cfg";
// cfg: { enabled:boolean, day:number(0-6), hour:number(0-23), minute:number(0-59), nextRunISO:string }

type Cfg = { enabled:boolean; day:number; hour:number; minute:number; nextRunISO?:string };

function loadCfg(): Cfg {
  try { return JSON.parse(localStorage.getItem(KEY_CFG)||""); } catch { return { enabled:false, day:1, hour:3, minute:0 }; }
}
function saveCfg(c: Cfg){ localStorage.setItem(KEY_CFG, JSON.stringify(c)); }

function computeNextRunISO(day:number, hour:number, minute:number){
  const now = new Date();
  const target = new Date(now);
  // 0=Sun..6=Sat
  const deltaDays = ( (day - now.getDay()) + 7 ) % 7 || 7; // next occurrence (skip same-day immediate run)
  target.setDate(now.getDate() + deltaDays);
  target.setHours(hour, minute, 0, 0);
  return target.toISOString();
}

let timer: any = null;

export function getSchedulerCfg(){ return loadCfg(); }

export function enableWeekly(day:number, hour:number, minute:number){
  const nextRunISO = computeNextRunISO(day, hour, minute);
  const cfg: Cfg = { enabled:true, day, hour, minute, nextRunISO };
  saveCfg(cfg);
  startHeartbeat();
  return cfg;
}

export function disableWeekly(){
  const cfg = { ...loadCfg(), enabled:false, nextRunISO: undefined };
  saveCfg(cfg);
  if (timer) { clearInterval(timer); timer = null; }
  return cfg;
}

export function startHeartbeat(){
  if (timer) return;
  timer = setInterval(async ()=>{
    const cfg = loadCfg();
    if (!cfg.enabled || !cfg.nextRunISO) return;
    const now = Date.now();
    const due = Date.parse(cfg.nextRunISO);
    if (now >= due){
      // run rulesync (dev vs prod auto-detected at runtime)
      const env = (import.meta.env.MODE === "production") ? "prod":"dev";
      const res = await runRuleSyncOnce(env as any);
      const ts = new Date().toISOString();

      // Write a content-free Decision-RDS "rulesync.weekly.run"
      await recordReceipt({
        receipt_id: `rds_dec_rulesync_weekly_${ts}`,
        type: "Decision-RDS",
        ts,
        policy_version: "-",           // or join domain versions if you expose them
        inputs_hash: "sha256:rulesync.weekly.run",
        action: "rulesync.weekly.run",
        reasons: [`applied:${res.applied.length}`, `changes:${res.diffs_total}`]
      });

      // Append a one-line release note (content-free)
      try {
        const prev = localStorage.getItem("lastReleaseSummary") || "";
        const line = `- RuleSync (weekly): applied ${res.applied.length}, total changes ${res.diffs_total} (${ts})`;
        localStorage.setItem("lastReleaseSummary", prev ? (prev + "\n" + line) : ("# Release Notes\n" + line));
      } catch {}

      // schedule next run
      const nextISO = computeNextRunISO(cfg.day, cfg.hour, cfg.minute);
      saveCfg({ ...cfg, nextRunISO: nextISO });
    }
  }, 5 * 60 * 1000); // check every 5 minutes
}