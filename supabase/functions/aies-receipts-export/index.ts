import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/**
 * Build a cover summary PDF for an AIES receipt
 */
async function buildCoverSummaryPDF(receipt: any, signatures: any[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let yPosition = height - 50;
  const leftMargin = 50;
  const lineHeight = 20;
  
  // Title
  page.drawText('AIES Receipt Evidence Bundle', {
    x: leftMargin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.7),
  });
  yPosition -= 40;
  
  // Receipt Information
  page.drawText('Receipt Information', { x: leftMargin, y: yPosition, size: 14, font: boldFont });
  yPosition -= lineHeight;
  
  page.drawText(`Receipt ID: ${receipt.id}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= lineHeight;
  page.drawText(`Organization: ${receipt.org_id}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= lineHeight;
  page.drawText(`Domain: ${receipt.domain}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= lineHeight;
  page.drawText(`Use Case: ${receipt.use_case}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= lineHeight;
  page.drawText(`Close Cycle: ${receipt.close_cycle_id}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= lineHeight;
  page.drawText(`As of Date: ${receipt.as_of_date}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= lineHeight;
  page.drawText(`Materiality: ${receipt.materiality_bucket}`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= 30;
  
  // Hash Information
  page.drawText('Cryptographic Verification', { x: leftMargin, y: yPosition, size: 14, font: boldFont });
  yPosition -= lineHeight;
  page.drawText(`Receipt Hash: ${receipt.receipt_hash.substring(0, 32)}...`, { x: leftMargin, y: yPosition, size: 12, font });
  yPosition -= 30;
  
  // Signatures
  page.drawText('Digital Signatures', { x: leftMargin, y: yPosition, size: 14, font: boldFont });
  yPosition -= lineHeight;
  
  if (signatures.length === 0) {
    page.drawText('No signatures present', { x: leftMargin, y: yPosition, size: 12, font, color: rgb(0.7, 0.3, 0.3) });
  } else {
    signatures.forEach((sig, index) => {
      page.drawText(`Signature ${index + 1}: ${sig.alg}`, { x: leftMargin, y: yPosition, size: 12, font });
      yPosition -= lineHeight;
    });
  }
  
  return await pdfDoc.save();
}

/**
 * Generate the standard ReadMe content
 */
function generateReadMeContent(receiptHash: string): string {
  return `# AIES Evidence Bundle Verification Guide

This bundle contains cryptographic evidence for an AIES receipt.

## Verification Steps

### 1. Verify Receipt Hash
Compute SHA-256 hash of 01_Receipt.json and compare with: ${receiptHash}

### 2. Verify Digital Signatures
Check each signature in 02_Signatures.json against the receipt hash.

### 3. Review Policy Compliance
See 03_Policy.pdf for applicable policies.

Generated: ${new Date().toISOString()}
`;
}

/**
 * Create inputs manifest with PII stripped
 */
function createInputsManifest(receipt: any): string {
  return JSON.stringify({
    inputs_hash: receipt.receipt_hash,
    data_types: ['object', 'string', 'number'],
    field_count: Object.keys(receipt.canonical_receipt).length,
    has_pii: false,
    generated_at: new Date().toISOString(),
    note: "Original inputs excluded for privacy. Hash provided for verification."
  }, null, 2);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { receipt_id } = body;

    if (!receipt_id) {
      return new Response(
        JSON.stringify({ error: 'receipt_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user's auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exporting receipt:', receipt_id);

    // Fetch receipt and signatures
    const { data: receipt, error: receiptError } = await supabase
      .from('aies_receipts')
      .select('*')
      .eq('id', receipt_id)
      .single();

    if (receiptError || !receipt) {
      return new Response(
        JSON.stringify({ error: 'Receipt not found', details: receiptError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: signatures, error: signaturesError } = await supabase
      .from('aies_receipt_signatures')
      .select('*')
      .eq('receipt_id', receipt_id)
      .order('created_at', { ascending: true });

    if (signaturesError) {
      console.error('Failed to fetch signatures:', signaturesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch signatures', details: signaturesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate bundle files
    const coverPdf = await buildCoverSummaryPDF(receipt, signatures || []);
    const receiptJson = JSON.stringify(receipt.canonical_receipt, null, 2);
    const signaturesJson = JSON.stringify(signatures || [], null, 2);
    const inputsManifestJson = createInputsManifest(receipt);
    const readmeMd = generateReadMeContent(receipt.receipt_hash);

    // For policy PDF, check if URL is provided
    let policyPdf: Uint8Array | null = null;
    const policyUrl = Deno.env.get('POLICY_PDF_URL');
    
    if (policyUrl && policyUrl !== '') {
      try {
        const policyResponse = await fetch(policyUrl);
        if (policyResponse.ok) {
          const policyArrayBuffer = await policyResponse.arrayBuffer();
          policyPdf = new Uint8Array(policyArrayBuffer);
        }
      } catch (error) {
        console.warn('Failed to fetch policy PDF:', error);
      }
    }

    // If no policy PDF available, create placeholder
    if (!policyPdf) {
      const placeholderDoc = await PDFDocument.create();
      const page = placeholderDoc.addPage();
      const font = await placeholderDoc.embedFont(StandardFonts.Helvetica);
      
      page.drawText('Policy Document Placeholder', {
        x: 50,
        y: 750,
        size: 16,
        font,
      });
      
      page.drawText('No policy document URL configured.', {
        x: 50,
        y: 700,
        size: 12,
        font,
      });
      
      policyPdf = await placeholderDoc.save();
    }

    // Create a simple bundle structure (JSON format for now)
    const bundle = {
      '00_Cover_Summary.pdf': Array.from(coverPdf),
      '01_Receipt.json': receiptJson,
      '02_Signatures.json': signaturesJson,
      '03_Policy.pdf': Array.from(policyPdf),
      '04_Challenger_Report.csv': 'No challenger data available\n',
      '05_Inputs_Manifest.json': inputsManifestJson,
      '06_Anchor.txt': 'No anchor information available\n',
      '07_ReadMe.md': readmeMd
    };

    const bundleContent = JSON.stringify(bundle, null, 2);
    const bundleBytes = new TextEncoder().encode(bundleContent);

    // Upload to Supabase Storage
    const fileName = `${receipt.close_cycle_id}/${receipt_id}.zip`;
    const filePath = `${receipt.org_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('aies-evidence')
      .upload(filePath, bundleBytes, {
        contentType: 'application/zip',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload bundle', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed URL for download
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('aies-evidence')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate download URL', details: urlError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        download_url: signedUrlData.signedUrl,
        file_path: filePath,
        expires_at: new Date(Date.now() + 3600000).toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Export receipt error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});