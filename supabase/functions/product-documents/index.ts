import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const productId = url.searchParams.get('product_id');
      const documentType = url.searchParams.get('document_type');

      let query = supabaseClient
        .from('product_documents')
        .select('*')
        .order('version', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }
      if (documentType) {
        query = query.eq('document_type', documentType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ documents: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const {
        product_id,
        document_type,
        file_name,
        file_path,
        file_size,
        mime_type,
        checksum,
        version,
        is_current = true
      } = body;

      // Validate required fields
      if (!product_id || !document_type || !file_name || !file_path) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: product_id, document_type, file_name, file_path' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If this is marked as current, mark all other versions as not current
      if (is_current) {
        await supabaseClient
          .from('product_documents')
          .update({ is_current: false })
          .eq('product_id', product_id)
          .eq('document_type', document_type);
      }

      // Get the next version number
      const { data: existingDocs } = await supabaseClient
        .from('product_documents')
        .select('version')
        .eq('product_id', product_id)
        .eq('document_type', document_type)
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = version || (existingDocs && existingDocs.length > 0 ? existingDocs[0].version + 1 : 1);

      const { data, error } = await supabaseClient
        .from('product_documents')
        .insert({
          product_id,
          document_type,
          file_name,
          file_path,
          file_size,
          mime_type,
          checksum,
          version: nextVersion,
          is_current
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving document:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ document: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'PUT') {
      const body = await req.json();
      const { id, ...updateFields } = body;

      if (!id) {
        return new Response(JSON.stringify({ error: 'Document ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabaseClient
        .from('product_documents')
        .update({
          ...updateFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating document:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ document: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in product-documents function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});