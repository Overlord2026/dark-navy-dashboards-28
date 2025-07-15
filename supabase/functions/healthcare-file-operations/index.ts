import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FileOperationRequest {
  operation: 'upload' | 'download' | 'delete' | 'list' | 'get_signed_url';
  bucket: string;
  filePath?: string;
  folder?: string;
  documentId?: string;
}

interface DocumentMetadata {
  name: string;
  description?: string;
  category: string;
  type: string;
  size?: number;
  contentType?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user's JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the token and get user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const requestData: FileOperationRequest = await req.json()
    console.log('File operation request:', { operation: requestData.operation, userId: user.id })

    switch (requestData.operation) {
      case 'list':
        return await handleListFiles(supabase, user.id, requestData, corsHeaders)
      
      case 'get_signed_url':
        return await handleGetSignedUrl(supabase, user.id, requestData, corsHeaders)
      
      case 'delete':
        return await handleDeleteFile(supabase, user.id, requestData, corsHeaders)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported operation' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

  } catch (error) {
    console.error('Healthcare file operation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleListFiles(
  supabase: any, 
  userId: string, 
  request: FileOperationRequest, 
  corsHeaders: Record<string, string>
) {
  try {
    const folderPath = request.folder ? `${userId}/${request.folder}` : userId
    
    const { data: files, error } = await supabase.storage
      .from(request.bucket)
      .list(folderPath, {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Storage list error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to list files' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ files: files || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('List files error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to list files' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleGetSignedUrl(
  supabase: any, 
  userId: string, 
  request: FileOperationRequest, 
  corsHeaders: Record<string, string>
) {
  try {
    if (!request.filePath) {
      return new Response(
        JSON.stringify({ error: 'File path required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify user owns this file (file path should start with user ID)
    if (!request.filePath.startsWith(userId)) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data, error } = await supabase.storage
      .from(request.bucket)
      .createSignedUrl(request.filePath, 3600) // 1 hour expiry

    if (error) {
      console.error('Signed URL error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ signedUrl: data.signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Signed URL error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create signed URL' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleDeleteFile(
  supabase: any, 
  userId: string, 
  request: FileOperationRequest, 
  corsHeaders: Record<string, string>
) {
  try {
    if (!request.filePath) {
      return new Response(
        JSON.stringify({ error: 'File path required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify user owns this file
    if (!request.filePath.startsWith(userId)) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(request.bucket)
      .remove([request.filePath])

    if (storageError) {
      console.error('Storage delete error:', storageError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete file from storage' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If documentId provided, also delete from database
    if (request.documentId) {
      const { error: dbError } = await supabase
        .from('healthcare_documents')
        .delete()
        .eq('id', request.documentId)
        .eq('user_id', userId)

      if (dbError) {
        console.error('Database delete error:', dbError)
        // File already deleted from storage, so just log the error
        console.warn('File deleted from storage but database record remains')
      }
    }

    console.log('File deleted successfully:', request.filePath)
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Delete file error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete file' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}