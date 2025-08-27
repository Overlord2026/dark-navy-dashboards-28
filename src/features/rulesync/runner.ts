import { getProviderFor } from "./providers";
import { listSubscriptions, getCurrentRule, setCurrentRule, RuleSubscription } from "./store";
import { canonicalDiff } from "./diff";
import { recordReceipt } from "@/features/receipts/store";
import { anchorNow } from "@/features/anchor/anchorNow";

function iso(){ return new Date().toISOString(); }
function keyOf(s:RuleSubscription){ return `${s.domain}:${s.county_token}`; }

export async function runRuleSyncOnce(env:"dev"|"stage"|"prod"){
  const subs = listSubscriptions();
  const since = iso();
  const applied: string[] = [];
  const diffs: number[] = [];

  for (const s of subs){
    const key = keyOf(s);
    const provider = await getProviderFor(s.domain);
    if (!provider) continue;

    // RuleFetch-RDS
    await recordReceipt({ receipt_id:`rds_rulefetch_${iso()}`, type:"RuleFetch-RDS", ts:iso(), policy_version:"-", inputs_hash:"sha256:rule_fetch", reasons:[`domain:${s.domain}`,`county:${s.county_token}`,`provider:${provider.id}`] });

    const payload = await provider.fetch({ domain:s.domain, county_token:s.county_token });
    const okSig = await provider.verify(payload);
    // ProviderSignature-RDS
    await recordReceipt({ receipt_id:`rds_provider_sig_${iso()}`, type:"ProviderSignature-RDS", ts:iso(), policy_version:payload.policy_version, inputs_hash:"sha256:provider_sig", reasons:[`kid:${payload.provider_kid}`, `ok:${okSig}`] });

    if (!okSig) continue;

    const current = getCurrentRule(key);
    const changes = canonicalDiff(current?.config || {}, payload.config || {});
    const changeCount = Object.keys(changes).length;
    diffs.push(changeCount);

    // RuleVersion-RDS (proposed)
    await recordReceipt({ receipt_id:`rds_rulever_${iso()}`, type:"RuleVersion-RDS", ts:iso(), policy_version:payload.policy_version, inputs_hash:"sha256:rule_version", reasons:[`domain:${payload.domain}`,`county:${payload.county_token}`,`issued:${payload.issued_at}`] });

    // Apply straight away if autoApply; otherwise leave for admin preview
    if (s.autoApply && changeCount>0){
      setCurrentRule(key, payload);
      // RuleDiff-RDS
      await recordReceipt({ receipt_id:`rds_rulediff_${iso()}`, type:"RuleDiff-RDS", ts:iso(), policy_version:payload.policy_version, inputs_hash:"sha256:diff", reasons:[`changes:${changeCount}`], diff_keys:Object.keys(changes) });
      // RuleUpdate-RDS
      await recordReceipt({ receipt_id:`rds_ruleupdate_${iso()}`, type:"RuleUpdate-RDS", ts:iso(), policy_version:payload.policy_version, inputs_hash:"sha256:rule_update", reasons:[`applied:true`,`domain:${s.domain}`,`county:${s.county_token}`] });
      applied.push(key);
    }
  }

  if (applied.length && subs.find(s=>s.anchorAfterApply)){
    await anchorNow({ env, include_types: ["RuleFetch-RDS", "ProviderSignature-RDS", "RuleVersion-RDS", "RuleDiff-RDS", "RuleUpdate-RDS"] });
  }
  return { applied, diffs_total: diffs.reduce((a,b)=>a+b,0) };
}