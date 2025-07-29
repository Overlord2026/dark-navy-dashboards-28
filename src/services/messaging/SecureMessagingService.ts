import { supabase } from '@/integrations/supabase/client';
import { MessageEncryption, KeyManager } from '@/utils/messageEncryption';
import { 
  MessageThread, 
  SecureMessage, 
  CreateThreadRequest, 
  SendMessageRequest,
  MessageAuditEntry,
  ComplianceSettings
} from '@/types/messaging';

export class SecureMessagingService {
  // Create a new message thread
  static async createThread(request: CreateThreadRequest): Promise<MessageThread> {
    const { data: thread, error: threadError } = await supabase
      .from('message_threads')
      .insert({
        thread_name: request.thread_name,
        thread_type: request.thread_type,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (threadError) throw threadError;

    // Add participants
    const participants = request.participant_ids.map(userId => ({
      thread_id: thread.id,
      user_id: userId,
      role: 'participant' as const
    }));

    // Add creator as participant
    participants.push({
      thread_id: thread.id,
      user_id: thread.created_by,
      role: 'participant' as const
    });

    const { error: participantError } = await supabase
      .from('message_thread_participants')
      .insert(participants);

    if (participantError) throw participantError;

    // Log thread creation
    await this.logMessageAction('created', thread.id, null, {
      thread_type: request.thread_type,
      participant_count: participants.length
    });

    return thread as MessageThread;
  }

  // Get user's message threads
  static async getUserThreads(): Promise<MessageThread[]> {
    const { data, error } = await supabase
      .from('message_threads')
      .select(`
        *,
        participants:message_thread_participants(
          *,
          user_profile:profiles(display_name, email, role)
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as MessageThread[];
  }

  // Send a secure message
  static async sendMessage(request: SendMessageRequest): Promise<SecureMessage> {
    try {
      // Get encryption key for thread
      const key = await KeyManager.getThreadKey(request.thread_id);
      const keyId = KeyManager.generateKeyId();

      // Encrypt message content
      const { encryptedData, hash } = await MessageEncryption.encryptMessage(
        request.content,
        key
      );

      // Store encrypted message
      const { data: message, error } = await supabase
        .from('secure_messages')
        .insert({
          thread_id: request.thread_id,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          message_content: encryptedData,
          message_hash: hash,
          encryption_key_id: keyId,
          message_type: request.message_type || 'text',
          reply_to_id: request.reply_to_id
        })
        .select(`
          *,
          sender_profile:profiles(display_name, email, role)
        `)
        .single();

      if (error) throw error;

      // Log message creation
      await this.logMessageAction('created', request.thread_id, message.id, {
        message_type: message.message_type,
        has_reply: !!request.reply_to_id
      });

      // Update thread timestamp
      await supabase
        .from('message_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', request.thread_id);

      return message as unknown as SecureMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages for a thread
  static async getThreadMessages(threadId: string): Promise<SecureMessage[]> {
    const { data, error } = await supabase
      .from('secure_messages')
      .select(`
        *,
        sender_profile:profiles(display_name, email, role)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Decrypt messages
    const key = await KeyManager.getThreadKey(threadId);
    const decryptedMessages = await Promise.all(
      (data || []).map(async (message) => {
        try {
          // Extract IV from the encrypted data (in production, store separately)
          const decryptedContent = await MessageEncryption.decryptMessage(
            message.message_content,
            'placeholder_iv', // In production, store IV separately
            key
          );

          // Verify integrity
          const isValid = await MessageEncryption.verifyMessageHash(
            decryptedContent,
            message.message_hash
          );

          if (!isValid) {
            console.warn('Message integrity check failed:', message.id);
          }

          return {
            ...message,
            decrypted_content: isValid ? decryptedContent : '[Message integrity compromised]'
          };
        } catch (error) {
          console.error('Error decrypting message:', message.id, error);
          return {
            ...message,
            decrypted_content: '[Failed to decrypt message]'
          };
        }
      })
    );

    // Log message read
    await this.logMessageAction('read', threadId, null, {
      message_count: decryptedMessages.length
    });

    return decryptedMessages as unknown as SecureMessage[];
  }

  // Mark messages as read
  static async markThreadAsRead(threadId: string): Promise<void> {
    const { error } = await supabase
      .from('message_thread_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('thread_id', threadId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
  }

  // Get compliance settings
  static async getComplianceSettings(): Promise<ComplianceSettings | null> {
    const { data, error } = await supabase
      .from('message_compliance_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as ComplianceSettings;
  }

  // Update compliance settings (admin only)
  static async updateComplianceSettings(settings: Partial<ComplianceSettings> & { tenant_id: string }): Promise<void> {
    const { error } = await supabase
      .from('message_compliance_settings')
      .upsert(settings);

    if (error) throw error;
  }

  // Get audit trail for a thread
  static async getThreadAuditTrail(threadId: string): Promise<MessageAuditEntry[]> {
    const { data, error } = await supabase
      .from('message_audit_trail')
      .select('*')
      .eq('thread_id', threadId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return (data || []) as MessageAuditEntry[];
  }

  // Private method to log message actions
  private static async logMessageAction(
    action: string,
    threadId: string,
    messageId: string | null,
    metadata: any
  ): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      await supabase
        .from('message_audit_trail')
        .insert({
          message_id: messageId,
          thread_id: threadId,
          action_type: action,
          performed_by: user.id,
          compliance_metadata: metadata,
          ip_address: null, // Would be populated by edge function in production
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error logging message action:', error);
      // Don't throw - audit logging shouldn't block messaging
    }
  }
}