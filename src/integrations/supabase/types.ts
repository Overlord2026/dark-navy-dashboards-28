export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ach_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          processed_at: string | null
          stripe_event_id: string | null
          transfer_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          transfer_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ach_events_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_applications: {
        Row: {
          application_form_url: string | null
          applied_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specialty: string | null
          status: string | null
          tenant_id: string | null
        }
        Insert: {
          application_form_url?: string | null
          applied_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialty?: string | null
          status?: string | null
          tenant_id?: string | null
        }
        Update: {
          application_form_url?: string | null
          applied_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialty?: string | null
          status?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_assignments: {
        Row: {
          advisor_id: string
          assigned_at: string | null
          client_id: string | null
          id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          advisor_id: string
          assigned_at?: string | null
          client_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          advisor_id?: string
          assigned_at?: string | null
          client_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: []
      }
      advisor_overrides: {
        Row: {
          created_at: string | null
          id: string
          override_amount: number | null
          override_percent: number
          payment_frequency: string | null
          production_amount: number | null
          production_period_end: string | null
          production_period_start: string
          recruited_advisor_id: string
          referring_advisor_id: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          override_amount?: number | null
          override_percent: number
          payment_frequency?: string | null
          production_amount?: number | null
          production_period_end?: string | null
          production_period_start: string
          recruited_advisor_id: string
          referring_advisor_id: string
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          override_amount?: number | null
          override_percent?: number
          payment_frequency?: string | null
          production_amount?: number | null
          production_period_end?: string | null
          production_period_start?: string
          recruited_advisor_id?: string
          referring_advisor_id?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_overrides_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_production: {
        Row: {
          advisor_id: string
          aum_fees: number | null
          client_fees: number | null
          commission: number | null
          created_at: string | null
          gross_revenue: number | null
          id: string
          net_revenue: number | null
          period_end: string
          period_start: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          advisor_id: string
          aum_fees?: number | null
          client_fees?: number | null
          commission?: number | null
          created_at?: string | null
          gross_revenue?: number | null
          id?: string
          net_revenue?: number | null
          period_end: string
          period_start: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          advisor_id?: string
          aum_fees?: number | null
          client_fees?: number | null
          commission?: number | null
          created_at?: string | null
          gross_revenue?: number | null
          id?: string
          net_revenue?: number | null
          period_end?: string
          period_start?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_production_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_category: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_category: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          cost: number | null
          created_at: string
          id: string
          member_id: string
          notes: string | null
          provider_id: string
          reimburse_id: string | null
          status: string | null
          updated_at: string
          visit_date: string
          visit_type: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          id?: string
          member_id: string
          notes?: string | null
          provider_id: string
          reimburse_id?: string | null
          status?: string | null
          updated_at?: string
          visit_date: string
          visit_type?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          id?: string
          member_id?: string
          notes?: string | null
          provider_id?: string
          reimburse_id?: string | null
          status?: string | null
          updated_at?: string
          visit_date?: string
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_reimburse_id_fkey"
            columns: ["reimburse_id"]
            isOneToOne: false
            referencedRelation: "hsa_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      backup_operations: {
        Row: {
          backup_location: string | null
          bucket_name: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_count: number | null
          id: string
          initiated_by: string | null
          metadata: Json | null
          operation_type: string
          started_at: string
          status: string
          total_size_bytes: number | null
        }
        Insert: {
          backup_location?: string | null
          bucket_name: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_count?: number | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          operation_type: string
          started_at?: string
          status?: string
          total_size_bytes?: number | null
        }
        Update: {
          backup_location?: string | null
          bucket_name?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_count?: number | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          operation_type?: string
          started_at?: string
          status?: string
          total_size_bytes?: number | null
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_number_last4: string | null
          account_type: string
          ach_enabled: boolean | null
          balance: number
          created_at: string
          id: string
          institution_name: string | null
          is_plaid_linked: boolean | null
          last_plaid_sync: string | null
          name: string
          plaid_account_id: string | null
          plaid_institution_id: string | null
          plaid_item_id: string | null
          routing_number: string | null
          stripe_account_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number_last4?: string | null
          account_type: string
          ach_enabled?: boolean | null
          balance?: number
          created_at?: string
          id?: string
          institution_name?: string | null
          is_plaid_linked?: boolean | null
          last_plaid_sync?: string | null
          name: string
          plaid_account_id?: string | null
          plaid_institution_id?: string | null
          plaid_item_id?: string | null
          routing_number?: string | null
          stripe_account_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number_last4?: string | null
          account_type?: string
          ach_enabled?: boolean | null
          balance?: number
          created_at?: string
          id?: string
          institution_name?: string | null
          is_plaid_linked?: boolean | null
          last_plaid_sync?: string | null
          name?: string
          plaid_account_id?: string | null
          plaid_institution_id?: string | null
          plaid_item_id?: string | null
          routing_number?: string | null
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_goals: {
        Row: {
          category: string
          created_at: string
          current_amount: number
          description: string | null
          id: string
          priority: string
          target_amount: number
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          priority?: string
          target_amount?: number
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          priority?: string
          target_amount?: number
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_filings: {
        Row: {
          business_name: string
          completed: boolean
          created_at: string
          description: string | null
          due_date: string
          filing_type: string
          id: string
          name: string
          recurring: boolean
          recurring_period: string | null
          reminder_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date: string
          filing_type: string
          id?: string
          name: string
          recurring?: boolean
          recurring_period?: string | null
          reminder_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string
          filing_type?: string
          id?: string
          name?: string
          recurring?: boolean
          recurring_period?: string | null
          reminder_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_insights: {
        Row: {
          context_data: Json | null
          created_at: string | null
          date: string
          id: string
          insight_1: string | null
          insight_2: string | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          date: string
          id?: string
          insight_1?: string | null
          insight_2?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          date?: string
          id?: string
          insight_1?: string | null
          insight_2?: string | null
          user_id?: string
        }
        Relationships: []
      }
      credit_cards: {
        Row: {
          apr: number | null
          available_credit: number | null
          created_at: string | null
          credit_limit: number
          current_balance: number
          due_date: string | null
          id: string
          is_plaid_linked: boolean | null
          issuer: string
          last_four: string
          minimum_payment: number | null
          name: string
          notes: string | null
          plaid_account_id: string | null
          plaid_item_id: string | null
          rewards_program: string | null
          statement_balance: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          apr?: number | null
          available_credit?: number | null
          created_at?: string | null
          credit_limit?: number
          current_balance?: number
          due_date?: string | null
          id?: string
          is_plaid_linked?: boolean | null
          issuer: string
          last_four: string
          minimum_payment?: number | null
          name: string
          notes?: string | null
          plaid_account_id?: string | null
          plaid_item_id?: string | null
          rewards_program?: string | null
          statement_balance?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          apr?: number | null
          available_credit?: number | null
          created_at?: string | null
          credit_limit?: number
          current_balance?: number
          due_date?: string | null
          id?: string
          is_plaid_linked?: boolean | null
          issuer?: string
          last_four?: string
          minimum_payment?: number | null
          name?: string
          notes?: string | null
          plaid_account_id?: string | null
          plaid_item_id?: string | null
          rewards_program?: string | null
          statement_balance?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crm_integrations: {
        Row: {
          api_endpoint: string | null
          api_key_encrypted: string | null
          created_at: string
          field_mappings: Json | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync_at: string | null
          settings: Json | null
          sync_frequency: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          created_at?: string
          field_mappings?: Json | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          settings?: Json | null
          sync_frequency?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          created_at?: string
          field_mappings?: Json | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          settings?: Json | null
          sync_frequency?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_analytics: {
        Row: {
          active_users: number | null
          advisor_logins: number | null
          advisor_onboarding_completed: number | null
          avg_session_duration: number | null
          client_logins: number | null
          client_onboarding_completed: number | null
          conversion_rate: number | null
          created_at: string
          date: string
          id: string
          new_advisors: number | null
          new_clients: number | null
          new_users: number | null
          page_views: number | null
          tenant_id: string | null
          total_sessions: number | null
          total_users: number | null
          updated_at: string
        }
        Insert: {
          active_users?: number | null
          advisor_logins?: number | null
          advisor_onboarding_completed?: number | null
          avg_session_duration?: number | null
          client_logins?: number | null
          client_onboarding_completed?: number | null
          conversion_rate?: number | null
          created_at?: string
          date: string
          id?: string
          new_advisors?: number | null
          new_clients?: number | null
          new_users?: number | null
          page_views?: number | null
          tenant_id?: string | null
          total_sessions?: number | null
          total_users?: number | null
          updated_at?: string
        }
        Update: {
          active_users?: number | null
          advisor_logins?: number | null
          advisor_onboarding_completed?: number | null
          avg_session_duration?: number | null
          client_logins?: number | null
          client_onboarding_completed?: number | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          new_advisors?: number | null
          new_clients?: number | null
          new_users?: number | null
          page_views?: number | null
          tenant_id?: string | null
          total_sessions?: number | null
          total_users?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          provider: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_test_runs: {
        Row: {
          created_at: string
          created_by: string | null
          environment: string
          error_details: Json | null
          execution_time_ms: number | null
          failed_tests: number
          git_branch: string | null
          git_commit_hash: string | null
          id: string
          overall_status: string
          passed_tests: number
          run_timestamp: string
          test_results: Json
          total_tests: number
          warnings_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          environment?: string
          error_details?: Json | null
          execution_time_ms?: number | null
          failed_tests?: number
          git_branch?: string | null
          git_commit_hash?: string | null
          id?: string
          overall_status: string
          passed_tests?: number
          run_timestamp?: string
          test_results?: Json
          total_tests?: number
          warnings_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          environment?: string
          error_details?: Json | null
          execution_time_ms?: number | null
          failed_tests?: number
          git_branch?: string | null
          git_commit_hash?: string | null
          id?: string
          overall_status?: string
          passed_tests?: number
          run_timestamp?: string
          test_results?: Json
          total_tests?: number
          warnings_count?: number
        }
        Relationships: []
      }
      digital_assets: {
        Row: {
          asset_type: string
          created_at: string
          custom_asset_type: string | null
          id: string
          price_per_unit: number
          quantity: number
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_type: string
          created_at?: string
          custom_asset_type?: string | null
          id?: string
          price_per_unit: number
          quantity: number
          total_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          custom_asset_type?: string | null
          id?: string
          price_per_unit?: number
          quantity?: number
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      disaster_recovery_checklist: {
        Row: {
          actual_data_loss: unknown | null
          assigned_to: string | null
          checklist_items: Json
          created_at: string
          estimated_data_loss: unknown | null
          id: string
          incident_id: string
          incident_type: string
          lessons_learned: string | null
          recovery_actions: Json | null
          resolved_at: string | null
          severity: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          actual_data_loss?: unknown | null
          assigned_to?: string | null
          checklist_items: Json
          created_at?: string
          estimated_data_loss?: unknown | null
          id?: string
          incident_id: string
          incident_type: string
          lessons_learned?: string | null
          recovery_actions?: Json | null
          resolved_at?: string | null
          severity: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          actual_data_loss?: unknown | null
          assigned_to?: string | null
          checklist_items?: Json
          created_at?: string
          estimated_data_loss?: unknown | null
          id?: string
          incident_id?: string
          incident_type?: string
          lessons_learned?: string | null
          recovery_actions?: Json | null
          resolved_at?: string | null
          severity?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_permissions: {
        Row: {
          access_level: string
          created_at: string
          document_id: string
          granted_at: string
          granted_by_user_id: string
          id: string
          user_email: string | null
          user_id: string
          user_name: string | null
          user_role: string | null
        }
        Insert: {
          access_level: string
          created_at?: string
          document_id: string
          granted_at?: string
          granted_by_user_id: string
          id?: string
          user_email?: string | null
          user_id: string
          user_name?: string | null
          user_role?: string | null
        }
        Update: {
          access_level?: string
          created_at?: string
          document_id?: string
          granted_at?: string
          granted_by_user_id?: string
          id?: string
          user_email?: string | null
          user_id?: string
          user_name?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          content_type: string | null
          created_at: string
          description: string | null
          encrypted: boolean | null
          file_path: string | null
          id: string
          is_folder: boolean | null
          is_private: boolean | null
          modified: string | null
          name: string
          parent_folder_id: string | null
          shared: boolean | null
          size: number | null
          tags: string[] | null
          tenant_id: string
          type: string
          updated_at: string
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          category: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          encrypted?: boolean | null
          file_path?: string | null
          id?: string
          is_folder?: boolean | null
          is_private?: boolean | null
          modified?: string | null
          name: string
          parent_folder_id?: string | null
          shared?: boolean | null
          size?: number | null
          tags?: string[] | null
          tenant_id: string
          type: string
          updated_at?: string
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          encrypted?: boolean | null
          file_path?: string | null
          id?: string
          is_folder?: boolean | null
          is_private?: boolean | null
          modified?: string | null
          name?: string
          parent_folder_id?: string | null
          shared?: boolean | null
          size?: number | null
          tags?: string[] | null
          tenant_id?: string
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_content: {
        Row: {
          content_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          file_path: string | null
          id: string
          is_global: boolean | null
          is_premium: boolean | null
          is_visible: boolean | null
          segments: string[] | null
          sort_order: number | null
          tenant_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          is_global?: boolean | null
          is_premium?: boolean | null
          is_visible?: boolean | null
          segments?: string[] | null
          sort_order?: number | null
          tenant_id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          is_global?: boolean | null
          is_premium?: boolean | null
          is_visible?: boolean | null
          segments?: string[] | null
          sort_order?: number | null
          tenant_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educational_content_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      epigenetic_tests: {
        Row: {
          biological_age: number
          chronological_age: number
          cost: number
          created_at: string
          delta_age: number
          id: string
          provider: string
          results: Json | null
          test_date: string
          test_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          biological_age: number
          chronological_age: number
          cost?: number
          created_at?: string
          delta_age: number
          id?: string
          provider: string
          results?: Json | null
          test_date: string
          test_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          biological_age?: number
          chronological_age?: number
          cost?: number
          created_at?: string
          delta_age?: number
          id?: string
          provider?: string
          results?: Json | null
          test_date?: string
          test_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      estate_planning_documents: {
        Row: {
          content_type: string | null
          created_at: string
          description: string | null
          document_name: string
          document_type: string
          file_path: string | null
          file_size: number | null
          id: string
          shared_with: string[] | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          description?: string | null
          document_name: string
          document_type: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          shared_with?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          description?: string | null
          document_name?: string
          document_type?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          shared_with?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercise_entries: {
        Row: {
          activity: string
          calories_burned: number | null
          created_at: string
          date: string
          duration: number
          exercise_type: string
          id: string
          intensity: string
          notes: string | null
          reps: number | null
          sets: number | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity: string
          calories_burned?: number | null
          created_at?: string
          date?: string
          duration?: number
          exercise_type: string
          id?: string
          intensity: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity?: string
          calories_burned?: number | null
          created_at?: string
          date?: string
          duration?: number
          exercise_type?: string
          id?: string
          intensity?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      exercise_goals: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          preferred_activities: string[] | null
          updated_at: string
          user_id: string
          weekly_calories_burn: number | null
          weekly_minutes: number
          weekly_workouts: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          preferred_activities?: string[] | null
          updated_at?: string
          user_id: string
          weekly_calories_burn?: number | null
          weekly_minutes?: number
          weekly_workouts?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          preferred_activities?: string[] | null
          updated_at?: string
          user_id?: string
          weekly_calories_burn?: number | null
          weekly_minutes?: number
          weekly_workouts?: number
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string | null
          family_name: string
          id: string
          primary_member_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          family_name?: string
          id?: string
          primary_member_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          family_name?: string
          id?: string
          primary_member_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          access_level: string | null
          created_at: string
          device_token: string | null
          email: string | null
          family_id: string | null
          has_app_access: boolean
          id: string
          invitation_sent_at: string | null
          invited_user_id: string | null
          name: string
          phone: string | null
          relationship: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          device_token?: string | null
          email?: string | null
          family_id?: string | null
          has_app_access?: boolean
          id?: string
          invitation_sent_at?: string | null
          invited_user_id?: string | null
          name: string
          phone?: string | null
          relationship: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level?: string | null
          created_at?: string
          device_token?: string | null
          email?: string | null
          family_id?: string | null
          has_app_access?: boolean
          id?: string
          invitation_sent_at?: string | null
          invited_user_id?: string | null
          name?: string
          phone?: string | null
          relationship?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          question: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fee_scenarios: {
        Row: {
          created_at: string
          current_fee: number
          current_fee_type: string
          growth_rate: number
          healthcare_annual_budget: number
          id: string
          our_fee: number
          our_fee_type: string
          portfolio_value: number
          time_horizon: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_fee?: number
          current_fee_type?: string
          growth_rate?: number
          healthcare_annual_budget?: number
          id?: string
          our_fee?: number
          our_fee_type?: string
          portfolio_value?: number
          time_horizon?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_fee?: number
          current_fee_type?: string
          growth_rate?: number
          healthcare_annual_budget?: number
          id?: string
          our_fee?: number
          our_fee_type?: string
          portfolio_value?: number
          time_horizon?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      file_backup_registry: {
        Row: {
          backed_up_at: string
          backup_file_path: string
          backup_operation_id: string
          bucket_name: string
          checksum: string | null
          created_at: string
          file_size_bytes: number | null
          id: string
          is_verified: boolean | null
          original_file_path: string
          verified_at: string | null
        }
        Insert: {
          backed_up_at?: string
          backup_file_path: string
          backup_operation_id: string
          bucket_name: string
          checksum?: string | null
          created_at?: string
          file_size_bytes?: number | null
          id?: string
          is_verified?: boolean | null
          original_file_path: string
          verified_at?: string | null
        }
        Update: {
          backed_up_at?: string
          backup_file_path?: string
          backup_operation_id?: string
          bucket_name?: string
          checksum?: string | null
          created_at?: string
          file_size_bytes?: number | null
          id?: string
          is_verified?: boolean | null
          original_file_path?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_backup_registry_backup_operation_id_fkey"
            columns: ["backup_operation_id"]
            isOneToOne: false
            referencedRelation: "backup_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          id: string
          is_selected: boolean
          name: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          account_type: string
          balance?: number
          created_at?: string
          id?: string
          is_selected?: boolean
          name: string
          plan_id: string
          updated_at?: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          id?: string
          is_selected?: boolean
          name?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_accounts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_goals: {
        Row: {
          created_at: string
          current_amount: number
          description: string | null
          id: string
          is_complete: boolean
          plan_id: string
          priority: string
          target_amount: number
          target_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          is_complete?: boolean
          plan_id: string
          priority?: string
          target_amount?: number
          target_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          is_complete?: boolean
          plan_id?: string
          priority?: string
          target_amount?: number
          target_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_goals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_plans: {
        Row: {
          created_at: string
          draft_data: Json | null
          id: string
          is_active: boolean | null
          is_draft: boolean | null
          is_favorite: boolean
          name: string
          status: string
          step: number | null
          success_rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          draft_data?: Json | null
          id?: string
          is_active?: boolean | null
          is_draft?: boolean | null
          is_favorite?: boolean
          name: string
          status?: string
          step?: number | null
          success_rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          draft_data?: Json | null
          id?: string
          is_active?: boolean | null
          is_draft?: boolean | null
          is_favorite?: boolean
          name?: string
          status?: string
          step?: number | null
          success_rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      franchise_referral_payouts: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          currency: string
          franchise_referral_id: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payout_type: string
          period_end: string | null
          period_start: string | null
          referring_tenant_id: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          currency?: string
          franchise_referral_id: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_type: string
          period_end?: string | null
          period_start?: string | null
          referring_tenant_id: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          currency?: string
          franchise_referral_id?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_type?: string
          period_end?: string | null
          period_start?: string | null
          referring_tenant_id?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_referral_payouts_franchise_referral_id_fkey"
            columns: ["franchise_referral_id"]
            isOneToOne: false
            referencedRelation: "franchise_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_referrals: {
        Row: {
          campaign_data: Json | null
          contacted_at: string | null
          created_at: string
          demo_scheduled_at: string | null
          expected_aum: number | null
          expires_at: string | null
          firm_size: number | null
          id: string
          notes: string | null
          referral_code: string
          referral_reward_amount: number
          referral_reward_type: string
          referred_contact_email: string
          referred_contact_name: string
          referred_contact_phone: string | null
          referred_firm_name: string
          referring_tenant_id: string
          reward_status: string
          royalty_period_months: number | null
          signed_at: string | null
          status: string
          tenant_id: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          campaign_data?: Json | null
          contacted_at?: string | null
          created_at?: string
          demo_scheduled_at?: string | null
          expected_aum?: number | null
          expires_at?: string | null
          firm_size?: number | null
          id?: string
          notes?: string | null
          referral_code: string
          referral_reward_amount?: number
          referral_reward_type?: string
          referred_contact_email: string
          referred_contact_name: string
          referred_contact_phone?: string | null
          referred_firm_name: string
          referring_tenant_id: string
          reward_status?: string
          royalty_period_months?: number | null
          signed_at?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          campaign_data?: Json | null
          contacted_at?: string | null
          created_at?: string
          demo_scheduled_at?: string | null
          expected_aum?: number | null
          expires_at?: string | null
          firm_size?: number | null
          id?: string
          notes?: string | null
          referral_code?: string
          referral_reward_amount?: number
          referral_reward_type?: string
          referred_contact_email?: string
          referred_contact_name?: string
          referred_contact_phone?: string | null
          referred_firm_name?: string
          referring_tenant_id?: string
          reward_status?: string
          royalty_period_months?: number | null
          signed_at?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      health_alerts: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metric_id: string | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metric_id?: string | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metric_id?: string | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_alerts_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      health_doc_access_log: {
        Row: {
          access_method: string | null
          access_type: string
          accessed_at: string | null
          accessed_by_user_id: string | null
          doc_id: string | null
          emergency_context: string | null
          emergency_token: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          access_method?: string | null
          access_type: string
          accessed_at?: string | null
          accessed_by_user_id?: string | null
          doc_id?: string | null
          emergency_context?: string | null
          emergency_token?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          access_method?: string | null
          access_type?: string
          accessed_at?: string | null
          accessed_by_user_id?: string | null
          doc_id?: string | null
          emergency_context?: string | null
          emergency_token?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_doc_access_log_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "health_docs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_doc_reminders: {
        Row: {
          created_at: string | null
          doc_id: string | null
          id: string
          remind_at: string
          reminder_sent: boolean | null
          reminder_type: string
        }
        Insert: {
          created_at?: string | null
          doc_id?: string | null
          id?: string
          remind_at: string
          reminder_sent?: boolean | null
          reminder_type: string
        }
        Update: {
          created_at?: string | null
          doc_id?: string | null
          id?: string
          remind_at?: string
          reminder_sent?: boolean | null
          reminder_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_doc_reminders_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "health_docs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_doc_shares: {
        Row: {
          created_by_user_id: string
          doc_id: string | null
          expires_at: string | null
          granted_at: string | null
          grantee_email: string | null
          grantee_id: string | null
          grantee_name: string | null
          grantee_type: string
          id: string
          permission: string
        }
        Insert: {
          created_by_user_id: string
          doc_id?: string | null
          expires_at?: string | null
          granted_at?: string | null
          grantee_email?: string | null
          grantee_id?: string | null
          grantee_name?: string | null
          grantee_type: string
          id?: string
          permission: string
        }
        Update: {
          created_by_user_id?: string
          doc_id?: string | null
          expires_at?: string | null
          granted_at?: string | null
          grantee_email?: string | null
          grantee_id?: string | null
          grantee_name?: string | null
          grantee_type?: string
          id?: string
          permission?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_doc_shares_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "health_docs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_docs: {
        Row: {
          agent_name: string | null
          agent_phone: string | null
          agent_relationship: string | null
          content_type: string | null
          created_at: string | null
          doc_type: string
          document_name: string
          document_status: string | null
          expires_on: string | null
          family_id: string | null
          file_path: string | null
          file_size: number | null
          group_number: string | null
          id: string
          is_emergency_accessible: boolean | null
          is_placeholder: boolean | null
          lawyer_contact: string | null
          member_id: string | null
          plan_name: string | null
          signed_date: string | null
          signer_name: string | null
          storage_bucket: string | null
          subscriber_id: string | null
          updated_at: string | null
          user_id: string
          witness_names: string[] | null
        }
        Insert: {
          agent_name?: string | null
          agent_phone?: string | null
          agent_relationship?: string | null
          content_type?: string | null
          created_at?: string | null
          doc_type: string
          document_name: string
          document_status?: string | null
          expires_on?: string | null
          family_id?: string | null
          file_path?: string | null
          file_size?: number | null
          group_number?: string | null
          id?: string
          is_emergency_accessible?: boolean | null
          is_placeholder?: boolean | null
          lawyer_contact?: string | null
          member_id?: string | null
          plan_name?: string | null
          signed_date?: string | null
          signer_name?: string | null
          storage_bucket?: string | null
          subscriber_id?: string | null
          updated_at?: string | null
          user_id: string
          witness_names?: string[] | null
        }
        Update: {
          agent_name?: string | null
          agent_phone?: string | null
          agent_relationship?: string | null
          content_type?: string | null
          created_at?: string | null
          doc_type?: string
          document_name?: string
          document_status?: string | null
          expires_on?: string | null
          family_id?: string | null
          file_path?: string | null
          file_size?: number | null
          group_number?: string | null
          id?: string
          is_emergency_accessible?: boolean | null
          is_placeholder?: boolean | null
          lawyer_contact?: string | null
          member_id?: string | null
          plan_name?: string | null
          signed_date?: string | null
          signer_name?: string | null
          storage_bucket?: string | null
          subscriber_id?: string | null
          updated_at?: string | null
          user_id?: string
          witness_names?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "health_docs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_docs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      health_goals: {
        Row: {
          created_at: string
          current_value: string | null
          description: string | null
          id: string
          priority: string
          status: string
          target_date: string | null
          target_value: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          target_date?: string | null
          target_value?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          target_date?: string | null
          target_value?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          type: string
          unit: string | null
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          type: string
          unit?: string | null
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          type?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      health_recommendations: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      healthcare_document_permissions: {
        Row: {
          access_level: string
          created_at: string
          document_id: string
          granted_at: string
          granted_by_user_id: string
          id: string
          user_email: string | null
          user_id: string
          user_name: string | null
          user_role: string | null
        }
        Insert: {
          access_level: string
          created_at?: string
          document_id: string
          granted_at?: string
          granted_by_user_id: string
          id?: string
          user_email?: string | null
          user_id: string
          user_name?: string | null
          user_role?: string | null
        }
        Update: {
          access_level?: string
          created_at?: string
          document_id?: string
          granted_at?: string
          granted_by_user_id?: string
          id?: string
          user_email?: string | null
          user_id?: string
          user_name?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "healthcare_document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "healthcare_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_documents: {
        Row: {
          category: string
          content_type: string | null
          created_at: string
          description: string | null
          encrypted: boolean | null
          file_path: string | null
          id: string
          is_folder: boolean | null
          is_private: boolean | null
          modified: string | null
          name: string
          parent_folder_id: string | null
          shared: boolean | null
          size: number | null
          tags: string[] | null
          type: string
          updated_at: string
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          category?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          encrypted?: boolean | null
          file_path?: string | null
          id?: string
          is_folder?: boolean | null
          is_private?: boolean | null
          modified?: string | null
          name: string
          parent_folder_id?: string | null
          shared?: boolean | null
          size?: number | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          encrypted?: boolean | null
          file_path?: string | null
          id?: string
          is_folder?: boolean | null
          is_private?: boolean | null
          modified?: string | null
          name?: string
          parent_folder_id?: string | null
          shared?: boolean | null
          size?: number | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      healthcare_providers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          family_id: string | null
          id: string
          name: string
          notes: string | null
          npi: string | null
          phone: string | null
          photo_url: string | null
          portal_url: string | null
          rating: number | null
          specialty: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          family_id?: string | null
          id?: string
          name: string
          notes?: string | null
          npi?: string | null
          phone?: string | null
          photo_url?: string | null
          portal_url?: string | null
          rating?: number | null
          specialty?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          family_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          npi?: string | null
          phone?: string | null
          photo_url?: string | null
          portal_url?: string | null
          rating?: number | null
          specialty?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      healthcare_shared_documents: {
        Row: {
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          permission_level: string
          professional_id: string
          shared_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          professional_id: string
          shared_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          professional_id?: string
          shared_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "healthcare_shared_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "healthcare_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "healthcare_shared_documents_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_accounts: {
        Row: {
          account_name: string
          account_number_last4: string | null
          account_type: string
          annual_contribution_limit: number
          annual_contribution_ytd: number
          available_cash: number
          cash_balance: number | null
          catch_up_eligible: boolean
          created_at: string
          current_balance: number
          custodian_id: string | null
          custodian_name: string
          employer_contribution_ytd: number
          family_id: string | null
          family_member_id: string | null
          id: string
          invested_balance: number
          is_active: boolean
          is_primary: boolean
          last_sync_at: string | null
          nickname: string | null
          plaid_account_id: string | null
          provider: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number_last4?: string | null
          account_type?: string
          annual_contribution_limit?: number
          annual_contribution_ytd?: number
          available_cash?: number
          cash_balance?: number | null
          catch_up_eligible?: boolean
          created_at?: string
          current_balance?: number
          custodian_id?: string | null
          custodian_name: string
          employer_contribution_ytd?: number
          family_id?: string | null
          family_member_id?: string | null
          id?: string
          invested_balance?: number
          is_active?: boolean
          is_primary?: boolean
          last_sync_at?: string | null
          nickname?: string | null
          plaid_account_id?: string | null
          provider?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number_last4?: string | null
          account_type?: string
          annual_contribution_limit?: number
          annual_contribution_ytd?: number
          available_cash?: number
          cash_balance?: number | null
          catch_up_eligible?: boolean
          created_at?: string
          current_balance?: number
          custodian_id?: string | null
          custodian_name?: string
          employer_contribution_ytd?: number
          family_id?: string | null
          family_member_id?: string | null
          id?: string
          invested_balance?: number
          is_active?: boolean
          is_primary?: boolean
          last_sync_at?: string | null
          nickname?: string | null
          plaid_account_id?: string | null
          provider?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_accounts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hsa_accounts_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_contributions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          id: string
          source: string
          tx_date: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          id?: string
          source?: string
          tx_date: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          source?: string
          tx_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_contributions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "hsa_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_expenses: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          id: string
          member_id: string | null
          merchant: string | null
          receipt_url: string | null
          reimburse_status: string | null
          tx_date: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          id?: string
          member_id?: string | null
          merchant?: string | null
          receipt_url?: string | null
          reimburse_status?: string | null
          tx_date: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          member_id?: string | null
          merchant?: string | null
          receipt_url?: string | null
          reimburse_status?: string | null
          tx_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_expenses_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "hsa_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hsa_expenses_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_investment_rules: {
        Row: {
          cash_threshold: number
          created_at: string
          hsa_account_id: string
          id: string
          investment_percentage: number
          is_active: boolean
          rule_name: string
          target_allocation: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cash_threshold?: number
          created_at?: string
          hsa_account_id: string
          id?: string
          investment_percentage?: number
          is_active?: boolean
          rule_name: string
          target_allocation?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cash_threshold?: number
          created_at?: string
          hsa_account_id?: string
          id?: string
          investment_percentage?: number
          is_active?: boolean
          rule_name?: string
          target_allocation?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_investment_rules_hsa_account_id_fkey"
            columns: ["hsa_account_id"]
            isOneToOne: false
            referencedRelation: "hsa_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_receipts: {
        Row: {
          category: string | null
          content_type: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string | null
          file_size: number | null
          hsa_account_id: string | null
          id: string
          is_hsa_eligible: boolean | null
          is_matched: boolean
          is_processed: boolean
          matched_transaction_id: string | null
          merchant_name: string | null
          ocr_confidence: number | null
          ocr_data: Json | null
          receipt_date: string | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          hsa_account_id?: string | null
          id?: string
          is_hsa_eligible?: boolean | null
          is_matched?: boolean
          is_processed?: boolean
          matched_transaction_id?: string | null
          merchant_name?: string | null
          ocr_confidence?: number | null
          ocr_data?: Json | null
          receipt_date?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          hsa_account_id?: string | null
          id?: string
          is_hsa_eligible?: boolean | null
          is_matched?: boolean
          is_processed?: boolean
          matched_transaction_id?: string | null
          merchant_name?: string | null
          ocr_confidence?: number | null
          ocr_data?: Json | null
          receipt_date?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_receipts_hsa_account_id_fkey"
            columns: ["hsa_account_id"]
            isOneToOne: false
            referencedRelation: "hsa_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hsa_receipts_matched_transaction_id_fkey"
            columns: ["matched_transaction_id"]
            isOneToOne: false
            referencedRelation: "hsa_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_reimbursements: {
        Row: {
          created_at: string
          hsa_account_id: string
          id: string
          method: string | null
          notes: string | null
          processed_date: string | null
          receipt_id: string | null
          reimbursement_amount: number
          requested_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hsa_account_id: string
          id?: string
          method?: string | null
          notes?: string | null
          processed_date?: string | null
          receipt_id?: string | null
          reimbursement_amount: number
          requested_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hsa_account_id?: string
          id?: string
          method?: string | null
          notes?: string | null
          processed_date?: string | null
          receipt_id?: string | null
          reimbursement_amount?: number
          requested_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_reimbursements_hsa_account_id_fkey"
            columns: ["hsa_account_id"]
            isOneToOne: false
            referencedRelation: "hsa_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hsa_reimbursements_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "hsa_receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      hsa_spending_categories: {
        Row: {
          annual_budget: number | null
          category_name: string
          created_at: string
          id: string
          is_hsa_eligible: boolean
          parent_category: string | null
          updated_at: string
          user_id: string
          ytd_spending: number
        }
        Insert: {
          annual_budget?: number | null
          category_name: string
          created_at?: string
          id?: string
          is_hsa_eligible?: boolean
          parent_category?: string | null
          updated_at?: string
          user_id: string
          ytd_spending?: number
        }
        Update: {
          annual_budget?: number | null
          category_name?: string
          created_at?: string
          id?: string
          is_hsa_eligible?: boolean
          parent_category?: string | null
          updated_at?: string
          user_id?: string
          ytd_spending?: number
        }
        Relationships: []
      }
      hsa_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          hsa_account_id: string
          id: string
          is_qualified_expense: boolean | null
          merchant_name: string | null
          notes: string | null
          posted_date: string | null
          receipt_id: string | null
          reimbursement_id: string | null
          subcategory: string | null
          transaction_date: string
          transaction_id: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          hsa_account_id: string
          id?: string
          is_qualified_expense?: boolean | null
          merchant_name?: string | null
          notes?: string | null
          posted_date?: string | null
          receipt_id?: string | null
          reimbursement_id?: string | null
          subcategory?: string | null
          transaction_date: string
          transaction_id?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          hsa_account_id?: string
          id?: string
          is_qualified_expense?: boolean | null
          merchant_name?: string | null
          notes?: string | null
          posted_date?: string | null
          receipt_id?: string | null
          reimbursement_id?: string | null
          subcategory?: string | null
          transaction_date?: string
          transaction_id?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hsa_transactions_hsa_account_id_fkey"
            columns: ["hsa_account_id"]
            isOneToOne: false
            referencedRelation: "hsa_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          coverage: string
          created_at: string
          deductible: number
          effective_date: string
          expiration_date: string
          group_number: string | null
          id: string
          member_id: string
          notes: string | null
          plan: string
          policy_number: string
          premium: number
          provider: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          coverage: string
          created_at?: string
          deductible?: number
          effective_date: string
          expiration_date: string
          group_number?: string | null
          id?: string
          member_id: string
          notes?: string | null
          plan: string
          policy_number: string
          premium?: number
          provider: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          coverage?: string
          created_at?: string
          deductible?: number
          effective_date?: string
          expiration_date?: string
          group_number?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          plan?: string
          policy_number?: string
          premium?: number
          provider?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type: string
          balance?: number
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      investment_meetings: {
        Row: {
          consultation_type: string
          created_at: string | null
          id: string
          notes: string | null
          offering_id: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          consultation_type: string
          created_at?: string | null
          id?: string
          notes?: string | null
          offering_id?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          consultation_type?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          offering_id?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_meetings_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "investment_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_offerings: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          firm: string
          id: string
          lockup_period: string | null
          minimum_investment: string
          name: string
          performance: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          firm: string
          id?: string
          lockup_period?: string | null
          minimum_investment: string
          name: string
          performance?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          firm?: string
          id?: string
          lockup_period?: string | null
          minimum_investment?: string
          name?: string
          performance?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_offerings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "investment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_strategies: {
        Row: {
          allocation: string | null
          benchmark: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          featured: boolean | null
          id: string
          is_global: boolean | null
          is_visible: boolean | null
          manager: string | null
          minimum_investment: string | null
          name: string
          performance: string | null
          premium_locked: boolean | null
          risk_level: string | null
          sort_order: number | null
          strategy_type: string
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
          visibility_rules: Json | null
        }
        Insert: {
          allocation?: string | null
          benchmark?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_global?: boolean | null
          is_visible?: boolean | null
          manager?: string | null
          minimum_investment?: string | null
          name: string
          performance?: string | null
          premium_locked?: boolean | null
          risk_level?: string | null
          sort_order?: number | null
          strategy_type: string
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
          visibility_rules?: Json | null
        }
        Update: {
          allocation?: string | null
          benchmark?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_global?: boolean | null
          is_visible?: boolean | null
          manager?: string | null
          minimum_investment?: string | null
          name?: string
          performance?: string | null
          premium_locked?: boolean | null
          risk_level?: string | null
          sort_order?: number | null
          strategy_type?: string
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
          visibility_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_strategies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      med_adherence: {
        Row: {
          created_at: string
          family_member_id: string | null
          id: string
          medication_id: string
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          taken_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_member_id?: string | null
          id?: string
          medication_id: string
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          taken_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_member_id?: string | null
          id?: string
          medication_id?: string
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          taken_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_adherence_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "med_adherence_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      med_interactions: {
        Row: {
          created_at: string
          description: string
          id: string
          severity: string | null
          source_med_id: string
          target_rxnorm_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          severity?: string | null
          source_med_id: string
          target_rxnorm_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          severity?: string | null
          source_med_id?: string
          target_rxnorm_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_interactions_source_med_id_fkey"
            columns: ["source_med_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage_form: string | null
          dose: string | null
          dose_reminders: boolean | null
          end_date: string | null
          family_id: string | null
          frequency: string
          has_warning: boolean | null
          hsa_eligible: boolean | null
          id: string
          member_id: string | null
          name: string
          notes: string | null
          pharmacy: string | null
          prescribing_provider: string | null
          prescription_number: string | null
          refill_reminders: boolean | null
          rxnorm_id: string | null
          schedule: Json | null
          start_date: string | null
          strength: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage_form?: string | null
          dose?: string | null
          dose_reminders?: boolean | null
          end_date?: string | null
          family_id?: string | null
          frequency: string
          has_warning?: boolean | null
          hsa_eligible?: boolean | null
          id?: string
          member_id?: string | null
          name: string
          notes?: string | null
          pharmacy?: string | null
          prescribing_provider?: string | null
          prescription_number?: string | null
          refill_reminders?: boolean | null
          rxnorm_id?: string | null
          schedule?: Json | null
          start_date?: string | null
          strength?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage_form?: string | null
          dose?: string | null
          dose_reminders?: boolean | null
          end_date?: string | null
          family_id?: string | null
          frequency?: string
          has_warning?: boolean | null
          hsa_eligible?: boolean | null
          id?: string
          member_id?: string | null
          name?: string
          notes?: string | null
          pharmacy?: string | null
          prescribing_provider?: string | null
          prescription_number?: string | null
          refill_reminders?: boolean | null
          rxnorm_id?: string | null
          schedule?: Json | null
          start_date?: string | null
          strength?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_prescribing_provider_fkey"
            columns: ["prescribing_provider"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      member_providers: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          member_id: string
          provider_id: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          member_id: string
          provider_id: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          member_id?: string
          provider_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_providers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_providers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      methylation_markers: {
        Row: {
          category: string
          created_at: string
          date: string
          id: string
          name: string
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          id?: string
          name: string
          unit: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          id?: string
          name?: string
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      metric_entries: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          metric_id: string
          notes: string | null
          source: string | null
          timestamp: string | null
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          metric_id: string
          notes?: string | null
          source?: string | null
          timestamp?: string | null
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          metric_id?: string
          notes?: string | null
          source?: string | null
          timestamp?: string | null
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_entries_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_catalog: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          ideal_high: number | null
          ideal_low: number | null
          label: string
          unit: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          ideal_high?: number | null
          ideal_low?: number | null
          label: string
          unit: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ideal_high?: number | null
          ideal_low?: number | null
          label?: string
          unit?: string
        }
        Relationships: []
      }
      model_portfolios: {
        Row: {
          asset_allocation: string | null
          badge_color: string | null
          badge_text: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          provider: string
          return_rate: string | null
          risk_level: string | null
          series_type: string | null
          tax_status: string | null
          updated_at: string
        }
        Insert: {
          asset_allocation?: string | null
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          return_rate?: string | null
          risk_level?: string | null
          series_type?: string | null
          tax_status?: string | null
          updated_at?: string
        }
        Update: {
          asset_allocation?: string | null
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          return_rate?: string | null
          risk_level?: string | null
          series_type?: string | null
          tax_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          click_action: string | null
          created_at: string
          family_id: string | null
          id: string
          member_id: string | null
          read: boolean | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          click_action?: string | null
          created_at?: string
          family_id?: string | null
          id?: string
          member_id?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          click_action?: string | null
          created_at?: string
          family_id?: string | null
          id?: string
          member_id?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_entries: {
        Row: {
          calories: number
          carbs: number | null
          created_at: string
          date: string
          fat: number | null
          fiber: number | null
          food_item: string
          id: string
          meal_type: string
          notes: string | null
          protein: number | null
          serving_size: string | null
          sugar: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number
          carbs?: number | null
          created_at?: string
          date?: string
          fat?: number | null
          fiber?: number | null
          food_item: string
          id?: string
          meal_type: string
          notes?: string | null
          protein?: number | null
          serving_size?: string | null
          sugar?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number | null
          created_at?: string
          date?: string
          fat?: number | null
          fiber?: number | null
          food_item?: string
          id?: string
          meal_type?: string
          notes?: string | null
          protein?: number | null
          serving_size?: string | null
          sugar?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_goals: {
        Row: {
          created_at: string
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_fiber: number | null
          daily_protein: number
          daily_water_glasses: number | null
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_fiber?: number | null
          daily_protein?: number
          daily_water_glasses?: number | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_fiber?: number | null
          daily_protein?: number
          daily_water_glasses?: number | null
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_checklists: {
        Row: {
          checklist_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_template: boolean | null
          items: Json
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          checklist_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          items?: Json
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          checklist_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          items?: Json
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_checklists_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_workflow_steps: {
        Row: {
          application_id: string
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          step_name: string
          step_order: number
        }
        Insert: {
          application_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          step_name: string
          step_order: number
        }
        Update: {
          application_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_workflow_steps_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "tenant_onboarding_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      other_assets: {
        Row: {
          created_at: string
          id: string
          name: string
          owner: string
          type: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner?: string
          type: string
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner?: string
          type?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      payout_notifications: {
        Row: {
          created_at: string
          email_sent: boolean | null
          id: string
          notification_type: string
          payout_id: string
          push_sent: boolean | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email_sent?: boolean | null
          id?: string
          notification_type: string
          payout_id: string
          push_sent?: boolean | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email_sent?: boolean | null
          id?: string
          notification_type?: string
          payout_id?: string
          push_sent?: boolean | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_notifications_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "referral_payouts"
            referencedColumns: ["id"]
          },
        ]
      }
      physicians: {
        Row: {
          created_at: string
          email: string | null
          facility: string | null
          id: string
          last_visit: string | null
          name: string
          notes: string | null
          phone: string | null
          specialty: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          facility?: string | null
          id?: string
          last_visit?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          specialty?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          facility?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_expenses: {
        Row: {
          amount: number
          created_at: string
          expense_type: string
          id: string
          name: string
          owner: string
          period: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          expense_type: string
          id?: string
          name: string
          owner: string
          period: string
          plan_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          expense_type?: string
          id?: string
          name?: string
          owner?: string
          period?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_expenses_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_income: {
        Row: {
          amount: number
          created_at: string
          frequency: string
          id: string
          is_passive: boolean
          plan_id: string
          source: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          frequency?: string
          id?: string
          is_passive?: boolean
          plan_id: string
          source: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          frequency?: string
          id?: string
          is_passive?: boolean
          plan_id?: string
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_income_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_insurance: {
        Row: {
          coverage: number
          created_at: string
          id: string
          insurance_type: string
          plan_id: string
          premium: number
          provider: string
          updated_at: string
        }
        Insert: {
          coverage?: number
          created_at?: string
          id?: string
          insurance_type: string
          plan_id: string
          premium?: number
          provider: string
          updated_at?: string
        }
        Update: {
          coverage?: number
          created_at?: string
          id?: string
          insurance_type?: string
          plan_id?: string
          premium?: number
          provider?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_insurance_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_savings: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          frequency: string
          id: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          account_id: string
          amount?: number
          created_at?: string
          frequency?: string
          id?: string
          plan_id: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          frequency?: string
          id?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_savings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_savings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "financial_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      playbooks: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean | null
          playbook_type: string
          tags: string[] | null
          target_audience: string[] | null
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          playbook_type: string
          tags?: string[] | null
          target_audience?: string[] | null
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          playbook_type?: string
          tags?: string[] | null
          target_audience?: string[] | null
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playbooks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          doctor: string | null
          dosage: string
          frequency: string
          id: string
          name: string
          next_refill: string
          notes: string | null
          pharmacy: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor?: string | null
          dosage: string
          frequency: string
          id?: string
          name: string
          next_refill: string
          notes?: string | null
          pharmacy?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor?: string | null
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          next_refill?: string
          notes?: string | null
          pharmacy?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      private_equity_accounts: {
        Row: {
          created_at: string
          entity_name: string
          entity_type: string
          id: string
          ownership_percentage: number | null
          updated_at: string
          user_id: string
          valuation: number
        }
        Insert: {
          created_at?: string
          entity_name: string
          entity_type: string
          id?: string
          ownership_percentage?: number | null
          updated_at?: string
          user_id: string
          valuation?: number
        }
        Update: {
          created_at?: string
          entity_name?: string
          entity_type?: string
          id?: string
          ownership_percentage?: number | null
          updated_at?: string
          user_id?: string
          valuation?: number
        }
        Relationships: []
      }
      professionals: {
        Row: {
          address: string | null
          certifications: string[] | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          rating: number | null
          specialties: string[] | null
          tenant_id: string
          type: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          certifications?: string[] | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          tenant_id: string
          type?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          certifications?: string[] | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          tenant_id?: string
          type?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          advisor_id: string | null
          avatar_url: string | null
          client_segment: string | null
          created_at: string | null
          date_of_birth: string | null
          date_of_birth_date: string | null
          display_name: string | null
          email: string | null
          email_opt_in: boolean | null
          first_name: string | null
          gender: string | null
          ghl_contact_id: string | null
          id: string
          investor_type: string | null
          last_active_at: string | null
          last_login_at: string | null
          last_name: string | null
          lead_stage: string | null
          marital_status: string | null
          middle_name: string | null
          permissions: string[] | null
          phone: string | null
          recruited_at: string | null
          referring_advisor_id: string | null
          role: string | null
          sms_opt_in: boolean | null
          suffix: string | null
          tenant_id: string | null
          title: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          advisor_id?: string | null
          avatar_url?: string | null
          client_segment?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          date_of_birth_date?: string | null
          display_name?: string | null
          email?: string | null
          email_opt_in?: boolean | null
          first_name?: string | null
          gender?: string | null
          ghl_contact_id?: string | null
          id: string
          investor_type?: string | null
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          lead_stage?: string | null
          marital_status?: string | null
          middle_name?: string | null
          permissions?: string[] | null
          phone?: string | null
          recruited_at?: string | null
          referring_advisor_id?: string | null
          role?: string | null
          sms_opt_in?: boolean | null
          suffix?: string | null
          tenant_id?: string | null
          title?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          advisor_id?: string | null
          avatar_url?: string | null
          client_segment?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          date_of_birth_date?: string | null
          display_name?: string | null
          email?: string | null
          email_opt_in?: boolean | null
          first_name?: string | null
          gender?: string | null
          ghl_contact_id?: string | null
          id?: string
          investor_type?: string | null
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          lead_stage?: string | null
          marital_status?: string | null
          middle_name?: string | null
          permissions?: string[] | null
          phone?: string | null
          recruited_at?: string | null
          referring_advisor_id?: string | null
          role?: string | null
          sms_opt_in?: boolean | null
          suffix?: string | null
          tenant_id?: string | null
          title?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          created_at: string
          current_value: number
          id: string
          name: string
          notes: string | null
          original_cost: number
          owner: string
          ownership: string
          purchase_date: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          current_value?: number
          id?: string
          name: string
          notes?: string | null
          original_cost?: number
          owner: string
          ownership: string
          purchase_date: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          current_value?: number
          id?: string
          name?: string
          notes?: string | null
          original_cost?: number
          owner?: string
          ownership?: string
          purchase_date?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_business_details: {
        Row: {
          annual_expenses: number
          company_name: string
          created_at: string
          id: string
          property_id: string
          updated_at: string
          usage_type: string
        }
        Insert: {
          annual_expenses?: number
          company_name: string
          created_at?: string
          id?: string
          property_id: string
          updated_at?: string
          usage_type: string
        }
        Update: {
          annual_expenses?: number
          company_name?: string
          created_at?: string
          id?: string
          property_id?: string
          updated_at?: string
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_business_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_improvements: {
        Row: {
          cost: number
          created_at: string
          date: string
          description: string
          id: string
          property_id: string
        }
        Insert: {
          cost?: number
          created_at?: string
          date: string
          description: string
          id?: string
          property_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_improvements_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_rental_details: {
        Row: {
          created_at: string
          id: string
          lease_end: string | null
          monthly_expenses: number
          monthly_income: number
          occupied_since: string | null
          property_id: string
          tenant_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lease_end?: string | null
          monthly_expenses?: number
          monthly_income?: number
          occupied_since?: string | null
          property_id: string
          tenant_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lease_end?: string | null
          monthly_expenses?: number
          monthly_income?: number
          occupied_since?: string | null
          property_id?: string
          tenant_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_rental_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_valuations: {
        Row: {
          confidence: string | null
          created_at: string
          estimated_value: number
          id: string
          last_updated: string
          property_id: string
          source: string
        }
        Insert: {
          confidence?: string | null
          created_at?: string
          estimated_value: number
          id?: string
          last_updated?: string
          property_id: string
          source: string
        }
        Update: {
          confidence?: string | null
          created_at?: string
          estimated_value?: number
          id?: string
          last_updated?: string
          property_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_valuations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          member_id: string
          provider_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          member_id: string
          provider_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          member_id?: string
          provider_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_reviews_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      public_stocks: {
        Row: {
          company_name: string
          created_at: string
          id: string
          number_of_shares: number
          price_per_share: number
          ticker_symbol: string
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          number_of_shares?: number
          price_per_share?: number
          ticker_symbol: string
          total_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          number_of_shares?: number
          price_per_share?: number
          ticker_symbol?: string
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      query_performance_logs: {
        Row: {
          cache_hit: boolean | null
          created_at: string
          execution_time_ms: number
          function_name: string | null
          id: string
          index_usage: Json | null
          operation_type: string
          query_hash: string
          query_plan: Json | null
          rows_affected: number | null
          slow_query_threshold_exceeded: boolean | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          created_at?: string
          execution_time_ms: number
          function_name?: string | null
          id?: string
          index_usage?: Json | null
          operation_type: string
          query_hash: string
          query_plan?: Json | null
          rows_affected?: number | null
          slow_query_threshold_exceeded?: boolean | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          created_at?: string
          execution_time_ms?: number
          function_name?: string | null
          id?: string
          index_usage?: Json | null
          operation_type?: string
          query_hash?: string
          query_plan?: Json | null
          rows_affected?: number | null
          slow_query_threshold_exceeded?: boolean | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      real_estate_properties: {
        Row: {
          address: string
          created_at: string
          current_market_value: number
          id: string
          name: string
          property_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          current_market_value?: number
          id?: string
          name: string
          property_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          current_market_value?: number
          id?: string
          name?: string
          property_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_payouts: {
        Row: {
          advisor_override_id: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payout_type: string
          referral_id: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          advisor_override_id?: string | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_type: string
          referral_id?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          advisor_override_id?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_type?: string
          referral_id?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_payouts_advisor_override_id_fkey"
            columns: ["advisor_override_id"]
            isOneToOne: false
            referencedRelation: "advisor_overrides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_payouts_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          referral_id: string
          reward_type: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          referral_id: string
          reward_type: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          referral_id?: string
          reward_type?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          activated_at: string | null
          campaign_data: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          notes: string | null
          paid_at: string | null
          referee_id: string | null
          referral_code: string
          referral_type: string
          referrer_id: string
          reward_amount: number | null
          reward_type: string | null
          status: string
          tenant_id: string
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          activated_at?: string | null
          campaign_data?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          referee_id?: string | null
          referral_code: string
          referral_type: string
          referrer_id: string
          reward_amount?: number | null
          reward_type?: string | null
          status?: string
          tenant_id: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          activated_at?: string | null
          campaign_data?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          referee_id?: string | null
          referral_code?: string
          referral_type?: string
          referrer_id?: string
          reward_amount?: number | null
          reward_type?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      retirement_plans: {
        Row: {
          balance: number
          contribution_amount: number | null
          created_at: string
          id: string
          plan_type: string
          provider: string
          source: string
          updated_at: string
          user_id: string
          vesting_schedule: string | null
        }
        Insert: {
          balance?: number
          contribution_amount?: number | null
          created_at?: string
          id?: string
          plan_type: string
          provider: string
          source: string
          updated_at?: string
          user_id: string
          vesting_schedule?: string | null
        }
        Update: {
          balance?: number
          contribution_amount?: number | null
          created_at?: string
          id?: string
          plan_type?: string
          provider?: string
          source?: string
          updated_at?: string
          user_id?: string
          vesting_schedule?: string | null
        }
        Relationships: []
      }
      shared_documents: {
        Row: {
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          permission_level: string
          professional_id: string
          shared_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          professional_id: string
          shared_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          professional_id?: string
          shared_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_documents_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      social_security_estimates: {
        Row: {
          age_62_estimate: number
          age_67_estimate: number
          age_70_estimate: number
          created_at: string
          id: string
          member_id: string
          updated_at: string
        }
        Insert: {
          age_62_estimate?: number
          age_67_estimate?: number
          age_70_estimate?: number
          created_at?: string
          id?: string
          member_id: string
          updated_at?: string
        }
        Update: {
          age_62_estimate?: number
          age_67_estimate?: number
          age_70_estimate?: number
          created_at?: string
          id?: string
          member_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_security_estimates_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "social_security_members"
            referencedColumns: ["id"]
          },
        ]
      }
      social_security_members: {
        Row: {
          account_linked: boolean
          created_at: string
          id: string
          name: string
          preferred_retirement_age: number
          relationship: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_linked?: boolean
          created_at?: string
          id?: string
          name: string
          preferred_retirement_age?: number
          relationship: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_linked?: boolean
          created_at?: string
          id?: string
          name?: string
          preferred_retirement_age?: number
          relationship?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategy_comparisons: {
        Row: {
          created_at: string | null
          id: string
          strategies: string[]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          strategies: string[]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          strategies?: string[]
          user_id?: string
        }
        Relationships: []
      }
      strategy_educational_content: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          strategy_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          strategy_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          strategy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_educational_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "educational_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_educational_content_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "investment_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_engagement_tracking: {
        Row: {
          event_type: string
          id: string
          metadata: Json | null
          occurred_at: string | null
          strategy_id: string
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          strategy_id: string
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          strategy_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_engagement_tracking_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "investment_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_education: {
        Row: {
          chapter_snippet: string | null
          created_at: string
          dosing_guidance: string | null
          dsld_id: string | null
          evidence_summary: string | null
          id: string
          rxnorm_id: string | null
          supplement_name: string
          tier: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          chapter_snippet?: string | null
          created_at?: string
          dosing_guidance?: string | null
          dsld_id?: string | null
          evidence_summary?: string | null
          id?: string
          rxnorm_id?: string | null
          supplement_name: string
          tier?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          chapter_snippet?: string | null
          created_at?: string
          dosing_guidance?: string | null
          dsld_id?: string | null
          evidence_summary?: string | null
          id?: string
          rxnorm_id?: string | null
          supplement_name?: string
          tier?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      supplement_tiers: {
        Row: {
          created_at: string
          dsld_id: string | null
          evidence_grade: string | null
          id: string
          name: string
          rxnorm_id: string | null
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dsld_id?: string | null
          evidence_grade?: string | null
          id?: string
          name: string
          rxnorm_id?: string | null
          tier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dsld_id?: string | null
          evidence_grade?: string | null
          id?: string
          name?: string
          rxnorm_id?: string | null
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplements: {
        Row: {
          created_at: string
          dosage: string
          dsld_id: string | null
          evidence_grade: string | null
          family_id: string | null
          frequency: string
          has_warning: boolean | null
          id: string
          intake_reminders: boolean | null
          last_refill: string | null
          member_id: string | null
          name: string
          notes: string | null
          pill_count: number | null
          price: number | null
          purpose: string | null
          quality_cert: string | null
          raw_refs: Json | null
          refill_reminders: boolean | null
          rxnorm_id: string | null
          schedule: Json | null
          tier: string | null
          updated_at: string
          user_id: string
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          dosage: string
          dsld_id?: string | null
          evidence_grade?: string | null
          family_id?: string | null
          frequency: string
          has_warning?: boolean | null
          id?: string
          intake_reminders?: boolean | null
          last_refill?: string | null
          member_id?: string | null
          name: string
          notes?: string | null
          pill_count?: number | null
          price?: number | null
          purpose?: string | null
          quality_cert?: string | null
          raw_refs?: Json | null
          refill_reminders?: boolean | null
          rxnorm_id?: string | null
          schedule?: Json | null
          tier?: string | null
          updated_at?: string
          user_id: string
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          dosage?: string
          dsld_id?: string | null
          evidence_grade?: string | null
          family_id?: string | null
          frequency?: string
          has_warning?: boolean | null
          id?: string
          intake_reminders?: boolean | null
          last_refill?: string | null
          member_id?: string | null
          name?: string
          notes?: string | null
          pill_count?: number | null
          price?: number | null
          purpose?: string | null
          quality_cert?: string | null
          raw_refs?: Json | null
          refill_reminders?: boolean | null
          rxnorm_id?: string | null
          schedule?: Json | null
          tier?: string | null
          updated_at?: string
          user_id?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplements_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_planning_consultations: {
        Row: {
          advisor_notes: string | null
          consultation_type: string
          created_at: string
          id: string
          notes: string | null
          preferred_date: string | null
          preferred_time: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_notes?: string | null
          consultation_type: string
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_notes?: string | null
          consultation_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_planning_interests: {
        Row: {
          asset_name: string
          created_at: string
          id: string
          interest_type: string
          notes: string | null
          user_id: string
        }
        Insert: {
          asset_name: string
          created_at?: string
          id?: string
          interest_type: string
          notes?: string | null
          user_id: string
        }
        Update: {
          asset_name?: string
          created_at?: string
          id?: string
          interest_type?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tax_planning_strategies: {
        Row: {
          created_at: string
          description: string | null
          estimated_savings: number | null
          id: string
          implementation_date: string | null
          notes: string | null
          status: string
          strategy_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_savings?: number | null
          id?: string
          implementation_date?: string | null
          notes?: string | null
          status?: string
          strategy_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_savings?: number | null
          id?: string
          implementation_date?: string | null
          notes?: string | null
          status?: string
          strategy_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tenant_admin_credentials: {
        Row: {
          application_id: string
          created_at: string
          expires_at: string
          id: string
          setup_token: string
          temp_email: string
          temp_password: string
          tenant_id: string
          used_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          expires_at?: string
          id?: string
          setup_token: string
          temp_email: string
          temp_password: string
          tenant_id: string
          used_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          setup_token?: string
          temp_email?: string
          temp_password?: string
          tenant_id?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_admin_credentials_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "tenant_onboarding_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_admin_credentials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_feature_flags: {
        Row: {
          created_at: string
          enabled: boolean
          feature_name: string
          id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_name: string
          id?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_name?: string
          id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenant_licenses: {
        Row: {
          agreement_url: string | null
          created_at: string | null
          end_date: string | null
          id: string
          license_type: string | null
          start_date: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          agreement_url?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          license_type?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agreement_url?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          license_type?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_licenses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_onboarding_applications: {
        Row: {
          admin_credentials_sent: boolean | null
          applicant_email: string
          applicant_name: string
          application_data: Json | null
          billing_setup_complete: boolean | null
          company_name: string
          created_at: string
          esign_status: string | null
          esign_url: string | null
          franchise_type: string
          id: string
          phone: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          stripe_customer_id: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          admin_credentials_sent?: boolean | null
          applicant_email: string
          applicant_name: string
          application_data?: Json | null
          billing_setup_complete?: boolean | null
          company_name: string
          created_at?: string
          esign_status?: string | null
          esign_url?: string | null
          franchise_type: string
          id?: string
          phone?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          stripe_customer_id?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_credentials_sent?: boolean | null
          applicant_email?: string
          applicant_name?: string
          application_data?: Json | null
          billing_setup_complete?: boolean | null
          company_name?: string
          created_at?: string
          esign_status?: string | null
          esign_url?: string | null
          franchise_type?: string
          id?: string
          phone?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          stripe_customer_id?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_onboarding_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_resources: {
        Row: {
          content_type: string
          created_at: string
          created_by: string | null
          description: string | null
          file_path: string | null
          id: string
          is_global: boolean | null
          is_premium: boolean | null
          is_visible: boolean | null
          resource_url: string | null
          segments: string[] | null
          sort_order: number | null
          tags: string[] | null
          tenant_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          is_global?: boolean | null
          is_premium?: boolean | null
          is_visible?: boolean | null
          resource_url?: string | null
          segments?: string[] | null
          sort_order?: number | null
          tags?: string[] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          is_global?: boolean | null
          is_premium?: boolean | null
          is_visible?: boolean | null
          resource_url?: string | null
          segments?: string[] | null
          sort_order?: number | null
          tags?: string[] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenant_settings: {
        Row: {
          branding_config: Json | null
          created_at: string | null
          custom_css: string | null
          email_templates: Json | null
          feature_flags: Json | null
          id: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          branding_config?: Json | null
          created_at?: string | null
          custom_css?: string | null
          email_templates?: Json | null
          feature_flags?: Json | null
          id?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          branding_config?: Json | null
          created_at?: string | null
          custom_css?: string | null
          email_templates?: Json | null
          feature_flags?: Json | null
          id?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          billing_status: string | null
          brand_logo_url: string | null
          color_palette: Json | null
          created_at: string | null
          domain: string | null
          franchisee_status: string | null
          id: string
          name: string
          owner_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          billing_status?: string | null
          brand_logo_url?: string | null
          color_palette?: Json | null
          created_at?: string | null
          domain?: string | null
          franchisee_status?: string | null
          id?: string
          name: string
          owner_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_status?: string | null
          brand_logo_url?: string | null
          color_palette?: Json | null
          created_at?: string | null
          domain?: string | null
          franchisee_status?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tracked_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          source: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          source?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          source?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracked_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          is_required: boolean | null
          module_type: string
          sort_order: number | null
          tags: string[] | null
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          is_required?: boolean | null
          module_type: string
          sort_order?: number | null
          tags?: string[] | null
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          is_required?: boolean | null
          module_type?: string
          sort_order?: number | null
          tags?: string[] | null
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_modules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          ach_credit_status: string | null
          ach_debit_status: string | null
          ach_return_code: string | null
          amount: number
          created_at: string
          description: string | null
          estimated_completion_date: string | null
          failure_reason: string | null
          from_account_id: string
          funds_held_at: string | null
          id: string
          processed_at: string | null
          reference_number: string
          status: string
          stripe_credit_payment_intent_id: string | null
          stripe_debit_payment_intent_id: string | null
          to_account_id: string
          transfer_fee: number
          transfer_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ach_credit_status?: string | null
          ach_debit_status?: string | null
          ach_return_code?: string | null
          amount: number
          created_at?: string
          description?: string | null
          estimated_completion_date?: string | null
          failure_reason?: string | null
          from_account_id: string
          funds_held_at?: string | null
          id?: string
          processed_at?: string | null
          reference_number?: string
          status?: string
          stripe_credit_payment_intent_id?: string | null
          stripe_debit_payment_intent_id?: string | null
          to_account_id: string
          transfer_fee?: number
          transfer_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ach_credit_status?: string | null
          ach_debit_status?: string | null
          ach_return_code?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          estimated_completion_date?: string | null
          failure_reason?: string | null
          from_account_id?: string
          funds_held_at?: string | null
          id?: string
          processed_at?: string | null
          reference_number?: string
          status?: string
          stripe_credit_payment_intent_id?: string | null
          stripe_debit_payment_intent_id?: string | null
          to_account_id?: string
          transfer_fee?: number
          transfer_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transfers_from_account"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transfers_to_account"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_additional_info: {
        Row: {
          citizenship_status: string | null
          created_at: string | null
          employment_status: string | null
          id: string
          income_range: string | null
          investing_objective: string | null
          investor_type: string | null
          ira_contribution: boolean | null
          net_worth: string | null
          ssn: string | null
          tax_bracket_capital: string | null
          tax_bracket_income: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          citizenship_status?: string | null
          created_at?: string | null
          employment_status?: string | null
          id?: string
          income_range?: string | null
          investing_objective?: string | null
          investor_type?: string | null
          ira_contribution?: boolean | null
          net_worth?: string | null
          ssn?: string | null
          tax_bracket_capital?: string | null
          tax_bracket_income?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          citizenship_status?: string | null
          created_at?: string | null
          employment_status?: string | null
          id?: string
          income_range?: string | null
          investing_objective?: string | null
          investor_type?: string | null
          ira_contribution?: boolean | null
          net_worth?: string | null
          ssn?: string | null
          tax_bracket_capital?: string | null
          tax_bracket_income?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_affiliations: {
        Row: {
          awm_employee: boolean | null
          broker_dealer: boolean | null
          created_at: string | null
          custodian: boolean | null
          family_broker_dealer: boolean | null
          id: string
          public_company: boolean | null
          stock_exchange_or_finra: boolean | null
          updated_at: string | null
          us_politically_exposed: boolean | null
          user_id: string
        }
        Insert: {
          awm_employee?: boolean | null
          broker_dealer?: boolean | null
          created_at?: string | null
          custodian?: boolean | null
          family_broker_dealer?: boolean | null
          id?: string
          public_company?: boolean | null
          stock_exchange_or_finra?: boolean | null
          updated_at?: string | null
          us_politically_exposed?: boolean | null
          user_id: string
        }
        Update: {
          awm_employee?: boolean | null
          broker_dealer?: boolean | null
          created_at?: string | null
          custodian?: boolean | null
          family_broker_dealer?: boolean | null
          id?: string
          public_company?: boolean | null
          stock_exchange_or_finra?: boolean | null
          updated_at?: string | null
          us_politically_exposed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_assets: {
        Row: {
          created_at: string
          id: string
          name: string
          owner: string
          type: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner: string
          type: string
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner?: string
          type?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      user_beneficiaries: {
        Row: {
          address: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          relationship: string
          ssn: string | null
          state: string | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          relationship: string
          ssn?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          relationship?: string
          ssn?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_checklist_progress: {
        Row: {
          checklist_id: string | null
          completed_at: string | null
          completed_items: Json | null
          created_at: string
          id: string
          started_at: string | null
          status: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_id?: string | null
          completed_at?: string | null
          completed_items?: Json | null
          created_at?: string
          id?: string
          started_at?: string | null
          status: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_id?: string | null
          completed_at?: string | null
          completed_items?: Json | null
          created_at?: string
          id?: string
          started_at?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checklist_progress_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "onboarding_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_checklist_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contact_info: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_content_interactions: {
        Row: {
          accessed_at: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          interaction_type: string | null
          user_id: string
        }
        Insert: {
          accessed_at?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          interaction_type?: string | null
          user_id: string
        }
        Update: {
          accessed_at?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          interaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          last_accessed_at: string | null
          lesson_id: string | null
          progress_percentage: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_downloads: {
        Row: {
          created_at: string | null
          downloaded_at: string | null
          id: string
          resource_id: string
          resource_name: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          downloaded_at?: string | null
          id?: string
          resource_id: string
          resource_name?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          downloaded_at?: string | null
          id?: string
          resource_id?: string
          resource_name?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_enabled_metrics: {
        Row: {
          created_at: string | null
          is_pinned: boolean | null
          metric_id: string
          threshold_high: number | null
          threshold_low: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_pinned?: boolean | null
          metric_id: string
          threshold_high?: number | null
          threshold_low?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_pinned?: boolean | null
          metric_id?: string
          threshold_high?: number | null
          threshold_low?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_enabled_metrics_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          ghl_synced: boolean | null
          id: string
          user_id: string | null
          utm_data: Json | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          ghl_synced?: boolean | null
          id?: string
          user_id?: string | null
          utm_data?: Json | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          ghl_synced?: boolean | null
          id?: string
          user_id?: string | null
          utm_data?: Json | null
        }
        Relationships: []
      }
      user_financial_snapshots: {
        Row: {
          created_at: string
          id: string
          net_worth: number
          snapshot_date: string
          total_assets: number
          total_liabilities: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          net_worth?: number
          snapshot_date?: string
          total_assets?: number
          total_liabilities?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          net_worth?: number
          snapshot_date?: string
          total_assets?: number
          total_liabilities?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_investment_interests: {
        Row: {
          created_at: string | null
          id: string
          offering_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          offering_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          offering_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_investment_interests_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "investment_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_liabilities: {
        Row: {
          created_at: string
          current_balance: number
          end_date: string | null
          id: string
          interest_rate: number | null
          monthly_payment: number | null
          name: string
          original_loan_amount: number | null
          start_date: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance?: number
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          name: string
          original_loan_amount?: number | null
          start_date?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          name?: string
          original_loan_amount?: number | null
          start_date?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          step_name: string
          tenant_id: string | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          step_name: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          step_name?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_otp_codes: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          is_used: boolean
          otp_code: string
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          is_used?: boolean
          otp_code: string
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          otp_code?: string
          user_id?: string
        }
        Relationships: []
      }
      user_portfolio_assignments: {
        Row: {
          assigned_accounts: number | null
          assignment_date: string
          created_at: string
          id: string
          is_active: boolean | null
          model_portfolio_id: string
          trading_groups: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_accounts?: number | null
          assignment_date?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          model_portfolio_id: string
          trading_groups?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_accounts?: number | null
          assignment_date?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          model_portfolio_id?: string
          trading_groups?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolio_assignments_model_portfolio_id_fkey"
            columns: ["model_portfolio_id"]
            isOneToOne: false
            referencedRelation: "model_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_content: {
        Row: {
          content_id: string
          content_type: string
          id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          id?: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_training_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          id: string
          module_id: string | null
          started_at: string | null
          status: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          module_id?: string | null
          started_at?: string | null
          status: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          module_id?: string | null
          started_at?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_training_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trust_documents: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          trust_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          trust_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          trust_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_trust_documents_trust_id_fkey"
            columns: ["trust_id"]
            isOneToOne: false
            referencedRelation: "user_trusts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trusts: {
        Row: {
          address: string | null
          assets_value: string | null
          beneficiary_names: string | null
          city: string | null
          country: string | null
          created_at: string | null
          document_type: string | null
          email_address: string | null
          establishment_date: string | null
          id: string
          phone_number: string | null
          purpose: string | null
          state: string | null
          trust_name: string
          trust_type: string | null
          trustee_name: string | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          assets_value?: string | null
          beneficiary_names?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_type?: string | null
          email_address?: string | null
          establishment_date?: string | null
          id?: string
          phone_number?: string | null
          purpose?: string | null
          state?: string | null
          trust_name: string
          trust_type?: string | null
          trustee_name?: string | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          assets_value?: string | null
          beneficiary_names?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_type?: string | null
          email_address?: string | null
          establishment_date?: string | null
          id?: string
          phone_number?: string | null
          purpose?: string | null
          state?: string | null
          trust_name?: string
          trust_type?: string | null
          trustee_name?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          created_at: string
          created_by: string | null
          events: string[]
          headers: Json | null
          id: string
          is_active: boolean | null
          name: string
          retry_attempts: number | null
          secret_key: string | null
          status: string | null
          tenant_id: string | null
          timeout_seconds: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          retry_attempts?: number | null
          secret_key?: string | null
          status?: string | null
          tenant_id?: string | null
          timeout_seconds?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          retry_attempts?: number | null
          secret_key?: string | null
          status?: string | null
          tenant_id?: string | null
          timeout_seconds?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          attempt_number: number | null
          created_at: string
          delivered_at: string | null
          error_message: string | null
          event_id: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          status: string | null
          tenant_id: string | null
          webhook_config_id: string | null
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_id?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          status?: string | null
          tenant_id?: string | null
          webhook_config_id?: string | null
        }
        Update: {
          attempt_number?: number | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_id?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          status?: string | null
          tenant_id?: string | null
          webhook_config_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "analytics_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_registrations: {
        Row: {
          attendance_duration: number | null
          attended: boolean | null
          created_at: string | null
          id: string
          registered_at: string | null
          updated_at: string | null
          user_id: string
          webinar_id: string
          webinar_title: string | null
        }
        Insert: {
          attendance_duration?: number | null
          attended?: boolean | null
          created_at?: string | null
          id?: string
          registered_at?: string | null
          updated_at?: string | null
          user_id: string
          webinar_id: string
          webinar_title?: string | null
        }
        Update: {
          attendance_duration?: number | null
          attended?: boolean | null
          created_at?: string | null
          id?: string
          registered_at?: string | null
          updated_at?: string | null
          user_id?: string
          webinar_id?: string
          webinar_title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      audit_summary: {
        Row: {
          audit_date: string | null
          event_type: string | null
          operation_count: number | null
          table_name: string | null
          unique_tenants: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      backup_summary: {
        Row: {
          avg_backup_duration_seconds: number | null
          bucket_name: string | null
          failed_backups: number | null
          last_successful_backup: string | null
          successful_backups: number | null
          total_files_backed_up: number | null
          total_operations: number | null
          total_size_backed_up: number | null
        }
        Relationships: []
      }
      critical_table_performance: {
        Row: {
          avg_execution_time_ms: number | null
          cache_hit_count: number | null
          cache_hit_rate_percent: number | null
          hour_bucket: string | null
          max_execution_time_ms: number | null
          operation_type: string | null
          query_count: number | null
          slow_query_count: number | null
          table_name: string | null
        }
        Relationships: []
      }
      query_performance_summary: {
        Row: {
          avg_execution_time_ms: number | null
          hour_bucket: string | null
          max_execution_time_ms: number | null
          min_execution_time_ms: number | null
          operation_type: string | null
          p95_execution_time_ms: number | null
          query_count: number | null
          slow_query_count: number | null
          table_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_referral: {
        Args: { p_referee_id: string }
        Returns: boolean
      }
      calculate_advisor_overrides: {
        Args: { p_period_start: string; p_period_end: string }
        Returns: {
          override_id: string
          referring_advisor_id: string
          recruited_advisor_id: string
          production_amount: number
          override_amount: number
          updated: boolean
        }[]
      }
      calculate_provider_rating: {
        Args: { provider_id: string }
        Returns: number
      }
      cleanup_expired_otp_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_diagnostic_runs: {
        Args: { p_retention_days?: number }
        Returns: number
      }
      create_default_onboarding_steps: {
        Args: { app_id: string }
        Returns: undefined
      }
      create_franchise_referral_payout: {
        Args: {
          p_franchise_referral_id: string
          p_payout_type: string
          p_amount: number
          p_period_start?: string
          p_period_end?: string
        }
        Returns: string
      }
      create_override_payout: {
        Args: { p_override_id: string }
        Returns: string
      }
      create_referral_payout: {
        Args: { p_referral_id: string }
        Returns: string
      }
      generate_franchise_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_campaign_analytics: {
        Args: { p_tenant_id: string; p_period_days?: number }
        Returns: {
          utm_source: string
          utm_medium: string
          utm_campaign: string
          total_referrals: number
          active_referrals: number
          conversion_rate: number
          total_rewards: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_diagnostic_test_stats: {
        Args: { p_environment?: string; p_days_back?: number }
        Returns: Json
      }
      get_document_status: {
        Args: { doc_id: string }
        Returns: string
      }
      get_referral_conversion_analytics: {
        Args: { p_tenant_id: string; p_period_days?: number }
        Returns: {
          referral_type: string
          total_referrals: number
          pending_referrals: number
          active_referrals: number
          expired_referrals: number
          conversion_rate: number
          avg_time_to_activation_days: number
        }[]
      }
      get_reward_analytics: {
        Args: { p_tenant_id: string; p_period_days?: number }
        Returns: {
          reward_type: string
          total_amount: number
          paid_amount: number
          pending_amount: number
          count_total: number
          count_paid: number
          count_pending: number
        }[]
      }
      get_top_referrers: {
        Args: { p_tenant_id: string; p_period_days?: number; p_limit?: number }
        Returns: {
          referrer_id: string
          referrer_email: string
          referrer_name: string
          referrer_type: string
          total_referrals: number
          active_referrals: number
          total_rewards: number
          conversion_rate: number
        }[]
      }
      get_top_slow_queries: {
        Args: { p_hours_back?: number; p_limit?: number }
        Returns: {
          table_name: string
          operation_type: string
          query_hash: string
          avg_execution_time_ms: number
          max_execution_time_ms: number
          query_count: number
          function_name: string
        }[]
      }
      has_any_role: {
        Args: { roles: string[] }
        Returns: boolean
      }
      has_premium_access: {
        Args: { feature_name: string }
        Returns: boolean
      }
      has_role: {
        Args: { required_role: string }
        Returns: boolean
      }
      initiate_disaster_recovery: {
        Args: {
          p_incident_type: string
          p_severity: string
          p_description: string
          p_affected_buckets?: string[]
        }
        Returns: string
      }
      is_tenant_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_diagnostic_test_run: {
        Args: {
          p_environment?: string
          p_git_commit_hash?: string
          p_git_branch?: string
          p_total_tests?: number
          p_passed_tests?: number
          p_failed_tests?: number
          p_warnings_count?: number
          p_execution_time_ms?: number
          p_overall_status?: string
          p_test_results?: Json
          p_error_details?: Json
        }
        Returns: string
      }
      log_document_access: {
        Args: {
          p_doc_id: string
          p_access_type: string
          p_access_method?: string
          p_emergency_token?: string
        }
        Returns: string
      }
      log_query_performance: {
        Args: {
          p_table_name: string
          p_operation_type: string
          p_query_hash: string
          p_execution_time_ms: number
          p_rows_affected?: number
          p_function_name?: string
          p_user_id?: string
          p_query_plan?: Json
          p_index_usage?: Json
          p_cache_hit?: boolean
        }
        Returns: string
      }
      log_referral_audit: {
        Args: {
          p_event_type: string
          p_referral_type: string
          p_referral_id: string
          p_old_status?: string
          p_new_status?: string
          p_user_id?: string
          p_details?: Json
        }
        Returns: string
      }
      process_advisor_referral: {
        Args: { p_referral_code: string; p_new_advisor_id: string }
        Returns: boolean
      }
      run_database_review_tests: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_number: number
          area_feature: string
          test_case: string
          expected_result: string
          actual_result: string
          pass_fail: string
          notes: string
        }[]
      }
      test_audit_logging: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_name: string
          result: string
          details: string
        }[]
      }
      test_basic_functionality: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_number: number
          area_feature: string
          test_case: string
          expected_result: string
          actual_result: string
          pass_fail: string
          notes: string
        }[]
      }
      test_edge_functions: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_number: number
          area_feature: string
          test_case: string
          expected_result: string
          actual_result: string
          pass_fail: string
          notes: string
        }[]
      }
      test_fk_constraints_cascade: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_case: string
          expected_result: string
          actual_result: string
          pass_fail: string
          notes: string
        }[]
      }
      test_hsa_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_name: string
          result: string
          details: string
        }[]
      }
      test_rls_and_tenant_isolation: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_case: string
          expected_result: string
          actual_result: string
          pass_fail: string
          notes: string
        }[]
      }
      test_transfer_validation: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_name: string
          result: string
          details: string
        }[]
      }
      test_webhook_constraints: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_case: string
          expected_result: string
          actual_result: string
          pass_fail: string
          notes: string
        }[]
      }
      update_disaster_recovery_progress: {
        Args: {
          p_recovery_id: string
          p_checklist_item_index: number
          p_completed: boolean
          p_notes?: string
        }
        Returns: boolean
      }
      upsert_daily_financial_snapshot: {
        Args: {
          p_user_id: string
          p_total_assets: number
          p_total_liabilities: number
          p_net_worth: number
        }
        Returns: undefined
      }
      validate_franchise_referral_creation: {
        Args: {
          p_referring_tenant_id: string
          p_contact_email: string
          p_firm_name: string
        }
        Returns: boolean
      }
      validate_otp_code: {
        Args: { p_user_id: string; p_otp_code: string }
        Returns: boolean
      }
      validate_referral_creation: {
        Args: {
          p_referrer_id: string
          p_referee_email?: string
          p_referral_type?: string
          p_tenant_id?: string
        }
        Returns: boolean
      }
      verify_file_backup_integrity: {
        Args: { p_backup_operation_id: string }
        Returns: {
          file_path: string
          is_valid: boolean
          error_message: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
