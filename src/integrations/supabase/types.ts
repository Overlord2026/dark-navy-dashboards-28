export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_permissions: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          can_export: boolean | null
          can_view_panorama: boolean | null
          created_at: string | null
          id: string
          network_id: string
          permissions_config: Json | null
          updated_at: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          can_export?: boolean | null
          can_view_panorama?: boolean | null
          created_at?: string | null
          id?: string
          network_id: string
          permissions_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          can_export?: boolean | null
          can_view_panorama?: boolean | null
          created_at?: string | null
          id?: string
          network_id?: string
          permissions_config?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_permissions_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "family_network"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_notifications: {
        Row: {
          created_at: string
          data: Json
          id: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      asset_classes: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      asset_correlations: {
        Row: {
          asset_1_id: string
          asset_2_id: string
          correlation_coefficient: number | null
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_1_id: string
          asset_2_id: string
          correlation_coefficient?: number | null
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_1_id?: string
          asset_2_id?: string
          correlation_coefficient?: number | null
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          created_at: string
          details: Json
          event_type: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          amount: number
          budget_id: string
          color: string
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          amount?: number
          budget_id: string
          color: string
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_id?: string
          color?: string
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          id: string
          name: string
          period: string
          savings_goal: number
          total_expenses: number
          total_income: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          period?: string
          savings_goal?: number
          total_expenses?: number
          total_income?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          period?: string
          savings_goal?: number
          total_expenses?: number
          total_income?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_assistant: boolean
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_assistant?: boolean
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_assistant?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_records: {
        Row: {
          created_at: string
          expiry_date: string | null
          id: string
          professional_id: string
          record_type: Database["public"]["Enums"]["compliance_record_type"]
          status: Database["public"]["Enums"]["compliance_status"]
          updated_at: string
          verification_data: Json | null
          verification_date: string | null
          verification_method: string | null
          verifier_id: string | null
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          professional_id: string
          record_type: Database["public"]["Enums"]["compliance_record_type"]
          status?: Database["public"]["Enums"]["compliance_status"]
          updated_at?: string
          verification_data?: Json | null
          verification_date?: string | null
          verification_method?: string | null
          verifier_id?: string | null
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          professional_id?: string
          record_type?: Database["public"]["Enums"]["compliance_record_type"]
          status?: Database["public"]["Enums"]["compliance_status"]
          updated_at?: string
          verification_data?: Json | null
          verification_date?: string | null
          verification_method?: string | null
          verifier_id?: string | null
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          content_id: string
          created_at: string
          id: string
          tag: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          tag: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "educational_content"
            referencedColumns: ["id"]
          },
        ]
      }
      data_processing_consents: {
        Row: {
          consent_date: string
          consent_type: Database["public"]["Enums"]["data_consent_type"]
          created_at: string
          expiry_date: string | null
          id: string
          ip_address: string | null
          status: boolean
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_date?: string
          consent_type: Database["public"]["Enums"]["data_consent_type"]
          created_at?: string
          expiry_date?: string | null
          id?: string
          ip_address?: string | null
          status?: boolean
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_date?: string
          consent_type?: Database["public"]["Enums"]["data_consent_type"]
          created_at?: string
          expiry_date?: string | null
          id?: string
          ip_address?: string | null
          status?: boolean
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      document_shares: {
        Row: {
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          permissions: string | null
          shared_by: string
          shared_with: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          permissions?: string | null
          shared_by: string
          shared_with: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          permissions?: string | null
          shared_by?: string
          shared_with?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_content: {
        Row: {
          category: string
          content: string
          content_type: string
          created_at: string
          id: string
          is_featured: boolean
          reading_time: number
          slug: string
          summary: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          content_type: string
          created_at?: string
          id?: string
          is_featured?: boolean
          reading_time?: number
          slug: string
          summary: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          reading_time?: number
          slug?: string
          summary?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      encrypted_professional_data: {
        Row: {
          created_at: string
          encrypted_personal_details: Json
          encrypted_verification_documents: Json
          encryption_key_id: string | null
          id: string
          professional_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          encrypted_personal_details?: Json
          encrypted_verification_documents?: Json
          encryption_key_id?: string | null
          id?: string
          professional_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          encrypted_personal_details?: Json
          encrypted_verification_documents?: Json
          encryption_key_id?: string | null
          id?: string
          professional_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_network: {
        Row: {
          created_at: string | null
          id: string
          member_id: string
          owner_id: string
          relationship_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id: string
          owner_id: string
          relationship_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string
          owner_id?: string
          relationship_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          comments: string
          created_at: string | null
          id: string
          page: string
          user_id: string | null
        }
        Insert: {
          category: string
          comments: string
          created_at?: string | null
          id?: string
          page: string
          user_id?: string | null
        }
        Update: {
          category?: string
          comments?: string
          created_at?: string | null
          id?: string
          page?: string
          user_id?: string | null
        }
        Relationships: []
      }
      financial_accounts: {
        Row: {
          account_number: string | null
          account_type: Database["public"]["Enums"]["account_type"]
          balance: number
          created_at: string | null
          currency: string | null
          id: string
          institution: string
          is_manually_added: boolean | null
          last_updated: string | null
          metadata: Json | null
          name: string
          plaid_account_id: string | null
          plaid_item_id: string | null
          sync_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          account_type: Database["public"]["Enums"]["account_type"]
          balance?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          institution: string
          is_manually_added?: boolean | null
          last_updated?: string | null
          metadata?: Json | null
          name: string
          plaid_account_id?: string | null
          plaid_item_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          account_type?: Database["public"]["Enums"]["account_type"]
          balance?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          institution?: string
          is_manually_added?: boolean | null
          last_updated?: string | null
          metadata?: Json | null
          name?: string
          plaid_account_id?: string | null
          plaid_item_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_accounts_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["plaid_item_id"]
          },
        ]
      }
      integration_projects: {
        Row: {
          api_token: string | null
          created_at: string
          description: string | null
          id: string
          last_sync: string | null
          name: string
          project_type: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          api_token?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_sync?: string | null
          name: string
          project_type: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          api_token?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_sync?: string | null
          name?: string
          project_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lead_source_logs: {
        Row: {
          completed_at: string | null
          details: Json | null
          error: string | null
          id: string
          lead_source_id: string
          message: string | null
          records_failed: number | null
          records_imported: number | null
          records_processed: number | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          details?: Json | null
          error?: string | null
          id?: string
          lead_source_id: string
          message?: string | null
          records_failed?: number | null
          records_imported?: number | null
          records_processed?: number | null
          started_at?: string
          status: string
        }
        Update: {
          completed_at?: string | null
          details?: Json | null
          error?: string | null
          id?: string
          lead_source_id?: string
          message?: string | null
          records_failed?: number | null
          records_imported?: number | null
          records_processed?: number | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_source_logs_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          config: Json
          created_at: string
          credentials: Json
          id: string
          is_active: boolean
          last_sync_at: string | null
          name: string
          source_type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          name: string
          source_type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          name?: string
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      luxury_travel_bookings: {
        Row: {
          booking_date: string
          created_at: string
          id: string
          passengers: number
          special_requests: string | null
          status: string
          total_price: number
          travel_option_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          id?: string
          passengers?: number
          special_requests?: string | null
          status?: string
          total_price: number
          travel_option_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          id?: string
          passengers?: number
          special_requests?: string | null
          status?: string
          total_price?: number
          travel_option_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "luxury_travel_bookings_travel_option_id_fkey"
            columns: ["travel_option_id"]
            isOneToOne: false
            referencedRelation: "luxury_travel_options"
            referencedColumns: ["id"]
          },
        ]
      }
      luxury_travel_options: {
        Row: {
          available_from: string
          available_to: string
          created_at: string
          description: string
          duration: string
          id: string
          image_url: string | null
          location: string
          name: string
          price: number
          type: string
          updated_at: string
        }
        Insert: {
          available_from?: string
          available_to: string
          created_at?: string
          description: string
          duration: string
          id?: string
          image_url?: string | null
          location: string
          name: string
          price: number
          type: string
          updated_at?: string
        }
        Update: {
          available_from?: string
          available_to?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          price?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      network_invitations: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"] | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invite_code: string
          inviter_id: string
          relationship_type: string | null
          status: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invite_code: string
          inviter_id: string
          relationship_type?: string | null
          status?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invite_code?: string
          inviter_id?: string
          relationship_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      panorama_views: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          is_default: boolean | null
          layout_config: Json | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          layout_config?: Json | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_api_mappings: {
        Row: {
          id: string
          lead_source_id: string | null
          mapping: Json
          updated_at: string | null
        }
        Insert: {
          id?: string
          lead_source_id?: string | null
          mapping: Json
          updated_at?: string | null
        }
        Update: {
          id?: string
          lead_source_id?: string | null
          mapping?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_api_mappings_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: true
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_webhooks: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          is_active: boolean | null
          lead_source_id: string | null
          target_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          lead_source_id?: string | null
          target_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          lead_source_id?: string | null
          target_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_webhooks_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_items: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          last_updated: string | null
          plaid_item_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_updated?: string | null
          plaid_item_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_updated?: string | null
          plaid_item_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plaid_link_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          link_token: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          link_token: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          link_token?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      professional_profiles: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          expertise: string[] | null
          id: string
          is_verified: boolean | null
          kyc_status: Database["public"]["Enums"]["compliance_status"] | null
          license_number: string
          profession_type: Database["public"]["Enums"]["profession_type"] | null
          professional_type: string
          rating: number | null
          region: string | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          expertise?: string[] | null
          id: string
          is_verified?: boolean | null
          kyc_status?: Database["public"]["Enums"]["compliance_status"] | null
          license_number: string
          profession_type?:
            | Database["public"]["Enums"]["profession_type"]
            | null
          professional_type: string
          rating?: number | null
          region?: string | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          expertise?: string[] | null
          id?: string
          is_verified?: boolean | null
          kyc_status?: Database["public"]["Enums"]["compliance_status"] | null
          license_number?: string
          profession_type?:
            | Database["public"]["Enums"]["profession_type"]
            | null
          professional_type?: string
          rating?: number | null
          region?: string | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prospect_events: {
        Row: {
          event_type: string
          id: string
          occurred_at: string | null
          prospect_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          occurred_at?: string | null
          prospect_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          occurred_at?: string | null
          prospect_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospect_events_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          hnw_score: string | null
          id: string
          last_name: string | null
          lead_source_id: string | null
          metadata: Json | null
          next_meeting: string | null
          phone: string | null
          source: string | null
          stage: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          hnw_score?: string | null
          id?: string
          last_name?: string | null
          lead_source_id?: string | null
          metadata?: Json | null
          next_meeting?: string | null
          phone?: string | null
          source?: string | null
          stage?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          hnw_score?: string | null
          id?: string
          last_name?: string | null
          lead_source_id?: string | null
          metadata?: Json | null
          next_meeting?: string | null
          phone?: string | null
          source?: string | null
          stage?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospects_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          metadata: Json | null
          recurring_frequency: string | null
          subcategory: string | null
          transaction_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          metadata?: Json | null
          recurring_frequency?: string | null
          subcategory?: string | null
          transaction_date?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          metadata?: Json | null
          recurring_frequency?: string | null
          subcategory?: string | null
          transaction_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wealth_snapshots: {
        Row: {
          asset_breakdown: Json
          created_at: string | null
          id: string
          snapshot_date: string
          total_assets: number
          total_liabilities: number
          user_id: string
        }
        Insert: {
          asset_breakdown: Json
          created_at?: string | null
          id?: string
          snapshot_date: string
          total_assets: number
          total_liabilities: number
          user_id: string
        }
        Update: {
          asset_breakdown?: Json
          created_at?: string | null
          id?: string
          snapshot_date?: string
          total_assets?: number
          total_liabilities?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_expired_link_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      notify_advisor: {
        Args: { type: string; data: Json }
        Returns: string
      }
    }
    Enums: {
      access_level: "full_access" | "partial_access" | "read_only" | "no_access"
      account_type:
        | "checking"
        | "savings"
        | "investment"
        | "retirement"
        | "credit_card"
        | "loan"
        | "mortgage"
        | "crypto"
        | "other"
      app_role: "advisor" | "client"
      compliance_record_type:
        | "kyc_verification"
        | "gdpr_consent"
        | "terms_acceptance"
        | "data_access"
      compliance_status: "pending" | "approved" | "rejected" | "expired"
      data_consent_type: "gdpr" | "ccpa" | "marketing" | "data_sharing"
      profession_type:
        | "accountant"
        | "attorney"
        | "tax_advisor"
        | "estate_planner"
        | "financial_advisor"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["full_access", "partial_access", "read_only", "no_access"],
      account_type: [
        "checking",
        "savings",
        "investment",
        "retirement",
        "credit_card",
        "loan",
        "mortgage",
        "crypto",
        "other",
      ],
      app_role: ["advisor", "client"],
      compliance_record_type: [
        "kyc_verification",
        "gdpr_consent",
        "terms_acceptance",
        "data_access",
      ],
      compliance_status: ["pending", "approved", "rejected", "expired"],
      data_consent_type: ["gdpr", "ccpa", "marketing", "data_sharing"],
      profession_type: [
        "accountant",
        "attorney",
        "tax_advisor",
        "estate_planner",
        "financial_advisor",
        "other",
      ],
    },
  },
} as const
