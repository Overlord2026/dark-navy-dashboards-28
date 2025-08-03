import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UploadChunk {
  fileId: string
  chunkIndex: number
  totalChunks: number
  data: string // base64 encoded
  metadata?: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const body = await req.json()
    const { action, ...params } = body

    switch (action) {
      case 'initiate_upload':
        return await initiateUpload(supabase, user.id, params)
      case 'upload_chunk':
        return await uploadChunk(supabase, user.id, params)
      case 'complete_upload':
        return await completeUpload(supabase, user.id, params)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function initiateUpload(supabase: any, userId: string, params: any) {
  const { vaultId, fileName, fileSize, contentType, totalChunks } = params

  // Check user permissions
  const { data: member } = await supabase
    .from('vault_members')
    .select('can_upload')
    .eq('vault_id', vaultId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (!member?.can_upload) {
    throw new Error('No upload permission for this vault')
  }

  // Generate encryption key
  const encryptionKey = crypto.getRandomValues(new Uint8Array(32))
  const encryptionKeyId = crypto.randomUUID()

  // Store encryption key securely (in production, use HSM or Key Management Service)
  const encryptionKeyBase64 = btoa(String.fromCharCode(...encryptionKey))

  // Create file record
  const { data: fileRecord, error } = await supabase
    .from('vault_files')
    .insert({
      vault_id: vaultId,
      uploaded_by: userId,
      file_name: fileName,
      file_size: fileSize,
      content_type: contentType,
      file_path: `${vaultId}/${encryptionKeyId}/${fileName}`,
      encryption_key_id: encryptionKeyId,
      chunk_count: totalChunks,
      upload_status: 'pending',
      metadata: { encryption_key: encryptionKeyBase64 } // Store temporarily for upload
    })
    .select()
    .single()

  if (error) throw error

  // Log activity
  await supabase.rpc('log_vault_activity', {
    p_vault_id: vaultId,
    p_action_type: 'upload_initiated',
    p_resource_type: 'file',
    p_resource_id: fileRecord.id,
    p_details: { file_name: fileName, file_size: fileSize }
  })

  return new Response(
    JSON.stringify({
      fileId: fileRecord.id,
      encryptionKeyId,
      uploadPath: fileRecord.file_path
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function uploadChunk(supabase: any, userId: string, params: UploadChunk) {
  const { fileId, chunkIndex, totalChunks, data } = params

  // Get file record
  const { data: fileRecord, error: fileError } = await supabase
    .from('vault_files')
    .select('*')
    .eq('id', fileId)
    .eq('uploaded_by', userId)
    .single()

  if (fileError || !fileRecord) {
    throw new Error('File not found or unauthorized')
  }

  // Decrypt the base64 data
  const chunkData = Uint8Array.from(atob(data), c => c.charCodeAt(0))

  // Encrypt the chunk (AES-256-GCM)
  const encryptionKey = Uint8Array.from(atob(fileRecord.metadata.encryption_key), c => c.charCodeAt(0))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  
  const key = await crypto.subtle.importKey(
    'raw',
    encryptionKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    chunkData
  )

  // Combine IV and encrypted data
  const encryptedChunk = new Uint8Array(iv.length + encryptedData.byteLength)
  encryptedChunk.set(iv)
  encryptedChunk.set(new Uint8Array(encryptedData), iv.length)

  // Upload to storage
  const chunkPath = `${fileRecord.file_path}.chunk.${chunkIndex}`
  const { error: uploadError } = await supabase.storage
    .from('family-vault')
    .upload(chunkPath, encryptedChunk, {
      contentType: 'application/octet-stream',
      upsert: true
    })

  if (uploadError) throw uploadError

  // Update upload status
  if (chunkIndex === totalChunks - 1) {
    await supabase
      .from('vault_files')
      .update({ upload_status: 'uploading' })
      .eq('id', fileId)
  }

  return new Response(
    JSON.stringify({ success: true, chunkIndex }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function completeUpload(supabase: any, userId: string, params: any) {
  const { fileId } = params

  const { data: fileRecord, error: fileError } = await supabase
    .from('vault_files')
    .select('*')
    .eq('id', fileId)
    .eq('uploaded_by', userId)
    .single()

  if (fileError || !fileRecord) {
    throw new Error('File not found or unauthorized')
  }

  // Mark upload as completed and remove temporary encryption key
  const { error: updateError } = await supabase
    .from('vault_files')
    .update({
      upload_status: 'completed',
      metadata: {}, // Clear temporary encryption key
      updated_at: new Date().toISOString()
    })
    .eq('id', fileId)

  if (updateError) throw updateError

  // Log completion
  await supabase.rpc('log_vault_activity', {
    p_vault_id: fileRecord.vault_id,
    p_action_type: 'upload_completed',
    p_resource_type: 'file',
    p_resource_id: fileId,
    p_details: { file_name: fileRecord.file_name }
  })

  return new Response(
    JSON.stringify({ success: true, fileId }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}