// Pure text → JSON parser (no Deno APIs), so Jest/Vitest can import.
import { SwagRetirementAnalysisInputSchema } from "../_shared/swag-retirement-types.ts";

const money = (s: string) => Number(s.replace(/[,$]/g, ""));
const pct = (s: string) => Number(s.replace("%",""));

export function parseRaTextToSwag(text: string) {
  const out: any = { };

  // Names & ages
  const mClient = text.match(/Primary Client:\s+([A-Za-z]+)\s+([A-Za-z]+)\s+Age:\s+(\d+)/);
  if (mClient) out.profile = { client: { firstName: mClient[1], lastName: mClient[2], age: Number(mClient[3]) } };

  const mSpouse = text.match(/Spouse:\s+(?:— \(None\)|([A-Za-z]+)\s+([A-Za-z]+)\s+Age:\s+(\d+))/);
  if (mSpouse && mSpouse[1]) {
    out.profile = { ...(out.profile||{}), spouse: { firstName: mSpouse[1], lastName: mSpouse[2], age: Number(mSpouse[3]) } };
  }

  // Filing status
  if (/Married Filing Joint/i.test(text)) out.profile = { ...(out.profile||{}), filingStatus: "married_joint" };
  else if (/Single/i.test(text)) out.profile = { ...(out.profile||{}), filingStatus: "single" };

  // Assumptions
  const infl = text.match(/Inflation:\s+([\d.]+)%/i);
  const reserve = text.match(/Reserve Amount:\s+\$([\d,]+)/i);
  const rtn = text.match(/Income Now:\s*([\d.]+)%\s+Income Later:\s*([\d.]+)%\s+Growth:\s*([\d.]+)%\s+Legacy:\s*([\d.]+)%/i);
  out.assumptions = {
    inflation: infl ? Number(infl[1]) : undefined,
    returns: rtn ? { incomeNow: +rtn[1], incomeLater: +rtn[2], growth: +rtn[3], legacy: +rtn[4] } : undefined,
    reserveAmount: reserve ? money(reserve[1]) : undefined
  };

  // Social Security
  const ssClient = text.match(/Client Start Age:\s*(\d+)/i);
  const ssSpouse = text.match(/Spouse Start Age:\s*(\d+)/i);
  const cola = text.match(/COLA:\s*([\d.]+)%/i);
  out.socialSecurity = {
    clientStartAge: ssClient ? Number(ssClient[1]) : undefined,
    spouseStartAge: ssSpouse ? Number(ssSpouse[1]) : undefined,
    colaPct: cola ? Number(cola[1]) : undefined
  };

  // Assets (simple line parser)
  const assets: any[] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^(.+?)\s+\$([\d,]+)\s+(Non-Qualified|Qualified|Roth)/i);
    if (m) {
      const name = m[1].replace(/\s+\(1099 Heavy.*\)/i, "").trim();
      const produces1099 = /\(1099 Heavy/i.test(m[1]);
      const taxMap: any = { "Non-Qualified": "taxable", "Qualified": "qualified", "Roth": "roth" };
      assets.push({ name, balance: money(m[2]), taxType: taxMap[m[3]], produces1099 });
    }
  }
  if (assets.length) out.assets = assets;

  // Liabilities
  const mort = text.match(/Mortgage Balance:\s+\$([\d,]+)\s+Rate:\s+([\d.]+)%/i);
  if (mort) out.liabilities = [{ type: "Mortgage", balance: money(mort[1]), rate: Number(mort[2]) }];

  // Stress (LTC)
  const ltc = text.match(/LTC Event:\s*Start Age\s*(\d+)\s*Duration\s*(\d+)\s*years\s*Monthly Cost\s*\$([\d,]+)/i);
  if (ltc) out.stress = { ltc: { startAge: +ltc[1], years: +ltc[2], monthlyCost: money(ltc[3]) } };

  // Tax year
  const year = text.match(/Report Year:\s*(\d{4})/i);
  if (year) out.taxYear = Number(year[1]);

  // Validate & fill defaults
  return SwagRetirementAnalysisInputSchema.parse(out);
}