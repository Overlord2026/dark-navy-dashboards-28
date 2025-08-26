import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import crypto from "crypto";
// @ts-ignore PDFKit default import
import PDFDocument from "pdfkit";
import cors from "cors";

const app  = express();
const PORT = process.env.PORT || 4000;

// Allow browser fetch from your app origin(s) in dev
app.use(cors({ origin: true, credentials: false }));
app.use(bodyParser.json({ limit: "1mb" }));

// Ensure vault dir
const VAULT_DIR = path.resolve(process.cwd(), "data", "vault");
fs.mkdirSync(VAULT_DIR, { recursive: true });

// Serve vault files
app.use("/vault", express.static(VAULT_DIR, { fallthrough: false, dotfiles: "deny" }));

function sha256(buf: Buffer) { return "sha256:" + crypto.createHash("sha256").update(buf).digest("hex"); }
function savePdf(buf: Buffer) {
  const hash = sha256(buf).replace("sha256:", "");
  const dest = path.join(VAULT_DIR, `${hash}.pdf`);
  fs.writeFileSync(dest, buf);
  return { hash, url: `/vault/${hash}.pdf` };
}

function renderPdf(title: string, lines: string[]): Buffer {
  const doc = new PDFDocument({ size: "LETTER", margins: { top: 72, left: 72, right: 72, bottom: 72 } });
  const chunks: Buffer[] = [];
  doc.on("data", (d: Buffer) => chunks.push(d));
  doc.font("Times-Roman").fontSize(14).text(title, { underline: false });
  doc.moveDown(0.5);
  doc.fontSize(10);
  lines.forEach(l => doc.text(l));
  doc.end();
  return Buffer.concat(chunks);
}

// POST /api/k401/pdf/compliance
// Body: { policy_version?: string, brand?: { title?: string } }
app.post("/api/k401/pdf/compliance", (req, res) => {
  try {
    const pv   = (req.body?.policy_version as string) || "K-DEV";
    const head = (req.body?.brand?.title as string) || "Boutique Family Office — 401(k) Compliance Pack";

    // B/W text PDFs — content-free, no PII
    const checklist = renderPdf(
      `${head}: Compliance Checklist (Policy ${pv})`,
      [
        "This checklist is a content-free, black-and-white rendering for pack validation.",
        "Items:",
        "• PTE 2020-02 fee and service comparison normalized",
        "• Advice Summary (content-free pointer)",
        "• WORM/Vault receipts present",
        "• Policy version recorded",
        "",
        "Note: replace with branded PDF template via server route when ready."
      ]
    );
    const summary = renderPdf(
      `${head}: PTE Summary (Policy ${pv})`,
      [
        "Content-free summary stub.",
        "Factors considered:",
        "• Plan admin bps, share class costs, advisory fees (normalized)",
        "• Services map and rationale pointers",
        "",
        "No PII/PHI stored."
      ]
    );

    const saveA = savePdf(checklist);
    const saveB = savePdf(summary);
    return res.json({
      ok: true,
      policy_version: pv,
      artifacts: [
        { kind: "PDF_CHECKLIST", hash: `sha256:${saveA.hash}`, url: saveA.url },
        { kind: "PDF_PTE_SUMMARY", hash: `sha256:${saveB.hash}`, url: saveB.url }
      ]
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

// POST /api/k401/pdf/broker
// Body: { policy_version?: string, brand?: { title?: string } }
app.post("/api/k401/pdf/broker", (req, res) => {
  try {
    const pv   = (req.body?.policy_version as string) || "K-DEV";
    const head = (req.body?.brand?.title as string) || "Boutique Family Office — 401(k) Broker Demo";

    const demo = renderPdf(
      `${head}: Broker Demo Script (Policy ${pv})`,
      [
        "30-minute broker demo script — content-free stub:",
        "• PTE compliance summary (high level)",
        "• %ADV controls & advice-only distribution",
        "• Anchored receipts and PHI/PII-free replay",
        "• Q&A",
        "",
        "Swap with your branded template later."
      ]
    );
    const save = savePdf(demo);
    return res.json({
      ok: true,
      policy_version: pv,
      artifacts: [{ kind: "PDF_DEMO_SCRIPT", hash: `sha256:${save.hash}`, url: save.url }]
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`[k401 pdf server] listening on http://localhost:${PORT}`);
});