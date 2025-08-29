import type { Database as GeneratedDatabase } from './types';

declare module '@/integrations/supabase/types' {
  export interface Database {
    public: GeneratedDatabase['public'] & {
      Tables: GeneratedDatabase['public']['Tables'] & {
        meeting_notes: {
          Row: { id: string; user_id: string; persona: string; text: string; created_at: string };
          Insert: { user_id: string; persona: string; text: string; created_at?: string };
          Update: Partial<{ user_id: string; persona: string; text: string; created_at: string }>;
          Relationships: [];
        };
      };
    };
  }
}