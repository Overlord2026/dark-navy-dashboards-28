import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getDocument } from "https://esm.sh/pdfjs-dist@4.4.168/legacy/build/pdf.mjs"
import { parseRaTextToSwag } from "./parser.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function extractTextFromPdf(pdfData: Uint8Array): Promise<string> {
  const pdf = await getDocument({ data: pdfData }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item: any) => item.str)
      .map((item: any) => item.str)
      .join(" ");
    fullText += "\n" + pageText;
  }
  return fullText;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { pdfBase64, pdfUrl } = await req.json();
    
    let pdfData: Uint8Array;
    
    if (pdfBase64) {
      // Decode base64 PDF
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      pdfData = new Uint8Array(atob(base64Data).split('').map(c => c.charCodeAt(0)));
    } else if (pdfUrl) {
      // Fetch PDF from URL
      const response = await fetch(pdfUrl);
      pdfData = new Uint8Array(await response.arrayBuffer());
    } else {
      throw new Error('Either pdfBase64 or pdfUrl must be provided');
    }

    console.log('Processing PDF, size:', pdfData.length, 'bytes');

    // Extract text from PDF
    const fullText = await extractTextFromPdf(pdfData);
    console.log('Extracted text length:', fullText.length);

    // Parse using the dedicated parser
    const parsedData = parseRaTextToSwag(fullText);
    console.log('Parsed data:', JSON.stringify(parsedData, null, 2));
    
    // Generate SHA-256 hash
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(fullText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const runId = crypto.randomUUID();

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    const { data: userData, error: userError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    );

    // Store in database
    const { error } = await supabase
      .from('imports_ra')
      .insert({
        run_id: runId,
        raw_text: fullText,
        sha256_hash: sha256Hash,
        parsed_data: parsedData,
        user_id: userData?.user?.id
      });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully stored RA import with runId:', runId);

    return new Response(
      JSON.stringify({
        runId,
        inputs: parsedData,
        sha256Hash
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});