import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getDocument } from "https://esm.sh/pdfjs-dist@4.4.168/legacy/build/pdf.mjs"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RAImport {
  id: string;
  run_id: string;
  raw_text: string;
  sha256_hash: string;
  parsed_data: any;
  created_at: string;
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

    // Parse PDF using pdfjs
    const loadingTask = getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item: any) => item.str)
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    console.log('Extracted PDF text length:', fullText.length);

    // Parse retirement analysis data from text
    const parsedData = parseRetirementAnalysis(fullText);
    
    // Generate SHA-256 hash
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(fullText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const runId = crypto.randomUUID();

    // Store in database
    const { error } = await supabase
      .from('imports_ra')
      .insert({
        run_id: runId,
        raw_text: fullText,
        sha256_hash: sha256Hash,
        parsed_data: parsedData
      });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

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
      JSON.stringify({ error: error.message }),
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

function parseRetirementAnalysis(text: string) {
  // Extract client information
  const clientMatch = text.match(/(?:Client|Name):\s*([A-Za-z]+)\s+([A-Za-z]+)/i);
  const ageMatch = text.match(/(?:Age|Current Age):\s*(\d+)/i);
  const spouseMatch = text.match(/(?:Spouse|Partner):\s*([A-Za-z]+)\s+([A-Za-z]+)/i);
  const spouseAgeMatch = text.match(/(?:Spouse Age|Partner Age):\s*(\d+)/i);

  // Extract Social Security information
  const ssStartMatch = text.match(/(?:Social Security|SS).*?(?:Start|Age):\s*(\d+)/i);
  const ssSpouseStartMatch = text.match(/(?:Spouse|Partner).*?(?:Social Security|SS).*?(?:Start|Age):\s*(\d+)/i);
  const colaMatch = text.match(/(?:COLA|Cost of Living).*?(\d+(?:\.\d+)?)\s*%/i);

  // Extract assets - look for common patterns
  const assets = [];
  const assetPatterns = [
    /401\(k\).*?\$?([\d,]+)/gi,
    /IRA.*?\$?([\d,]+)/gi,
    /Roth.*?\$?([\d,]+)/gi,
    /Brokerage.*?\$?([\d,]+)/gi,
    /Taxable.*?\$?([\d,]+)/gi,
    /Cash.*?\$?([\d,]+)/gi
  ];

  assetPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const balance = parseFloat(match[1].replace(/,/g, ''));
      if (balance > 0) {
        let taxType = "taxable";
        let name = match[0].split('$')[0].trim();
        
        if (name.toLowerCase().includes('401') || name.toLowerCase().includes('403')) {
          taxType = "qualified";
        } else if (name.toLowerCase().includes('roth')) {
          taxType = "roth";
        } else if (name.toLowerCase().includes('ira') && !name.toLowerCase().includes('roth')) {
          taxType = "qualified";
        }

        assets.push({
          name,
          balance,
          taxType,
          produces1099: taxType === "taxable"
        });
      }
    }
  });

  // Extract return assumptions
  const inflationMatch = text.match(/(?:Inflation|CPI).*?(\d+(?:\.\d+)?)\s*%/i);
  const returnsMatch = text.match(/(?:Return|Growth).*?(\d+(?:\.\d+)?)\s*%/i);

  // Extract reserve amount
  const reserveMatch = text.match(/(?:Reserve|Emergency|Cash Reserve).*?\$?([\d,]+)/i);

  return {
    profile: {
      client: {
        firstName: clientMatch?.[1] || "John",
        lastName: clientMatch?.[2] || "Doe",
        age: ageMatch ? parseInt(ageMatch[1]) : 65
      },
      spouse: spouseMatch ? {
        firstName: spouseMatch[1],
        lastName: spouseMatch[2],
        age: spouseAgeMatch ? parseInt(spouseAgeMatch[1]) : undefined
      } : {},
      filingStatus: spouseMatch ? "married_joint" : "single"
    },
    socialSecurity: {
      clientStartAge: ssStartMatch ? parseInt(ssStartMatch[1]) : 67,
      spouseStartAge: ssSpouseStartMatch ? parseInt(ssSpouseStartMatch[1]) : undefined,
      colaPct: colaMatch ? parseFloat(colaMatch[1]) : 2.0
    },
    assets: assets.length > 0 ? assets : [{
      name: "Default Portfolio",
      balance: 1000000,
      taxType: "qualified",
      produces1099: false
    }],
    assumptions: {
      inflation: inflationMatch ? parseFloat(inflationMatch[1]) / 100 : 0.025,
      returns: {
        incomeNow: returnsMatch ? parseFloat(returnsMatch[1]) / 100 : 0.04,
        incomeLater: returnsMatch ? parseFloat(returnsMatch[1]) / 100 : 0.06,
        growth: returnsMatch ? parseFloat(returnsMatch[1]) / 100 : 0.08,
        legacy: returnsMatch ? parseFloat(returnsMatch[1]) / 100 : 0.07
      },
      reserveAmount: reserveMatch ? parseFloat(reserveMatch[1].replace(/,/g, '')) : 0
    },
    liabilities: [],
    stress: {},
    taxYear: new Date().getFullYear()
  };
}