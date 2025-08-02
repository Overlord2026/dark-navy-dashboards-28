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
      ad_spend_tracking: {
        Row: {
          advisor_id: string
          agency_id: string | null
          amount: number
          campaign_id: string | null
          campaign_name: string | null
          clicks: number | null
          cpc: number | null
          created_at: string
          ctr: number | null
          id: string
          impressions: number | null
          notes: string | null
          source: string
          spend_date: string
        }
        Insert: {
          advisor_id: string
          agency_id?: string | null
          amount: number
          campaign_id?: string | null
          campaign_name?: string | null
          clicks?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number | null
          notes?: string | null
          source: string
          spend_date: string
        }
        Update: {
          advisor_id?: string
          agency_id?: string | null
          amount?: number
          campaign_id?: string | null
          campaign_name?: string | null
          clicks?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          id?: string
          impressions?: number | null
          notes?: string | null
          source?: string
          spend_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_spend_tracking_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "marketing_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_spend_tracking_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
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
      advisor_email_templates: {
        Row: {
          advisor_id: string
          body_template: string
          brand_settings: Json | null
          compliance_approved: boolean
          created_at: string
          id: string
          is_active: boolean
          subject_template: string
          template_name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          advisor_id: string
          body_template: string
          brand_settings?: Json | null
          compliance_approved?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          subject_template: string
          template_name: string
          template_type?: string
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          body_template?: string
          brand_settings?: Json | null
          compliance_approved?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          subject_template?: string
          template_name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      advisor_matches: {
        Row: {
          advisor_id: string
          ai_reasoning: string | null
          availability_match: boolean | null
          budget_match: boolean | null
          created_at: string
          expertise_match_details: Json | null
          id: string
          license_match: boolean | null
          match_score: number
          questionnaire_id: string
          recommended_order: number | null
        }
        Insert: {
          advisor_id: string
          ai_reasoning?: string | null
          availability_match?: boolean | null
          budget_match?: boolean | null
          created_at?: string
          expertise_match_details?: Json | null
          id?: string
          license_match?: boolean | null
          match_score: number
          questionnaire_id: string
          recommended_order?: number | null
        }
        Update: {
          advisor_id?: string
          ai_reasoning?: string | null
          availability_match?: boolean | null
          budget_match?: boolean | null
          created_at?: string
          expertise_match_details?: Json | null
          id?: string
          license_match?: boolean | null
          match_score?: number
          questionnaire_id?: string
          recommended_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_matches_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_matches_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "client_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_messages: {
        Row: {
          advisor_id: string
          client_id: string
          created_at: string
          id: string
          message: string
          message_type: string
          priority: string
          responded_at: string | null
          response: string | null
          status: string
          subject: string | null
        }
        Insert: {
          advisor_id: string
          client_id: string
          created_at?: string
          id?: string
          message: string
          message_type?: string
          priority?: string
          responded_at?: string | null
          response?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          advisor_id?: string
          client_id?: string
          created_at?: string
          id?: string
          message?: string
          message_type?: string
          priority?: string
          responded_at?: string | null
          response?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_messages_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      advisor_performance_metrics: {
        Row: {
          action_completion_rate: number | null
          advisor_id: string
          avg_meeting_duration_minutes: number | null
          avg_satisfaction_score: number | null
          avg_time_to_follow_up_hours: number | null
          cancelled_meetings: number
          completed_action_items: number
          completed_meetings: number
          completion_rate: number | null
          created_at: string
          follow_up_rate: number | null
          follow_ups_opened: number
          follow_ups_sent: number
          id: string
          no_show_meetings: number
          period_end: string
          period_start: string
          period_type: string
          recordings_uploaded: number
          summaries_generated: number
          total_action_items: number
          total_meetings: number
          updated_at: string
        }
        Insert: {
          action_completion_rate?: number | null
          advisor_id: string
          avg_meeting_duration_minutes?: number | null
          avg_satisfaction_score?: number | null
          avg_time_to_follow_up_hours?: number | null
          cancelled_meetings?: number
          completed_action_items?: number
          completed_meetings?: number
          completion_rate?: number | null
          created_at?: string
          follow_up_rate?: number | null
          follow_ups_opened?: number
          follow_ups_sent?: number
          id?: string
          no_show_meetings?: number
          period_end: string
          period_start: string
          period_type?: string
          recordings_uploaded?: number
          summaries_generated?: number
          total_action_items?: number
          total_meetings?: number
          updated_at?: string
        }
        Update: {
          action_completion_rate?: number | null
          advisor_id?: string
          avg_meeting_duration_minutes?: number | null
          avg_satisfaction_score?: number | null
          avg_time_to_follow_up_hours?: number | null
          cancelled_meetings?: number
          completed_action_items?: number
          completed_meetings?: number
          completion_rate?: number | null
          created_at?: string
          follow_up_rate?: number | null
          follow_ups_opened?: number
          follow_ups_sent?: number
          id?: string
          no_show_meetings?: number
          period_end?: string
          period_start?: string
          period_type?: string
          recordings_uploaded?: number
          summaries_generated?: number
          total_action_items?: number
          total_meetings?: number
          updated_at?: string
        }
        Relationships: []
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
      advisor_profiles: {
        Row: {
          availability_status: string
          average_rating: number | null
          bio: string | null
          calendly_url: string | null
          certifications: string[] | null
          client_capacity: number | null
          created_at: string
          current_clients: number | null
          email: string
          expertise_areas: string[]
          firm_name: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          license_states: string[]
          meeting_types: string[]
          name: string
          phone: string | null
          specializations: string[]
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          availability_status?: string
          average_rating?: number | null
          bio?: string | null
          calendly_url?: string | null
          certifications?: string[] | null
          client_capacity?: number | null
          created_at?: string
          current_clients?: number | null
          email: string
          expertise_areas?: string[]
          firm_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_states?: string[]
          meeting_types?: string[]
          name: string
          phone?: string | null
          specializations?: string[]
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          availability_status?: string
          average_rating?: number | null
          bio?: string | null
          calendly_url?: string | null
          certifications?: string[] | null
          client_capacity?: number | null
          created_at?: string
          current_clients?: number | null
          email?: string
          expertise_areas?: string[]
          firm_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_states?: string[]
          meeting_types?: string[]
          name?: string
          phone?: string | null
          specializations?: string[]
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      advisor_proposals: {
        Row: {
          accepted_at: string | null
          advisor_id: string
          compliance_summary: Json | null
          content: Json
          created_at: string
          id: string
          pdf_url: string | null
          proposal_type: string
          questionnaire_id: string | null
          scenario_ids: string[] | null
          sent_at: string | null
          status: string
          updated_at: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          advisor_id: string
          compliance_summary?: Json | null
          content?: Json
          created_at?: string
          id?: string
          pdf_url?: string | null
          proposal_type?: string
          questionnaire_id?: string | null
          scenario_ids?: string[] | null
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          advisor_id?: string
          compliance_summary?: Json | null
          content?: Json
          created_at?: string
          id?: string
          pdf_url?: string | null
          proposal_type?: string
          questionnaire_id?: string | null
          scenario_ids?: string[] | null
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_proposals_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_proposals_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "client_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_campaigns: {
        Row: {
          advisor_id: string
          agency_id: string
          budget: number | null
          campaign_name: string
          campaign_type: string | null
          created_at: string
          end_date: string | null
          goals: Json | null
          id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          advisor_id: string
          agency_id: string
          budget?: number | null
          campaign_name: string
          campaign_type?: string | null
          created_at?: string
          end_date?: string | null
          goals?: Json | null
          id?: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          agency_id?: string
          budget?: number | null
          campaign_name?: string
          campaign_type?: string | null
          created_at?: string
          end_date?: string | null
          goals?: Json | null
          id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_campaigns_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "marketing_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_performance_metrics: {
        Row: {
          agency_id: string
          average_cpl: number | null
          average_ltv: number | null
          close_rate: number | null
          conversion_rate: number | null
          created_at: string
          id: string
          period_end: string
          period_start: string
          total_ad_spend: number | null
          total_appointments: number | null
          total_campaigns: number | null
          total_closed_clients: number | null
          total_leads: number | null
        }
        Insert: {
          agency_id: string
          average_cpl?: number | null
          average_ltv?: number | null
          close_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          total_ad_spend?: number | null
          total_appointments?: number | null
          total_campaigns?: number | null
          total_closed_clients?: number | null
          total_leads?: number | null
        }
        Update: {
          agency_id?: string
          average_cpl?: number | null
          average_ltv?: number | null
          close_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          total_ad_spend?: number | null
          total_appointments?: number | null
          total_campaigns?: number | null
          total_closed_clients?: number | null
          total_leads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_performance_metrics_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "marketing_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_reviews: {
        Row: {
          advisor_id: string
          agency_id: string
          campaign_id: string | null
          created_at: string
          id: string
          rating: number
          responded_at: string | null
          response_text: string | null
          review_text: string | null
          updated_at: string
        }
        Insert: {
          advisor_id: string
          agency_id: string
          campaign_id?: string | null
          created_at?: string
          id?: string
          rating: number
          responded_at?: string | null
          response_text?: string | null
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          agency_id?: string
          campaign_id?: string | null
          created_at?: string
          id?: string
          rating?: number
          responded_at?: string | null
          response_text?: string | null
          review_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_reviews_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "marketing_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_reviews_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_spend_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_nudge_rules: {
        Row: {
          cpa_partner_id: string
          created_at: string | null
          days_threshold: number
          id: string
          is_active: boolean | null
          rule_name: string
          template_id: string | null
          trigger_condition: string
          updated_at: string | null
        }
        Insert: {
          cpa_partner_id: string
          created_at?: string | null
          days_threshold?: number
          id?: string
          is_active?: boolean | null
          rule_name: string
          template_id?: string | null
          trigger_condition: string
          updated_at?: string | null
        }
        Update: {
          cpa_partner_id?: string
          created_at?: string | null
          days_threshold?: number
          id?: string
          is_active?: boolean | null
          rule_name?: string
          template_id?: string | null
          trigger_condition?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_nudge_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_dashboards: {
        Row: {
          created_at: string
          dashboard_name: string
          dashboard_type: string
          id: string
          is_shared: boolean
          layout_config: Json
          shared_with: string[] | null
          tenant_id: string
          updated_at: string
          user_id: string
          widgets_config: Json
        }
        Insert: {
          created_at?: string
          dashboard_name: string
          dashboard_type?: string
          id?: string
          is_shared?: boolean
          layout_config?: Json
          shared_with?: string[] | null
          tenant_id: string
          updated_at?: string
          user_id: string
          widgets_config?: Json
        }
        Update: {
          created_at?: string
          dashboard_name?: string
          dashboard_type?: string
          id?: string
          is_shared?: boolean
          layout_config?: Json
          shared_with?: string[] | null
          tenant_id?: string
          updated_at?: string
          user_id?: string
          widgets_config?: Json
        }
        Relationships: []
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
      api_integration_configs: {
        Row: {
          api_endpoints: Json | null
          authentication_method: string | null
          config_data: Json
          created_at: string
          created_by: string
          credentials_encrypted: string | null
          health_status: string | null
          id: string
          integration_name: string
          integration_type: string
          is_active: boolean | null
          is_sandbox: boolean | null
          last_health_check: string | null
          rate_limits: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          api_endpoints?: Json | null
          authentication_method?: string | null
          config_data: Json
          created_at?: string
          created_by: string
          credentials_encrypted?: string | null
          health_status?: string | null
          id?: string
          integration_name: string
          integration_type: string
          is_active?: boolean | null
          is_sandbox?: boolean | null
          last_health_check?: string | null
          rate_limits?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          api_endpoints?: Json | null
          authentication_method?: string | null
          config_data?: Json
          created_at?: string
          created_by?: string
          credentials_encrypted?: string | null
          health_status?: string | null
          id?: string
          integration_name?: string
          integration_type?: string
          is_active?: boolean | null
          is_sandbox?: boolean | null
          last_health_check?: string | null
          rate_limits?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_integrations: {
        Row: {
          auth_config: Json
          auth_type: string
          base_url: string
          created_at: string
          created_by: string
          data_mapping: Json
          error_count: number
          field_mappings: Json
          headers: Json
          health_status: string | null
          id: string
          last_error: string | null
          last_error_at: string | null
          last_health_check: string | null
          last_sync_at: string | null
          name: string
          next_sync_at: string | null
          provider: string
          rate_limit_per_minute: number | null
          status: string
          sync_direction: string | null
          sync_enabled: boolean
          sync_frequency: string | null
          tenant_id: string
          timeout_seconds: number | null
          transformation_rules: Json
          type: string
          updated_at: string
        }
        Insert: {
          auth_config?: Json
          auth_type?: string
          base_url: string
          created_at?: string
          created_by: string
          data_mapping?: Json
          error_count?: number
          field_mappings?: Json
          headers?: Json
          health_status?: string | null
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          last_health_check?: string | null
          last_sync_at?: string | null
          name: string
          next_sync_at?: string | null
          provider: string
          rate_limit_per_minute?: number | null
          status?: string
          sync_direction?: string | null
          sync_enabled?: boolean
          sync_frequency?: string | null
          tenant_id: string
          timeout_seconds?: number | null
          transformation_rules?: Json
          type: string
          updated_at?: string
        }
        Update: {
          auth_config?: Json
          auth_type?: string
          base_url?: string
          created_at?: string
          created_by?: string
          data_mapping?: Json
          error_count?: number
          field_mappings?: Json
          headers?: Json
          health_status?: string | null
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          last_health_check?: string | null
          last_sync_at?: string | null
          name?: string
          next_sync_at?: string | null
          provider?: string
          rate_limit_per_minute?: number | null
          status?: string
          sync_direction?: string | null
          sync_enabled?: boolean
          sync_frequency?: string | null
          tenant_id?: string
          timeout_seconds?: number | null
          transformation_rules?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
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
      attorney_documents: {
        Row: {
          document_name: string
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          onboarding_id: string
          status: string | null
          uploaded_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          onboarding_id: string
          status?: string | null
          uploaded_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          onboarding_id?: string
          status?: string | null
          uploaded_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attorney_documents_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "attorney_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      attorney_onboarding: {
        Row: {
          admission_dates: Json | null
          attorney_bio: string | null
          bar_number: string | null
          bar_status: string | null
          billing_method: string | null
          cle_compliance_status: string | null
          cle_expiration_date: string | null
          cle_hours_completed: number | null
          cle_hours_required: number | null
          consultation_fee: number | null
          created_at: string
          current_step: string
          email: string | null
          firm_name: string | null
          firm_website: string | null
          first_name: string | null
          hourly_rate: number | null
          id: string
          jurisdictions_licensed: string[] | null
          last_name: string | null
          nda_signed: boolean | null
          office_address: string | null
          participation_agreement_signed: boolean | null
          phone: string | null
          practice_areas: string[] | null
          primary_jurisdiction: string | null
          primary_practice_area: string | null
          retainer_required: boolean | null
          specializations: string[] | null
          status: string | null
          tenant_id: string | null
          terms_accepted: boolean | null
          typical_retainer_amount: number | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          admission_dates?: Json | null
          attorney_bio?: string | null
          bar_number?: string | null
          bar_status?: string | null
          billing_method?: string | null
          cle_compliance_status?: string | null
          cle_expiration_date?: string | null
          cle_hours_completed?: number | null
          cle_hours_required?: number | null
          consultation_fee?: number | null
          created_at?: string
          current_step?: string
          email?: string | null
          firm_name?: string | null
          firm_website?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          jurisdictions_licensed?: string[] | null
          last_name?: string | null
          nda_signed?: boolean | null
          office_address?: string | null
          participation_agreement_signed?: boolean | null
          phone?: string | null
          practice_areas?: string[] | null
          primary_jurisdiction?: string | null
          primary_practice_area?: string | null
          retainer_required?: boolean | null
          specializations?: string[] | null
          status?: string | null
          tenant_id?: string | null
          terms_accepted?: boolean | null
          typical_retainer_amount?: number | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          admission_dates?: Json | null
          attorney_bio?: string | null
          bar_number?: string | null
          bar_status?: string | null
          billing_method?: string | null
          cle_compliance_status?: string | null
          cle_expiration_date?: string | null
          cle_hours_completed?: number | null
          cle_hours_required?: number | null
          consultation_fee?: number | null
          created_at?: string
          current_step?: string
          email?: string | null
          firm_name?: string | null
          firm_website?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          jurisdictions_licensed?: string[] | null
          last_name?: string | null
          nda_signed?: boolean | null
          office_address?: string | null
          participation_agreement_signed?: boolean | null
          phone?: string | null
          practice_areas?: string[] | null
          primary_jurisdiction?: string | null
          primary_practice_area?: string | null
          retainer_required?: boolean | null
          specializations?: string[] | null
          status?: string | null
          tenant_id?: string | null
          terms_accepted?: boolean | null
          typical_retainer_amount?: number | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          changed_at: string | null
          changed_columns: string[] | null
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          new_row: Json | null
          old_row: Json | null
          record_id: string | null
          status: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_columns?: string[] | null
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          new_row?: Json | null
          old_row?: Json | null
          record_id?: string | null
          status: string
          table_name?: string
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_columns?: string[] | null
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          new_row?: Json | null
          old_row?: Json | null
          record_id?: string | null
          status?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          limit_type: string
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          limit_type: string
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          limit_type?: string
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      automated_follow_ups: {
        Row: {
          advisor_id: string
          content: string | null
          created_at: string | null
          follow_up_type: string
          id: string
          lead_id: string
          response_received: boolean | null
          scheduled_for: string
          sent_at: string | null
          stage: string
          status: string | null
        }
        Insert: {
          advisor_id: string
          content?: string | null
          created_at?: string | null
          follow_up_type: string
          id?: string
          lead_id: string
          response_received?: boolean | null
          scheduled_for: string
          sent_at?: string | null
          stage: string
          status?: string | null
        }
        Update: {
          advisor_id?: string
          content?: string | null
          created_at?: string | null
          follow_up_type?: string
          id?: string
          lead_id?: string
          response_received?: boolean | null
          scheduled_for?: string
          sent_at?: string | null
          stage?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automated_follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      batch_communications: {
        Row: {
          campaign_name: string
          communication_type: string
          cpa_partner_id: string
          created_at: string | null
          failed_count: number | null
          id: string
          recipient_criteria: Json | null
          scheduled_for: string | null
          sent_count: number | null
          status: string
          template_id: string | null
          total_recipients: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_name: string
          communication_type: string
          cpa_partner_id: string
          created_at?: string | null
          failed_count?: number | null
          id?: string
          recipient_criteria?: Json | null
          scheduled_for?: string | null
          sent_count?: number | null
          status?: string
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_name?: string
          communication_type?: string
          cpa_partner_id?: string
          created_at?: string | null
          failed_count?: number | null
          id?: string
          recipient_criteria?: Json | null
          scheduled_for?: string | null
          sent_count?: number | null
          status?: string
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_communications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      bookkeeping_reports: {
        Row: {
          anomalies_found: number | null
          auto_classified_count: number | null
          category_breakdown: Json | null
          created_at: string | null
          id: string
          manual_review_count: number | null
          report_data: Json | null
          report_period_end: string
          report_period_start: string
          report_type: string | null
          status: string | null
          tenant_id: string | null
          total_transactions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anomalies_found?: number | null
          auto_classified_count?: number | null
          category_breakdown?: Json | null
          created_at?: string | null
          id?: string
          manual_review_count?: number | null
          report_data?: Json | null
          report_period_end: string
          report_period_start: string
          report_type?: string | null
          status?: string | null
          tenant_id?: string | null
          total_transactions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anomalies_found?: number | null
          auto_classified_count?: number | null
          category_breakdown?: Json | null
          created_at?: string | null
          id?: string
          manual_review_count?: number | null
          report_data?: Json | null
          report_period_end?: string
          report_period_start?: string
          report_type?: string | null
          status?: string | null
          tenant_id?: string | null
          total_transactions?: number | null
          updated_at?: string | null
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
      business_entities: {
        Row: {
          created_at: string
          description: string | null
          ein: string | null
          entity_name: string
          entity_type: string
          formation_date: string | null
          id: string
          jurisdiction: string
          mailing_address: Json | null
          registered_address: Json | null
          status: string | null
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ein?: string | null
          entity_name: string
          entity_type: string
          formation_date?: string | null
          id?: string
          jurisdiction: string
          mailing_address?: Json | null
          registered_address?: Json | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ein?: string | null
          entity_name?: string
          entity_type?: string
          formation_date?: string | null
          id?: string
          jurisdiction?: string
          mailing_address?: Json | null
          registered_address?: Json | null
          status?: string | null
          tenant_id?: string | null
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
      campaign_deliveries: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          client_user_id: string
          delivered_at: string | null
          delivery_type: string
          error_message: string | null
          id: string
          opened_at: string | null
          status: string
          tracking_data: Json | null
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          client_user_id: string
          delivered_at?: string | null
          delivery_type: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          status?: string
          tracking_data?: Json | null
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          client_user_id?: string
          delivered_at?: string | null
          delivery_type?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          status?: string
          tracking_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_deliveries_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "communication_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      charities: {
        Row: {
          annual_goal: number | null
          annual_raised: number | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          annual_goal?: number | null
          annual_raised?: number | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          annual_goal?: number | null
          annual_raised?: number | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      charity_suggestions: {
        Row: {
          charity_name: string
          created_at: string
          description: string | null
          id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          charity_name: string
          created_at?: string
          description?: string | null
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          charity_name?: string
          created_at?: string
          description?: string | null
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      client_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          client_user_id: string
          created_at: string
          firm_id: string
          id: string
          is_active: boolean
          notes: string | null
          professional_user_id: string
          relationship_type: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          client_user_id: string
          created_at?: string
          firm_id: string
          id?: string
          is_active?: boolean
          notes?: string | null
          professional_user_id: string
          relationship_type?: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          client_user_id?: string
          created_at?: string
          firm_id?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          professional_user_id?: string
          relationship_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "professional_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_assignments_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_assignments_professional_user_id_fkey"
            columns: ["professional_user_id"]
            isOneToOne: false
            referencedRelation: "professional_users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_conversions: {
        Row: {
          acquisition_cost: number | null
          advisor_id: string
          closed_date: string
          closing_notes: string | null
          contract_length_months: number | null
          created_at: string
          id: string
          lead_id: string
          lifetime_value: number | null
          recurring_revenue: number | null
          sales_cycle_days: number | null
          year_one_profit: number | null
          year_one_revenue: number | null
        }
        Insert: {
          acquisition_cost?: number | null
          advisor_id: string
          closed_date: string
          closing_notes?: string | null
          contract_length_months?: number | null
          created_at?: string
          id?: string
          lead_id: string
          lifetime_value?: number | null
          recurring_revenue?: number | null
          sales_cycle_days?: number | null
          year_one_profit?: number | null
          year_one_revenue?: number | null
        }
        Update: {
          acquisition_cost?: number | null
          advisor_id?: string
          closed_date?: string
          closing_notes?: string | null
          contract_length_months?: number | null
          created_at?: string
          id?: string
          lead_id?: string
          lifetime_value?: number | null
          recurring_revenue?: number | null
          sales_cycle_days?: number | null
          year_one_profit?: number | null
          year_one_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_conversions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      client_document_requests: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          document_name: string
          document_type: string
          id: string
          is_required: boolean | null
          onboarding_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          uploaded_at: string | null
          uploaded_document_url: string | null
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          document_name: string
          document_type: string
          id?: string
          is_required?: boolean | null
          onboarding_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string | null
          uploaded_document_url?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          document_name?: string
          document_type?: string
          id?: string
          is_required?: boolean | null
          onboarding_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string | null
          uploaded_document_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_document_requests_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      client_engagement_history: {
        Row: {
          clicked_at: string | null
          client_user_id: string
          content_delivered: Json
          converted_at: string | null
          cpa_partner_id: string
          delivered_at: string
          delivery_method: string
          engagement_type: string
          id: string
          opened_at: string | null
          status: string
          trigger_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          client_user_id: string
          content_delivered?: Json
          converted_at?: string | null
          cpa_partner_id: string
          delivered_at?: string
          delivery_method: string
          engagement_type: string
          id?: string
          opened_at?: string | null
          status?: string
          trigger_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          client_user_id?: string
          content_delivered?: Json
          converted_at?: string | null
          cpa_partner_id?: string
          delivered_at?: string
          delivery_method?: string
          engagement_type?: string
          id?: string
          opened_at?: string | null
          status?: string
          trigger_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_engagement_history_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "tax_completion_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_engagement_metrics: {
        Row: {
          action_items_assigned: number
          action_items_completed: number
          advisor_id: string
          avg_satisfaction_given: number | null
          client_id: string
          created_at: string
          engagement_score: number | null
          follow_ups_opened: number
          follow_ups_received: number
          id: string
          meetings_attended: number
          meetings_cancelled: number
          meetings_scheduled: number
          no_shows: number
          period_end: string
          period_start: string
          period_type: string
          updated_at: string
        }
        Insert: {
          action_items_assigned?: number
          action_items_completed?: number
          advisor_id: string
          avg_satisfaction_given?: number | null
          client_id: string
          created_at?: string
          engagement_score?: number | null
          follow_ups_opened?: number
          follow_ups_received?: number
          id?: string
          meetings_attended?: number
          meetings_cancelled?: number
          meetings_scheduled?: number
          no_shows?: number
          period_end: string
          period_start: string
          period_type?: string
          updated_at?: string
        }
        Update: {
          action_items_assigned?: number
          action_items_completed?: number
          advisor_id?: string
          avg_satisfaction_given?: number | null
          client_id?: string
          created_at?: string
          engagement_score?: number | null
          follow_ups_opened?: number
          follow_ups_received?: number
          id?: string
          meetings_attended?: number
          meetings_cancelled?: number
          meetings_scheduled?: number
          no_shows?: number
          period_end?: string
          period_start?: string
          period_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_guide_interactions: {
        Row: {
          client_user_id: string
          guide_id: string | null
          id: string
          interacted_at: string
          interaction_source: string
          interaction_type: string
        }
        Insert: {
          client_user_id: string
          guide_id?: string | null
          id?: string
          interacted_at?: string
          interaction_source: string
          interaction_type: string
        }
        Update: {
          client_user_id?: string
          guide_id?: string | null
          id?: string
          interacted_at?: string
          interaction_source?: string
          interaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_guide_interactions_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "planning_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      client_invitations: {
        Row: {
          advisor_id: string | null
          created_at: string | null
          custom_message: string | null
          email: string
          expires_at: string | null
          fee_structure: string | null
          first_name: string
          id: string
          invite_link: string | null
          last_name: string
          onboarding_template: string | null
          premium_modules: string[] | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          advisor_id?: string | null
          created_at?: string | null
          custom_message?: string | null
          email: string
          expires_at?: string | null
          fee_structure?: string | null
          first_name: string
          id?: string
          invite_link?: string | null
          last_name: string
          onboarding_template?: string | null
          premium_modules?: string[] | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          advisor_id?: string | null
          created_at?: string | null
          custom_message?: string | null
          email?: string
          expires_at?: string | null
          fee_structure?: string | null
          first_name?: string
          id?: string
          invite_link?: string | null
          last_name?: string
          onboarding_template?: string | null
          premium_modules?: string[] | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_invitations_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_meetings: {
        Row: {
          agenda: Json | null
          client_user_id: string
          cpa_partner_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          meeting_platform: string | null
          meeting_title: string
          meeting_type: string | null
          meeting_url: string | null
          notes: string | null
          onboarding_id: string | null
          scheduled_for: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agenda?: Json | null
          client_user_id: string
          cpa_partner_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_platform?: string | null
          meeting_title: string
          meeting_type?: string | null
          meeting_url?: string | null
          notes?: string | null
          onboarding_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agenda?: Json | null
          client_user_id?: string
          cpa_partner_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_platform?: string | null
          meeting_title?: string
          meeting_type?: string | null
          meeting_url?: string | null
          notes?: string | null
          onboarding_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_onboarding: {
        Row: {
          attorney_id: string
          case_type: string
          client_email: string
          client_name: string | null
          client_phone: string | null
          communication_preferences: Json | null
          created_at: string
          deadlines: Json | null
          engagement_letter_signed_at: string | null
          id: string
          intake_token: string | null
          nda_signed_at: string | null
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attorney_id: string
          case_type: string
          client_email: string
          client_name?: string | null
          client_phone?: string | null
          communication_preferences?: Json | null
          created_at?: string
          deadlines?: Json | null
          engagement_letter_signed_at?: string | null
          id?: string
          intake_token?: string | null
          nda_signed_at?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attorney_id?: string
          case_type?: string
          client_email?: string
          client_name?: string | null
          client_phone?: string | null
          communication_preferences?: Json | null
          created_at?: string
          deadlines?: Json | null
          engagement_letter_signed_at?: string | null
          id?: string
          intake_token?: string | null
          nda_signed_at?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_organizers: {
        Row: {
          client_user_id: string
          completed_at: string | null
          cpa_partner_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          organizer_type: string
          questions: Json
          responses: Json | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_user_id: string
          completed_at?: string | null
          cpa_partner_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          organizer_type?: string
          questions?: Json
          responses?: Json | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          completed_at?: string | null
          cpa_partner_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          organizer_type?: string
          questions?: Json
          responses?: Json | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_organizers_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      client_partner_referrals: {
        Row: {
          client_need: string
          client_user_id: string
          completed_at: string | null
          contacted_at: string | null
          cpa_partner_id: string
          created_at: string
          feedback_notes: string | null
          feedback_rating: number | null
          id: string
          marketplace_partner_id: string | null
          meeting_date: string | null
          referral_fee_earned: number | null
          referral_notes: string | null
          referral_type: string
          referred_at: string
          status: string
          updated_at: string
        }
        Insert: {
          client_need: string
          client_user_id: string
          completed_at?: string | null
          contacted_at?: string | null
          cpa_partner_id: string
          created_at?: string
          feedback_notes?: string | null
          feedback_rating?: number | null
          id?: string
          marketplace_partner_id?: string | null
          meeting_date?: string | null
          referral_fee_earned?: number | null
          referral_notes?: string | null
          referral_type: string
          referred_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_need?: string
          client_user_id?: string
          completed_at?: string | null
          contacted_at?: string | null
          cpa_partner_id?: string
          created_at?: string
          feedback_notes?: string | null
          feedback_rating?: number | null
          id?: string
          marketplace_partner_id?: string | null
          meeting_date?: string | null
          referral_fee_earned?: number | null
          referral_notes?: string | null
          referral_type?: string
          referred_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_partner_referrals_marketplace_partner_id_fkey"
            columns: ["marketplace_partner_id"]
            isOneToOne: false
            referencedRelation: "marketplace_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      client_questionnaires: {
        Row: {
          budget_range: string | null
          complexity_score: number | null
          created_at: string
          id: string
          preferred_meeting_type: string | null
          questionnaire_type: string
          responses: Json
          specialization_needs: string[] | null
          timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          complexity_score?: number | null
          created_at?: string
          id?: string
          preferred_meeting_type?: string | null
          questionnaire_type?: string
          responses?: Json
          specialization_needs?: string[] | null
          timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          complexity_score?: number | null
          created_at?: string
          id?: string
          preferred_meeting_type?: string | null
          questionnaire_type?: string
          responses?: Json
          specialization_needs?: string[] | null
          timeline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_storage_audit: {
        Row: {
          error_message: string | null
          id: string
          operation: string
          storage_key: string
          success: boolean | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          operation: string
          storage_key: string
          success?: boolean | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          error_message?: string | null
          id?: string
          operation?: string
          storage_key?: string
          success?: boolean | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coach_advisor_relationships: {
        Row: {
          advisor_id: string
          coach_id: string
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          relationship_type: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          advisor_id: string
          coach_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          relationship_type?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          coach_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          relationship_type?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_advisor_relationships_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_advisor_relationships_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      coach_invitations: {
        Row: {
          accepted_at: string | null
          advisor_name: string | null
          coach_id: string
          coaching_program: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_at: string
          message: string | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          advisor_name?: string | null
          coach_id: string
          coaching_program?: string | null
          email: string
          expires_at?: string
          id?: string
          invitation_token: string
          invited_at?: string
          message?: string | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          advisor_name?: string | null
          coach_id?: string
          coaching_program?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_at?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_invitations_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_progress_tracking: {
        Row: {
          advisor_id: string
          coach_id: string
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          notes: string | null
          period_end: string
          period_start: string
          target_value: number | null
          updated_at: string
        }
        Insert: {
          advisor_id: string
          coach_id: string
          created_at?: string
          id?: string
          metric_type: string
          metric_value: number
          notes?: string | null
          period_end: string
          period_start: string
          target_value?: number | null
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          coach_id?: string
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          period_end?: string
          period_start?: string
          target_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_progress_tracking_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_progress_tracking_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_curriculum: {
        Row: {
          coach_id: string
          content_data: Json
          content_type: string
          created_at: string
          estimated_duration_minutes: number | null
          id: string
          is_published: boolean
          module_description: string | null
          module_name: string
          order_index: number
          prerequisites: string[] | null
          updated_at: string
        }
        Insert: {
          coach_id: string
          content_data?: Json
          content_type?: string
          created_at?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_published?: boolean
          module_description?: string | null
          module_name: string
          order_index?: number
          prerequisites?: string[] | null
          updated_at?: string
        }
        Update: {
          coach_id?: string
          content_data?: Json
          content_type?: string
          created_at?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_published?: boolean
          module_description?: string | null
          module_name?: string
          order_index?: number
          prerequisites?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_curriculum_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_campaigns: {
        Row: {
          campaign_name: string
          campaign_type: string
          cpa_partner_id: string
          created_at: string
          id: string
          message_content: string
          recipient_criteria: Json | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          campaign_name: string
          campaign_type: string
          cpa_partner_id: string
          created_at?: string
          id?: string
          message_content: string
          recipient_criteria?: Json | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          campaign_name?: string
          campaign_type?: string
          cpa_partner_id?: string
          created_at?: string
          id?: string
          message_content?: string
          recipient_criteria?: Json | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_campaigns_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_deliveries: {
        Row: {
          batch_id: string | null
          clicked_at: string | null
          client_user_id: string
          communication_type: string
          delivered_at: string | null
          error_message: string | null
          id: string
          opened_at: string | null
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
          tracking_data: Json | null
        }
        Insert: {
          batch_id?: string | null
          clicked_at?: string | null
          client_user_id: string
          communication_type: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          tracking_data?: Json | null
        }
        Update: {
          batch_id?: string | null
          clicked_at?: string | null
          client_user_id?: string
          communication_type?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          tracking_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_deliveries_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch_communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          content: string
          cpa_partner_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          subject: string | null
          template_name: string
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          cpa_partner_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string | null
          template_name: string
          template_type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          cpa_partner_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string | null
          template_name?: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      community_giving_metrics: {
        Row: {
          calculated_at: string | null
          community_projects: number | null
          families_helped: number | null
          id: string
          scholarships_funded: number | null
          total_donations: number | null
          unique_donors: number | null
          year: number
        }
        Insert: {
          calculated_at?: string | null
          community_projects?: number | null
          families_helped?: number | null
          id?: string
          scholarships_funded?: number | null
          total_donations?: number | null
          unique_donors?: number | null
          year: number
        }
        Update: {
          calculated_at?: string | null
          community_projects?: number | null
          families_helped?: number | null
          id?: string
          scholarships_funded?: number | null
          total_donations?: number | null
          unique_donors?: number | null
          year?: number
        }
        Relationships: []
      }
      compliance_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string | null
          due_date: string | null
          entity_id: string | null
          escalation_level: number | null
          id: string
          metadata: Json | null
          notification_sent: boolean | null
          professional_id: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id?: string | null
          escalation_level?: number | null
          id?: string
          metadata?: Json | null
          notification_sent?: boolean | null
          professional_id?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id?: string | null
          escalation_level?: number | null
          id?: string
          metadata?: Json | null
          notification_sent?: boolean | null
          professional_id?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "business_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_audit_trail: {
        Row: {
          action_type: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown | null
          performed_by: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          action_type: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown | null
          performed_by: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          performed_by?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      compliance_checks: {
        Row: {
          check_type: string
          compliance_data: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          expiry_date: string | null
          id: string
          notes: string | null
          performed_at: string
          performed_by: string | null
          risk_score: number | null
          status: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          check_type: string
          compliance_data?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          performed_at?: string
          performed_by?: string | null
          risk_score?: number | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          check_type?: string
          compliance_data?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          performed_at?: string
          performed_by?: string | null
          risk_score?: number | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cpa_client_invitations: {
        Row: {
          accepted_at: string | null
          business_structure: string | null
          client_type: string
          company_name: string | null
          cpa_partner_id: string
          created_at: string
          custom_message: string | null
          email: string
          expires_at: string
          first_name: string | null
          id: string
          invitation_token: string
          invited_by: string | null
          last_name: string | null
          opened_at: string | null
          phone: string | null
          sent_at: string | null
          status: string
          updated_at: string
          welcome_video_url: string | null
        }
        Insert: {
          accepted_at?: string | null
          business_structure?: string | null
          client_type?: string
          company_name?: string | null
          cpa_partner_id: string
          created_at?: string
          custom_message?: string | null
          email: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invitation_token?: string
          invited_by?: string | null
          last_name?: string | null
          opened_at?: string | null
          phone?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
          welcome_video_url?: string | null
        }
        Update: {
          accepted_at?: string | null
          business_structure?: string | null
          client_type?: string
          company_name?: string | null
          cpa_partner_id?: string
          created_at?: string
          custom_message?: string | null
          email?: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invitation_token?: string
          invited_by?: string | null
          last_name?: string | null
          opened_at?: string | null
          phone?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
          welcome_video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpa_client_invitations_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_client_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_client_onboarding: {
        Row: {
          assigned_staff_id: string | null
          business_structure: string | null
          client_type: string
          client_user_id: string
          cpa_partner_id: string
          created_at: string
          documents_required: number
          documents_uploaded: number
          engagement_letter_signed: boolean
          estimated_completion_date: string | null
          id: string
          invitation_id: string | null
          notes: string | null
          onboarding_stage: string
          organizer_completed: boolean
          progress_percentage: number
          updated_at: string
          video_watched: boolean
          welcome_email_sent: boolean
        }
        Insert: {
          assigned_staff_id?: string | null
          business_structure?: string | null
          client_type: string
          client_user_id: string
          cpa_partner_id: string
          created_at?: string
          documents_required?: number
          documents_uploaded?: number
          engagement_letter_signed?: boolean
          estimated_completion_date?: string | null
          id?: string
          invitation_id?: string | null
          notes?: string | null
          onboarding_stage?: string
          organizer_completed?: boolean
          progress_percentage?: number
          updated_at?: string
          video_watched?: boolean
          welcome_email_sent?: boolean
        }
        Update: {
          assigned_staff_id?: string | null
          business_structure?: string | null
          client_type?: string
          client_user_id?: string
          cpa_partner_id?: string
          created_at?: string
          documents_required?: number
          documents_uploaded?: number
          engagement_letter_signed?: boolean
          estimated_completion_date?: string | null
          id?: string
          invitation_id?: string | null
          notes?: string | null
          onboarding_stage?: string
          organizer_completed?: boolean
          progress_percentage?: number
          updated_at?: string
          video_watched?: boolean
          welcome_email_sent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "cpa_client_onboarding_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_client_onboarding_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_client_onboarding_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "cpa_client_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_client_relationships: {
        Row: {
          client_user_id: string
          cpa_partner_id: string
          created_at: string
          end_date: string | null
          engagement_letter_signed: boolean | null
          engagement_letter_url: string | null
          engagement_type: string
          fee_structure: Json | null
          id: string
          is_active: boolean | null
          notes: string | null
          relationship_type: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          client_user_id: string
          cpa_partner_id: string
          created_at?: string
          end_date?: string | null
          engagement_letter_signed?: boolean | null
          engagement_letter_url?: string | null
          engagement_type: string
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          relationship_type?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          cpa_partner_id?: string
          created_at?: string
          end_date?: string | null
          engagement_letter_signed?: boolean | null
          engagement_letter_url?: string | null
          engagement_type?: string
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          relationship_type?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cpa_client_relationships_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_client_staff_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assigned_services: string[] | null
          assignment_type: string
          client_user_id: string
          cpa_partner_id: string
          created_at: string
          id: string
          is_active: boolean
          notes: string | null
          staff_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_services?: string[] | null
          assignment_type?: string
          client_user_id: string
          cpa_partner_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          staff_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_services?: string[] | null
          assignment_type?: string
          client_user_id?: string
          cpa_partner_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          staff_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cpa_client_staff_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_client_staff_assignments_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_client_staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_document_requests: {
        Row: {
          client_user_id: string
          cpa_partner_id: string
          created_at: string
          description: string | null
          document_name: string
          document_type: string
          due_date: string | null
          id: string
          is_required: boolean
          last_reminder_sent: string | null
          notes: string | null
          onboarding_id: string | null
          reminder_count: number
          request_sent_at: string | null
          reviewed_at: string | null
          status: string
          updated_at: string
          uploaded_at: string | null
          uploaded_file_url: string | null
        }
        Insert: {
          client_user_id: string
          cpa_partner_id: string
          created_at?: string
          description?: string | null
          document_name: string
          document_type: string
          due_date?: string | null
          id?: string
          is_required?: boolean
          last_reminder_sent?: string | null
          notes?: string | null
          onboarding_id?: string | null
          reminder_count?: number
          request_sent_at?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string | null
          uploaded_file_url?: string | null
        }
        Update: {
          client_user_id?: string
          cpa_partner_id?: string
          created_at?: string
          description?: string | null
          document_name?: string
          document_type?: string
          due_date?: string | null
          id?: string
          is_required?: boolean
          last_reminder_sent?: string | null
          notes?: string | null
          onboarding_id?: string | null
          reminder_count?: number
          request_sent_at?: string | null
          reviewed_at?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string | null
          uploaded_file_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpa_document_requests_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_document_requests_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "cpa_client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_onboarding_checklists: {
        Row: {
          completed_at: string | null
          cpa_partner_id: string
          created_at: string
          id: string
          is_completed: boolean
          step_category: string
          step_data: Json | null
          step_description: string | null
          step_name: string
          step_order: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          cpa_partner_id: string
          created_at?: string
          id?: string
          is_completed?: boolean
          step_category?: string
          step_data?: Json | null
          step_description?: string | null
          step_name: string
          step_order: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          cpa_partner_id?: string
          created_at?: string
          id?: string
          is_completed?: boolean
          step_category?: string
          step_data?: Json | null
          step_description?: string | null
          step_name?: string
          step_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cpa_onboarding_checklists_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_onboarding_status_log: {
        Row: {
          automated: boolean
          client_visible: boolean
          created_at: string
          id: string
          metadata: Json | null
          new_stage: string
          onboarding_id: string
          previous_stage: string | null
          status_message: string | null
          triggered_by: string | null
        }
        Insert: {
          automated?: boolean
          client_visible?: boolean
          created_at?: string
          id?: string
          metadata?: Json | null
          new_stage: string
          onboarding_id: string
          previous_stage?: string | null
          status_message?: string | null
          triggered_by?: string | null
        }
        Update: {
          automated?: boolean
          client_visible?: boolean
          created_at?: string
          id?: string
          metadata?: Json | null
          new_stage?: string
          onboarding_id?: string
          previous_stage?: string | null
          status_message?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpa_onboarding_status_log_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "cpa_client_onboarding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_onboarding_status_log_triggered_by_fkey"
            columns: ["triggered_by"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_partners: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bio: string | null
          certifications: string[] | null
          client_capacity: number | null
          created_at: string
          firm_ein: string | null
          firm_name: string
          firm_size: string | null
          hourly_rate: number | null
          id: string
          license_number: string
          license_state: string
          linkedin_url: string | null
          office_address: Json | null
          onboarding_status: string | null
          phone: string | null
          profile_image_url: string | null
          service_areas: string[] | null
          software_used: string[] | null
          specialties: string[] | null
          status: string | null
          tenant_id: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          white_label_enabled: boolean | null
          years_experience: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bio?: string | null
          certifications?: string[] | null
          client_capacity?: number | null
          created_at?: string
          firm_ein?: string | null
          firm_name: string
          firm_size?: string | null
          hourly_rate?: number | null
          id?: string
          license_number: string
          license_state: string
          linkedin_url?: string | null
          office_address?: Json | null
          onboarding_status?: string | null
          phone?: string | null
          profile_image_url?: string | null
          service_areas?: string[] | null
          software_used?: string[] | null
          specialties?: string[] | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          white_label_enabled?: boolean | null
          years_experience?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bio?: string | null
          certifications?: string[] | null
          client_capacity?: number | null
          created_at?: string
          firm_ein?: string | null
          firm_name?: string
          firm_size?: string | null
          hourly_rate?: number | null
          id?: string
          license_number?: string
          license_state?: string
          linkedin_url?: string | null
          office_address?: Json | null
          onboarding_status?: string | null
          phone?: string | null
          profile_image_url?: string | null
          service_areas?: string[] | null
          software_used?: string[] | null
          specialties?: string[] | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          white_label_enabled?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      cpa_practice_metrics: {
        Row: {
          active_clients: number
          calculated_at: string
          client_communications_sent: number
          cpa_partner_id: string
          documents_processed: number
          hours_logged: number
          id: string
          incomplete_organizers: number
          metric_date: string
          outstanding_returns: number
          pending_esigns: number
          total_revenue: number
        }
        Insert: {
          active_clients?: number
          calculated_at?: string
          client_communications_sent?: number
          cpa_partner_id: string
          documents_processed?: number
          hours_logged?: number
          id?: string
          incomplete_organizers?: number
          metric_date?: string
          outstanding_returns?: number
          pending_esigns?: number
          total_revenue?: number
        }
        Update: {
          active_clients?: number
          calculated_at?: string
          client_communications_sent?: number
          cpa_partner_id?: string
          documents_processed?: number
          hours_logged?: number
          id?: string
          incomplete_organizers?: number
          metric_date?: string
          outstanding_returns?: number
          pending_esigns?: number
          total_revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "cpa_practice_metrics_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_staff: {
        Row: {
          cpa_partner_id: string
          created_at: string
          email: string
          first_name: string
          hired_date: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean
          last_name: string
          notes: string | null
          permissions: Json
          role: Database["public"]["Enums"]["cpa_staff_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cpa_partner_id: string
          created_at?: string
          email: string
          first_name: string
          hired_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          last_name: string
          notes?: string | null
          permissions?: Json
          role?: Database["public"]["Enums"]["cpa_staff_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cpa_partner_id?: string
          created_at?: string
          email?: string
          first_name?: string
          hired_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          last_name?: string
          notes?: string | null
          permissions?: Json
          role?: Database["public"]["Enums"]["cpa_staff_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpa_staff_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_welcome_templates: {
        Row: {
          client_type: string | null
          cpa_partner_id: string
          created_at: string
          created_by: string | null
          email_content: string
          id: string
          includes_video: boolean
          is_default: boolean
          subject_line: string
          template_name: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          client_type?: string | null
          cpa_partner_id: string
          created_at?: string
          created_by?: string | null
          email_content: string
          id?: string
          includes_video?: boolean
          is_default?: boolean
          subject_line: string
          template_name: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          client_type?: string | null
          cpa_partner_id?: string
          created_at?: string
          created_by?: string | null
          email_content?: string
          id?: string
          includes_video?: boolean
          is_default?: boolean
          subject_line?: string
          template_name?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpa_welcome_templates_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_welcome_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      cpa_workflow_assignments: {
        Row: {
          actual_hours: number | null
          assigned_at: string
          assigned_by: string | null
          assigned_to: string
          completed_at: string | null
          cpa_partner_id: string
          created_at: string
          due_date: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: string
          status: string
          updated_at: string
          workflow_id: string
          workflow_type: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_at?: string
          assigned_by?: string | null
          assigned_to: string
          completed_at?: string | null
          cpa_partner_id: string
          created_at?: string
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          updated_at?: string
          workflow_id: string
          workflow_type: string
        }
        Update: {
          actual_hours?: number | null
          assigned_at?: string
          assigned_by?: string | null
          assigned_to?: string
          completed_at?: string | null
          cpa_partner_id?: string
          created_at?: string
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          updated_at?: string
          workflow_id?: string
          workflow_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cpa_workflow_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_workflow_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "cpa_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpa_workflow_assignments_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
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
      crm_activities: {
        Row: {
          activity_type: string
          contact_email: string | null
          contact_id: string | null
          contact_name: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          next_steps: string | null
          outcome: string | null
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          contact_email?: string | null
          contact_id?: string | null
          contact_name: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          next_steps?: string | null
          outcome?: string | null
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          next_steps?: string | null
          outcome?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          status: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string
          tags?: string[] | null
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
      crm_pipeline_items: {
        Row: {
          contact_email: string
          contact_id: string | null
          contact_name: string
          created_at: string | null
          expected_close: string | null
          id: string
          notes: string | null
          probability: number | null
          stage_id: string
          updated_at: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          contact_email: string
          contact_id?: string | null
          contact_name: string
          created_at?: string | null
          expected_close?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          stage_id: string
          updated_at?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          contact_email?: string
          contact_id?: string | null
          contact_name?: string
          created_at?: string | null
          expected_close?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          stage_id?: string
          updated_at?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      crm_reminders: {
        Row: {
          auto_generated: boolean
          contact_email: string | null
          contact_id: string | null
          contact_name: string
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string
          reminder_type: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          auto_generated?: boolean
          contact_email?: string | null
          contact_id?: string | null
          contact_name: string
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          reminder_type: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          auto_generated?: boolean
          contact_email?: string | null
          contact_id?: string | null
          contact_name?: string
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          reminder_type?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
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
      dashboard_access_logs: {
        Row: {
          access_type: string
          actions_performed: string[] | null
          compliance_flags: string[] | null
          geolocation: Json | null
          id: string
          ip_address: unknown | null
          mfa_verified: boolean | null
          session_duration_minutes: number | null
          severity: string | null
          timestamp: string
          user_agent: string | null
          user_email: string
        }
        Insert: {
          access_type: string
          actions_performed?: string[] | null
          compliance_flags?: string[] | null
          geolocation?: Json | null
          id?: string
          ip_address?: unknown | null
          mfa_verified?: boolean | null
          session_duration_minutes?: number | null
          severity?: string | null
          timestamp?: string
          user_agent?: string | null
          user_email: string
        }
        Update: {
          access_type?: string
          actions_performed?: string[] | null
          compliance_flags?: string[] | null
          geolocation?: Json | null
          id?: string
          ip_address?: unknown | null
          mfa_verified?: boolean | null
          session_duration_minutes?: number | null
          severity?: string | null
          timestamp?: string
          user_agent?: string | null
          user_email?: string
        }
        Relationships: []
      }
      data_classification: {
        Row: {
          access_logging_required: boolean | null
          classification_level: string
          column_name: string
          compliance_requirements: string[] | null
          created_at: string
          data_category: string[] | null
          encryption_required: boolean | null
          geographic_restrictions: string[] | null
          id: string
          retention_period: unknown | null
          table_name: string
          updated_at: string
        }
        Insert: {
          access_logging_required?: boolean | null
          classification_level: string
          column_name: string
          compliance_requirements?: string[] | null
          created_at?: string
          data_category?: string[] | null
          encryption_required?: boolean | null
          geographic_restrictions?: string[] | null
          id?: string
          retention_period?: unknown | null
          table_name: string
          updated_at?: string
        }
        Update: {
          access_logging_required?: boolean | null
          classification_level?: string
          column_name?: string
          compliance_requirements?: string[] | null
          created_at?: string
          data_category?: string[] | null
          encryption_required?: boolean | null
          geographic_restrictions?: string[] | null
          id?: string
          retention_period?: unknown | null
          table_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_export_audit: {
        Row: {
          completed_at: string | null
          download_count: number | null
          expiry_date: string | null
          export_type: string
          file_path: string | null
          gdpr_request: boolean | null
          id: string
          ip_address: unknown | null
          requested_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          download_count?: number | null
          expiry_date?: string | null
          export_type: string
          file_path?: string | null
          gdpr_request?: boolean | null
          id?: string
          ip_address?: unknown | null
          requested_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          download_count?: number | null
          expiry_date?: string | null
          export_type?: string
          file_path?: string | null
          gdpr_request?: boolean | null
          id?: string
          ip_address?: unknown | null
          requested_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          download_url: string | null
          expires_at: string
          export_format: string
          file_size: number | null
          id: string
          processed_at: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          download_url?: string | null
          expires_at?: string
          export_format?: string
          file_size?: number | null
          id?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          download_url?: string | null
          expires_at?: string
          export_format?: string
          file_size?: number | null
          id?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_data_sets: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          data_type: string
          demo_data: Json
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          data_type: string
          demo_data: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          data_type?: string
          demo_data?: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
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
      document_collaborations: {
        Row: {
          access_token: string | null
          accessed_at: string | null
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          message: string | null
          permission_level: string
          shared_by: string
          shared_with_email: string
          shared_with_role: string
        }
        Insert: {
          access_token?: string | null
          accessed_at?: string | null
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          message?: string | null
          permission_level?: string
          shared_by: string
          shared_with_email: string
          shared_with_role: string
        }
        Update: {
          access_token?: string | null
          accessed_at?: string | null
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          permission_level?: string
          shared_by?: string
          shared_with_email?: string
          shared_with_role?: string
        }
        Relationships: []
      }
      document_comments: {
        Row: {
          comment_text: string
          commenter_id: string
          commenter_type: string
          created_at: string | null
          document_id: string | null
          document_type: string
          id: string
          is_internal: boolean | null
          onboarding_id: string | null
          parent_comment_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comment_text: string
          commenter_id: string
          commenter_type: string
          created_at?: string | null
          document_id?: string | null
          document_type: string
          id?: string
          is_internal?: boolean | null
          onboarding_id?: string | null
          parent_comment_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comment_text?: string
          commenter_id?: string
          commenter_type?: string
          created_at?: string | null
          document_id?: string | null
          document_type?: string
          id?: string
          is_internal?: boolean | null
          onboarding_id?: string | null
          parent_comment_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "document_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_nudges: {
        Row: {
          id: string
          nudge_content: string | null
          nudge_type: string
          request_id: string
          response_received: boolean | null
          sent_at: string
        }
        Insert: {
          id?: string
          nudge_content?: string | null
          nudge_type?: string
          request_id: string
          response_received?: boolean | null
          sent_at?: string
        }
        Update: {
          id?: string
          nudge_content?: string | null
          nudge_type?: string
          request_id?: string
          response_received?: boolean | null
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_nudges_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "document_requests"
            referencedColumns: ["id"]
          },
        ]
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
      document_request_items: {
        Row: {
          document_description: string | null
          document_name: string
          id: string
          is_required: boolean
          request_id: string
          status: string
          uploaded_at: string | null
          uploaded_file_url: string | null
        }
        Insert: {
          document_description?: string | null
          document_name: string
          id?: string
          is_required?: boolean
          request_id: string
          status?: string
          uploaded_at?: string | null
          uploaded_file_url?: string | null
        }
        Update: {
          document_description?: string | null
          document_name?: string
          id?: string
          is_required?: boolean
          request_id?: string
          status?: string
          uploaded_at?: string | null
          uploaded_file_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "document_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      document_request_templates: {
        Row: {
          attorney_id: string
          case_type: string
          created_at: string
          deadline_days: number | null
          id: string
          instructions: string | null
          is_default: boolean | null
          required_documents: Json
          template_name: string
          updated_at: string
        }
        Insert: {
          attorney_id: string
          case_type: string
          created_at?: string
          deadline_days?: number | null
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          required_documents?: Json
          template_name: string
          updated_at?: string
        }
        Update: {
          attorney_id?: string
          case_type?: string
          created_at?: string
          deadline_days?: number | null
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          required_documents?: Json
          template_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_requests: {
        Row: {
          client_user_id: string
          completed_at: string | null
          cpa_partner_id: string
          created_at: string
          document_types: Json
          due_date: string | null
          id: string
          instructions: string | null
          priority: string
          request_name: string
          status: string
          updated_at: string
        }
        Insert: {
          client_user_id: string
          completed_at?: string | null
          cpa_partner_id: string
          created_at?: string
          document_types?: Json
          due_date?: string | null
          id?: string
          instructions?: string | null
          priority?: string
          request_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          completed_at?: string | null
          cpa_partner_id?: string
          created_at?: string
          document_types?: Json
          due_date?: string | null
          id?: string
          instructions?: string | null
          priority?: string
          request_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          cpa_partner_id: string
          created_at: string
          id: string
          is_active: boolean
          template_content: string
          template_name: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          cpa_partner_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          template_content: string
          template_name: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          cpa_partner_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          template_content?: string
          template_name?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
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
      draft_proposals: {
        Row: {
          advisor_id: string
          advisor_overrides: Json | null
          created_at: string | null
          current_holdings: Json
          id: string
          model_scores: Json | null
          proposal_data: Json
          prospect_email: string | null
          prospect_name: string
          recommended_model_id: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          advisor_id: string
          advisor_overrides?: Json | null
          created_at?: string | null
          current_holdings: Json
          id?: string
          model_scores?: Json | null
          proposal_data: Json
          prospect_email?: string | null
          prospect_name: string
          recommended_model_id?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          advisor_id?: string
          advisor_overrides?: Json | null
          created_at?: string | null
          current_holdings?: Json
          id?: string
          model_scores?: Json | null
          proposal_data?: Json
          prospect_email?: string | null
          prospect_name?: string
          recommended_model_id?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draft_proposals_recommended_model_id_fkey"
            columns: ["recommended_model_id"]
            isOneToOne: false
            referencedRelation: "investment_models"
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
      entity_documents: {
        Row: {
          compliance_related: boolean | null
          created_at: string
          document_name: string
          document_type: string
          entity_id: string
          expiration_date: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_required: boolean | null
          metadata: Json | null
          status: string | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          compliance_related?: boolean | null
          created_at?: string
          document_name: string
          document_type: string
          entity_id: string
          expiration_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_required?: boolean | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          compliance_related?: boolean | null
          created_at?: string
          document_name?: string
          document_type?: string
          entity_id?: string
          expiration_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_required?: boolean | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "business_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_ownership: {
        Row: {
          capital_contribution: number | null
          created_at: string
          entity_id: string
          id: string
          management_rights: boolean | null
          owner_email: string | null
          owner_name: string
          ownership_percentage: number | null
          ownership_type: string | null
          updated_at: string
          voting_rights: boolean | null
        }
        Insert: {
          capital_contribution?: number | null
          created_at?: string
          entity_id: string
          id?: string
          management_rights?: boolean | null
          owner_email?: string | null
          owner_name: string
          ownership_percentage?: number | null
          ownership_type?: string | null
          updated_at?: string
          voting_rights?: boolean | null
        }
        Update: {
          capital_contribution?: number | null
          created_at?: string
          entity_id?: string
          id?: string
          management_rights?: boolean | null
          owner_email?: string | null
          owner_name?: string
          ownership_percentage?: number | null
          ownership_type?: string | null
          updated_at?: string
          voting_rights?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_ownership_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "business_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_professionals: {
        Row: {
          created_at: string
          engagement_date: string | null
          entity_id: string
          fee_structure: string | null
          id: string
          is_primary: boolean | null
          professional_id: string
          professional_type: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          engagement_date?: string | null
          entity_id: string
          fee_structure?: string | null
          id?: string
          is_primary?: boolean | null
          professional_id: string
          professional_type: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          engagement_date?: string | null
          entity_id?: string
          fee_structure?: string | null
          id?: string
          is_primary?: boolean | null
          professional_id?: string
          professional_type?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_professionals_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "business_entities"
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
      failed_login_attempts: {
        Row: {
          attempted_at: string | null
          blocked_until: string | null
          email: string
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string | null
          blocked_until?: string | null
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string | null
          blocked_until?: string | null
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
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
      family_office_upsells: {
        Row: {
          clicked_at: string | null
          client_user_id: string
          conversion_value: number | null
          converted_at: string | null
          cpa_partner_id: string
          id: string
          metadata: Json
          presentation_context: string
          presented_at: string
          status: string
          upsell_type: string
        }
        Insert: {
          clicked_at?: string | null
          client_user_id: string
          conversion_value?: number | null
          converted_at?: string | null
          cpa_partner_id: string
          id?: string
          metadata?: Json
          presentation_context: string
          presented_at?: string
          status?: string
          upsell_type: string
        }
        Update: {
          clicked_at?: string | null
          client_user_id?: string
          conversion_value?: number | null
          converted_at?: string | null
          cpa_partner_id?: string
          id?: string
          metadata?: Json
          presentation_context?: string
          presented_at?: string
          status?: string
          upsell_type?: string
        }
        Relationships: []
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
      file_access_log: {
        Row: {
          access_type: string
          bucket_name: string
          download_duration_ms: number | null
          file_path: string
          file_size: number | null
          id: string
          ip_address: unknown | null
          success: boolean | null
          tenant_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          bucket_name: string
          download_duration_ms?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          tenant_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          bucket_name?: string
          download_duration_ms?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          tenant_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
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
      filing_schedules: {
        Row: {
          assigned_professional_id: string | null
          created_at: string
          due_date: string
          entity_id: string
          estimated_cost: number | null
          estimated_hours: number | null
          filing_name: string
          filing_type: string
          frequency: string | null
          id: string
          jurisdiction: string
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_professional_id?: string | null
          created_at?: string
          due_date: string
          entity_id: string
          estimated_cost?: number | null
          estimated_hours?: number | null
          filing_name: string
          filing_type: string
          frequency?: string | null
          id?: string
          jurisdiction: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_professional_id?: string | null
          created_at?: string
          due_date?: string
          entity_id?: string
          estimated_cost?: number | null
          estimated_hours?: number | null
          filing_name?: string
          filing_type?: string
          frequency?: string | null
          id?: string
          jurisdiction?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filing_schedules_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "business_entities"
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
      firm_billing: {
        Row: {
          api_calls_count: number | null
          billing_period_end: string
          billing_period_start: string
          created_at: string
          due_date: string | null
          firm_id: string
          id: string
          invoice_date: string | null
          invoice_number: string | null
          paid_date: string | null
          payment_status: string
          seat_rate: number
          seats_billed: number
          storage_used_gb: number | null
          stripe_charge_id: string | null
          stripe_invoice_id: string | null
          subtotal: number
          taxes: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          api_calls_count?: number | null
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          due_date?: string | null
          firm_id: string
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          paid_date?: string | null
          payment_status?: string
          seat_rate: number
          seats_billed: number
          storage_used_gb?: number | null
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          subtotal: number
          taxes?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          api_calls_count?: number | null
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          due_date?: string | null
          firm_id?: string
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          paid_date?: string | null
          payment_status?: string
          seat_rate?: number
          seats_billed?: number
          storage_used_gb?: number | null
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          subtotal?: number
          taxes?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "firm_billing_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      firm_handoffs: {
        Row: {
          client_notification_log: Json | null
          client_notification_template: string | null
          client_notifications_sent: boolean | null
          completed_at: string | null
          created_at: string
          current_owner_id: string
          firm_id: string
          id: string
          initiated_by: string
          master_admin_approval: boolean | null
          master_admin_approved_at: string | null
          master_admin_approved_by: string | null
          new_owner_email: string
          new_owner_id: string | null
          reason: string | null
          scheduled_date: string | null
          status: string
          transfer_items: Json
          updated_at: string
        }
        Insert: {
          client_notification_log?: Json | null
          client_notification_template?: string | null
          client_notifications_sent?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_owner_id: string
          firm_id: string
          id?: string
          initiated_by: string
          master_admin_approval?: boolean | null
          master_admin_approved_at?: string | null
          master_admin_approved_by?: string | null
          new_owner_email: string
          new_owner_id?: string | null
          reason?: string | null
          scheduled_date?: string | null
          status?: string
          transfer_items?: Json
          updated_at?: string
        }
        Update: {
          client_notification_log?: Json | null
          client_notification_template?: string | null
          client_notifications_sent?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_owner_id?: string
          firm_id?: string
          id?: string
          initiated_by?: string
          master_admin_approval?: boolean | null
          master_admin_approved_at?: string | null
          master_admin_approved_by?: string | null
          new_owner_email?: string
          new_owner_id?: string | null
          reason?: string | null
          scheduled_date?: string | null
          status?: string
          transfer_items?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "firm_handoffs_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      firm_invitations: {
        Row: {
          accepted_at: string | null
          admin_email: string
          admin_name: string
          created_at: string
          expires_at: string
          firm_name: string
          firm_type: string
          id: string
          invite_token: string
          invited_by: string | null
          seats_requested: number
          status: string
        }
        Insert: {
          accepted_at?: string | null
          admin_email: string
          admin_name: string
          created_at?: string
          expires_at?: string
          firm_name: string
          firm_type: string
          id?: string
          invite_token?: string
          invited_by?: string | null
          seats_requested?: number
          status?: string
        }
        Update: {
          accepted_at?: string | null
          admin_email?: string
          admin_name?: string
          created_at?: string
          expires_at?: string
          firm_name?: string
          firm_type?: string
          id?: string
          invite_token?: string
          invited_by?: string | null
          seats_requested?: number
          status?: string
        }
        Relationships: []
      }
      firm_users: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          firm_id: string
          id: string
          is_active: boolean
          permissions: Json | null
          role: string
          seat_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          firm_id: string
          id?: string
          is_active?: boolean
          permissions?: Json | null
          role: string
          seat_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          firm_id?: string
          id?: string
          is_active?: boolean
          permissions?: Json | null
          role?: string
          seat_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "firm_users_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      firms: {
        Row: {
          billing_email: string
          billing_status: string
          branding_enabled: boolean
          created_at: string
          custom_domain: string | null
          id: string
          logo_url: string | null
          marketplace_visibility: boolean
          name: string
          onboarding_completed: boolean
          parent_tenant_id: string | null
          primary_color: string | null
          seats_in_use: number
          seats_purchased: number
          secondary_color: string | null
          slug: string | null
          subscription_status: string
          type: string
          updated_at: string
          white_label_enabled: boolean
        }
        Insert: {
          billing_email: string
          billing_status?: string
          branding_enabled?: boolean
          created_at?: string
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          marketplace_visibility?: boolean
          name: string
          onboarding_completed?: boolean
          parent_tenant_id?: string | null
          primary_color?: string | null
          seats_in_use?: number
          seats_purchased?: number
          secondary_color?: string | null
          slug?: string | null
          subscription_status?: string
          type?: string
          updated_at?: string
          white_label_enabled?: boolean
        }
        Update: {
          billing_email?: string
          billing_status?: string
          branding_enabled?: boolean
          created_at?: string
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          marketplace_visibility?: boolean
          name?: string
          onboarding_completed?: boolean
          parent_tenant_id?: string | null
          primary_color?: string | null
          seats_in_use?: number
          seats_purchased?: number
          secondary_color?: string | null
          slug?: string | null
          subscription_status?: string
          type?: string
          updated_at?: string
          white_label_enabled?: boolean
        }
        Relationships: []
      }
      follow_up_email_history: {
        Row: {
          advisor_id: string
          clicked_at: string | null
          client_email: string
          content: string
          email_template_id: string | null
          error_message: string | null
          id: string
          meeting_recording_id: string | null
          meeting_summary_id: string | null
          metadata: Json | null
          opened_at: string | null
          sent_at: string
          status: string
          subject: string
          workflow_id: string | null
        }
        Insert: {
          advisor_id: string
          clicked_at?: string | null
          client_email: string
          content: string
          email_template_id?: string | null
          error_message?: string | null
          id?: string
          meeting_recording_id?: string | null
          meeting_summary_id?: string | null
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          status?: string
          subject: string
          workflow_id?: string | null
        }
        Update: {
          advisor_id?: string
          clicked_at?: string | null
          client_email?: string
          content?: string
          email_template_id?: string | null
          error_message?: string | null
          id?: string
          meeting_recording_id?: string | null
          meeting_summary_id?: string | null
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          status?: string
          subject?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_email_history_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "advisor_email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_email_history_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "follow_up_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_workflows: {
        Row: {
          advisor_id: string
          created_at: string
          custom_attachments: Json | null
          delay_hours: number
          email_template_id: string | null
          id: string
          include_action_items: boolean
          include_recording: boolean
          include_summary: boolean
          is_active: boolean
          trigger_conditions: Json
          updated_at: string
          workflow_name: string
        }
        Insert: {
          advisor_id: string
          created_at?: string
          custom_attachments?: Json | null
          delay_hours?: number
          email_template_id?: string | null
          id?: string
          include_action_items?: boolean
          include_recording?: boolean
          include_summary?: boolean
          is_active?: boolean
          trigger_conditions?: Json
          updated_at?: string
          workflow_name: string
        }
        Update: {
          advisor_id?: string
          created_at?: string
          custom_attachments?: Json | null
          delay_hours?: number
          email_template_id?: string | null
          id?: string
          include_action_items?: boolean
          include_recording?: boolean
          include_summary?: boolean
          is_active?: boolean
          trigger_conditions?: Json
          updated_at?: string
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_workflows_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "advisor_email_templates"
            referencedColumns: ["id"]
          },
        ]
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
      funnel_stages: {
        Row: {
          advisor_id: string
          completed_at: string | null
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          outcome: string | null
          stage_name: string
          stage_order: number
        }
        Insert: {
          advisor_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          outcome?: string | null
          stage_name: string
          stage_order: number
        }
        Update: {
          advisor_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          outcome?: string | null
          stage_name?: string
          stage_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "funnel_stages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_attachments: {
        Row: {
          attachment_type: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          goal_id: string
          id: string
          user_id: string
        }
        Insert: {
          attachment_type?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          goal_id: string
          id?: string
          user_id: string
        }
        Update: {
          attachment_type?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          goal_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_attachments_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "user_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_category_templates: {
        Row: {
          aspirational_prompt: string | null
          category: Database["public"]["Enums"]["goal_category"]
          created_at: string
          default_fields: Json | null
          description: string
          display_name: string
          icon_name: string | null
          id: string
          image_url: string | null
          required_fields: string[] | null
          success_story_example: string | null
          suggested_amounts: number[] | null
          updated_at: string
        }
        Insert: {
          aspirational_prompt?: string | null
          category: Database["public"]["Enums"]["goal_category"]
          created_at?: string
          default_fields?: Json | null
          description: string
          display_name: string
          icon_name?: string | null
          id?: string
          image_url?: string | null
          required_fields?: string[] | null
          success_story_example?: string | null
          suggested_amounts?: number[] | null
          updated_at?: string
        }
        Update: {
          aspirational_prompt?: string | null
          category?: Database["public"]["Enums"]["goal_category"]
          created_at?: string
          default_fields?: Json | null
          description?: string
          display_name?: string
          icon_name?: string | null
          id?: string
          image_url?: string | null
          required_fields?: string[] | null
          success_story_example?: string | null
          suggested_amounts?: number[] | null
          updated_at?: string
        }
        Relationships: []
      }
      goal_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          goal_id: string
          id: string
          is_completed: boolean | null
          target_amount: number
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          goal_id: string
          id?: string
          is_completed?: boolean | null
          target_amount: number
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          goal_id?: string
          id?: string
          is_completed?: boolean | null
          target_amount?: number
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "user_goals"
            referencedColumns: ["id"]
          },
        ]
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
      impact_milestones: {
        Row: {
          achieved_at: string | null
          created_at: string
          id: string
          is_celebrated: boolean | null
          milestone_data: Json | null
          milestone_type: string
          milestone_value: number
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          created_at?: string
          id?: string
          is_celebrated?: boolean | null
          milestone_data?: Json | null
          milestone_type: string
          milestone_value: number
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          created_at?: string
          id?: string
          is_celebrated?: boolean | null
          milestone_data?: Json | null
          milestone_type?: string
          milestone_value?: number
          user_id?: string
        }
        Relationships: []
      }
      impact_notifications: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          notification_type: string
          report_id: string | null
          sent_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_type: string
          report_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_type?: string
          report_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "impact_notifications_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "impact_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_reports: {
        Row: {
          charities_supported: number | null
          created_at: string
          file_url: string | null
          id: string
          projects_supported: number | null
          report_data: Json
          report_period_end: string
          report_period_start: string
          report_type: string
          status: string | null
          tenant_id: string | null
          total_donated: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          charities_supported?: number | null
          created_at?: string
          file_url?: string | null
          id?: string
          projects_supported?: number | null
          report_data?: Json
          report_period_end: string
          report_period_start: string
          report_type: string
          status?: string | null
          tenant_id?: string | null
          total_donated?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          charities_supported?: number | null
          created_at?: string
          file_url?: string | null
          id?: string
          projects_supported?: number | null
          report_data?: Json
          report_period_end?: string
          report_period_start?: string
          report_type?: string
          status?: string | null
          tenant_id?: string | null
          total_donated?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      impact_stories: {
        Row: {
          charity_id: string | null
          created_at: string
          id: string
          is_anonymous: boolean | null
          is_featured: boolean | null
          status: string | null
          story: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          charity_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          status?: string | null
          story: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          charity_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          status?: string | null
          story?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_stories_charity_id_fkey"
            columns: ["charity_id"]
            isOneToOne: false
            referencedRelation: "charities"
            referencedColumns: ["id"]
          },
        ]
      }
      import_export_history: {
        Row: {
          completed_at: string | null
          connector_id: string
          created_by: string
          error_details: Json | null
          field_mapping_used: Json | null
          file_name: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          operation_type: string
          records_failed: number | null
          records_processed: number | null
          rollback_data: Json | null
          rolled_back_at: string | null
          started_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          connector_id: string
          created_by: string
          error_details?: Json | null
          field_mapping_used?: Json | null
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          operation_type: string
          records_failed?: number | null
          records_processed?: number | null
          rollback_data?: Json | null
          rolled_back_at?: string | null
          started_at?: string
          status?: string
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          connector_id?: string
          created_by?: string
          error_details?: Json | null
          field_mapping_used?: Json | null
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          operation_type?: string
          records_failed?: number | null
          records_processed?: number | null
          rollback_data?: Json | null
          rolled_back_at?: string | null
          started_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_export_history_connector_id_fkey"
            columns: ["connector_id"]
            isOneToOne: false
            referencedRelation: "platform_connectors"
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
      integration_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          default_mappings: Json
          description: string | null
          documentation_url: string | null
          id: string
          install_count: number | null
          is_featured: boolean
          is_verified: boolean
          name: string
          provider: string
          rating: number | null
          required_credentials: string[]
          setup_instructions: string | null
          support_url: string | null
          supported_features: string[]
          template_config: Json
          updated_at: string
          version: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          default_mappings?: Json
          description?: string | null
          documentation_url?: string | null
          id?: string
          install_count?: number | null
          is_featured?: boolean
          is_verified?: boolean
          name: string
          provider: string
          rating?: number | null
          required_credentials?: string[]
          setup_instructions?: string | null
          support_url?: string | null
          supported_features?: string[]
          template_config: Json
          updated_at?: string
          version?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          default_mappings?: Json
          description?: string | null
          documentation_url?: string | null
          id?: string
          install_count?: number | null
          is_featured?: boolean
          is_verified?: boolean
          name?: string
          provider?: string
          rating?: number | null
          required_credentials?: string[]
          setup_instructions?: string | null
          support_url?: string | null
          supported_features?: string[]
          template_config?: Json
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      integration_usage: {
        Row: {
          api_calls_count: number
          avg_response_time_ms: number | null
          created_at: string
          data_synced_kb: number
          date: string
          error_rate_percentage: number | null
          id: string
          integration_id: string
          sync_jobs_run: number
          tenant_id: string
          webhooks_received: number
        }
        Insert: {
          api_calls_count?: number
          avg_response_time_ms?: number | null
          created_at?: string
          data_synced_kb?: number
          date: string
          error_rate_percentage?: number | null
          id?: string
          integration_id: string
          sync_jobs_run?: number
          tenant_id: string
          webhooks_received?: number
        }
        Update: {
          api_calls_count?: number
          avg_response_time_ms?: number | null
          created_at?: string
          data_synced_kb?: number
          date?: string
          error_rate_percentage?: number | null
          id?: string
          integration_id?: string
          sync_jobs_run?: number
          tenant_id?: string
          webhooks_received?: number
        }
        Relationships: [
          {
            foreignKeyName: "integration_usage_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
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
      investment_compliance: {
        Row: {
          compliance_status: string
          created_at: string
          documents_verified: boolean
          due_diligence_status: string
          finra_status: string
          id: string
          last_reviewed_at: string | null
          notes: string | null
          offering_id: string
          reviewed_by: string | null
          risk_assessment: Json | null
          sec_status: string
          updated_at: string
        }
        Insert: {
          compliance_status?: string
          created_at?: string
          documents_verified?: boolean
          due_diligence_status?: string
          finra_status?: string
          id?: string
          last_reviewed_at?: string | null
          notes?: string | null
          offering_id: string
          reviewed_by?: string | null
          risk_assessment?: Json | null
          sec_status?: string
          updated_at?: string
        }
        Update: {
          compliance_status?: string
          created_at?: string
          documents_verified?: boolean
          due_diligence_status?: string
          finra_status?: string
          id?: string
          last_reviewed_at?: string | null
          notes?: string | null
          offering_id?: string
          reviewed_by?: string | null
          risk_assessment?: Json | null
          sec_status?: string
          updated_at?: string
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
      investment_models: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          fee_structure: Json | null
          id: string
          is_active: boolean | null
          model_securities: Json
          name: string
          risk_level: number | null
          target_allocation: Json
          tax_efficiency_score: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          model_securities: Json
          name: string
          risk_level?: number | null
          target_allocation: Json
          tax_efficiency_score?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          model_securities?: Json
          name?: string
          risk_level?: number | null
          target_allocation?: Json
          tax_efficiency_score?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
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
      investment_products: {
        Row: {
          asset_allocation: Json | null
          category_id: string | null
          compliance_approved: boolean | null
          compliance_approved_at: string | null
          compliance_approved_by: string | null
          created_at: string | null
          created_by: string
          custom_fields: Json | null
          deep_link: string | null
          description: string | null
          eligibility_requirements: Json | null
          external_product_id: string | null
          external_provider: string | null
          fee_structure: Json | null
          id: string
          is_archived: boolean | null
          is_featured: boolean | null
          last_compliance_check: string | null
          marketing_info: Json | null
          maximum_investment: number | null
          minimum_investment: number | null
          name: string
          product_type: string
          ria_id: string
          risk_level: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          asset_allocation?: Json | null
          category_id?: string | null
          compliance_approved?: boolean | null
          compliance_approved_at?: string | null
          compliance_approved_by?: string | null
          created_at?: string | null
          created_by: string
          custom_fields?: Json | null
          deep_link?: string | null
          description?: string | null
          eligibility_requirements?: Json | null
          external_product_id?: string | null
          external_provider?: string | null
          fee_structure?: Json | null
          id?: string
          is_archived?: boolean | null
          is_featured?: boolean | null
          last_compliance_check?: string | null
          marketing_info?: Json | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          name: string
          product_type: string
          ria_id: string
          risk_level?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          asset_allocation?: Json | null
          category_id?: string | null
          compliance_approved?: boolean | null
          compliance_approved_at?: string | null
          compliance_approved_by?: string | null
          created_at?: string | null
          created_by?: string
          custom_fields?: Json | null
          deep_link?: string | null
          description?: string | null
          eligibility_requirements?: Json | null
          external_product_id?: string | null
          external_provider?: string | null
          fee_structure?: Json | null
          id?: string
          is_archived?: boolean | null
          is_featured?: boolean | null
          last_compliance_check?: string | null
          marketing_info?: Json | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          name?: string
          product_type?: string
          ria_id?: string
          risk_level?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_products_category_id_fkey"
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
      kyc_verifications: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          expires_at: string | null
          id: string
          notes: string | null
          provider: string | null
          retry_count: number | null
          risk_score: number | null
          status: string
          updated_at: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          provider?: string | null
          retry_count?: number | null
          risk_score?: number | null
          status?: string
          updated_at?: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          provider?: string | null
          retry_count?: number | null
          risk_score?: number | null
          status?: string
          updated_at?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      lead_engagement_tracking: {
        Row: {
          created_at: string | null
          engagement_data: Json | null
          engagement_date: string | null
          engagement_type: string
          id: string
          lead_id: string
        }
        Insert: {
          created_at?: string | null
          engagement_data?: Json | null
          engagement_date?: string | null
          engagement_type: string
          id?: string
          lead_id: string
        }
        Update: {
          created_at?: string | null
          engagement_data?: Json | null
          engagement_date?: string | null
          engagement_type?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_engagement_tracking_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_routing_decisions: {
        Row: {
          created_at: string
          decision_factors: Json | null
          id: string
          loan_request_id: string
          reasoning: Json | null
          recommended_partner_id: string | null
          rule_id: string | null
          score: number | null
        }
        Insert: {
          created_at?: string
          decision_factors?: Json | null
          id?: string
          loan_request_id: string
          reasoning?: Json | null
          recommended_partner_id?: string | null
          rule_id?: string | null
          score?: number | null
        }
        Update: {
          created_at?: string
          decision_factors?: Json | null
          id?: string
          loan_request_id?: string
          reasoning?: Json | null
          recommended_partner_id?: string | null
          rule_id?: string | null
          score?: number | null
        }
        Relationships: []
      }
      lead_routing_rules: {
        Row: {
          created_at: string
          created_by: string
          criteria: Json
          id: string
          is_active: boolean | null
          preferred_partners: string[] | null
          rule_name: string
          tenant_id: string
          updated_at: string
          weight_score: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          criteria: Json
          id?: string
          is_active?: boolean | null
          preferred_partners?: string[] | null
          rule_name: string
          tenant_id: string
          updated_at?: string
          weight_score?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          criteria?: Json
          id?: string
          is_active?: boolean | null
          preferred_partners?: string[] | null
          rule_name?: string
          tenant_id?: string
          updated_at?: string
          weight_score?: number | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          acquisition_cost: number | null
          advisor_id: string
          agency_id: string | null
          budget_score: number | null
          campaign_id: string | null
          created_at: string
          email: string | null
          engagement_score: number | null
          first_name: string
          fit_assessment: string | null
          fit_score: number | null
          follow_up_count: number | null
          id: string
          last_contact_attempt: string | null
          last_name: string
          lead_score: number | null
          lead_source: string
          lead_status: string | null
          lead_value: number | null
          next_follow_up_due: string | null
          notes: string | null
          phone: string | null
          timeline_score: number | null
          timeline_to_purchase: string | null
          updated_at: string
        }
        Insert: {
          acquisition_cost?: number | null
          advisor_id: string
          agency_id?: string | null
          budget_score?: number | null
          campaign_id?: string | null
          created_at?: string
          email?: string | null
          engagement_score?: number | null
          first_name: string
          fit_assessment?: string | null
          fit_score?: number | null
          follow_up_count?: number | null
          id?: string
          last_contact_attempt?: string | null
          last_name: string
          lead_score?: number | null
          lead_source: string
          lead_status?: string | null
          lead_value?: number | null
          next_follow_up_due?: string | null
          notes?: string | null
          phone?: string | null
          timeline_score?: number | null
          timeline_to_purchase?: string | null
          updated_at?: string
        }
        Update: {
          acquisition_cost?: number | null
          advisor_id?: string
          agency_id?: string | null
          budget_score?: number | null
          campaign_id?: string | null
          created_at?: string
          email?: string | null
          engagement_score?: number | null
          first_name?: string
          fit_assessment?: string | null
          fit_score?: number | null
          follow_up_count?: number | null
          id?: string
          last_contact_attempt?: string | null
          last_name?: string
          lead_score?: number | null
          lead_source?: string
          lead_status?: string | null
          lead_value?: number | null
          next_follow_up_due?: string | null
          notes?: string | null
          phone?: string | null
          timeline_score?: number | null
          timeline_to_purchase?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "marketing_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_document_templates: {
        Row: {
          attorney_id: string | null
          created_at: string
          id: string
          is_default: boolean | null
          practice_area: string | null
          state_jurisdiction: string | null
          template_content: string
          template_name: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          attorney_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          practice_area?: string | null
          state_jurisdiction?: string | null
          template_content: string
          template_name: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          attorney_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          practice_area?: string | null
          state_jurisdiction?: string | null
          template_content?: string
          template_name?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      lending_analytics: {
        Row: {
          avg_approval_time_hours: number | null
          conversion_rate: number | null
          created_at: string
          id: string
          loan_volume: number | null
          metric_type: string
          partner_performance: Json | null
          period_end: string
          period_start: string
          tenant_id: string
          total_loan_amount: number | null
          updated_at: string
        }
        Insert: {
          avg_approval_time_hours?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          loan_volume?: number | null
          metric_type: string
          partner_performance?: Json | null
          period_end: string
          period_start: string
          tenant_id: string
          total_loan_amount?: number | null
          updated_at?: string
        }
        Update: {
          avg_approval_time_hours?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          loan_volume?: number | null
          metric_type?: string
          partner_performance?: Json | null
          period_end?: string
          period_start?: string
          tenant_id?: string
          total_loan_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      lending_partners: {
        Row: {
          category: string
          compliance_status: string
          contact_info: Json | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          compliance_status?: string
          contact_info?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          compliance_status?: string
          contact_info?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      loan_documents: {
        Row: {
          created_at: string
          doc_type: string
          expiry_date: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          loan_id: string | null
          notes: string | null
          status: string
          tenant_id: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          doc_type: string
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          loan_id?: string | null
          notes?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: string
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          loan_id?: string | null
          notes?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      loan_messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          loan_id: string
          message_type: string
          recipient_id: string | null
          sender_id: string
          thread_id: string | null
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          loan_id: string
          message_type?: string
          recipient_id?: string | null
          sender_id: string
          thread_id?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          loan_id?: string
          message_type?: string
          recipient_id?: string | null
          sender_id?: string
          thread_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      loan_requests: {
        Row: {
          application_data: Json | null
          compliance_status: string | null
          created_at: string | null
          eligibility_result: Json | null
          id: string
          loan_type: string
          partner_id: string | null
          requested_amount: number
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_data?: Json | null
          compliance_status?: string | null
          created_at?: string | null
          eligibility_result?: Json | null
          id?: string
          loan_type: string
          partner_id?: string | null
          requested_amount: number
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_data?: Json | null
          compliance_status?: string | null
          created_at?: string | null
          eligibility_result?: Json | null
          id?: string
          loan_type?: string
          partner_id?: string | null
          requested_amount?: number
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "lending_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_status_updates: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          loan_id: string
          message: string | null
          metadata: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          loan_id: string
          message?: string | null
          metadata?: Json | null
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          loan_id?: string
          message?: string | null
          metadata?: Json | null
          status?: string
        }
        Relationships: []
      }
      market_data_cache: {
        Row: {
          alpha: number | null
          beta: number | null
          created_at: string
          error_message: string | null
          id: string
          one_year_return: number | null
          symbol: string
          updated_at: string
          volatility: number | null
          yield: number | null
          ytd_return: number | null
        }
        Insert: {
          alpha?: number | null
          beta?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          one_year_return?: number | null
          symbol: string
          updated_at?: string
          volatility?: number | null
          yield?: number | null
          ytd_return?: number | null
        }
        Update: {
          alpha?: number | null
          beta?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          one_year_return?: number | null
          symbol?: string
          updated_at?: string
          volatility?: number | null
          yield?: number | null
          ytd_return?: number | null
        }
        Relationships: []
      }
      marketing_agencies: {
        Row: {
          contact_email: string
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          name: string
          specializations: string[] | null
          status: string
          tenant_id: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name: string
          specializations?: string[] | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string
          specializations?: string[] | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          advisor_id: string
          campaign_name: string
          campaign_notes: string | null
          campaign_type: string | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          monthly_spend: number | null
          source: string
          start_date: string | null
          target_audience: string | null
          total_spend: number | null
          updated_at: string
        }
        Insert: {
          advisor_id: string
          campaign_name: string
          campaign_notes?: string | null
          campaign_type?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_spend?: number | null
          source: string
          start_date?: string | null
          target_audience?: string | null
          total_spend?: number | null
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          campaign_name?: string
          campaign_notes?: string | null
          campaign_type?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_spend?: number | null
          source?: string
          start_date?: string | null
          target_audience?: string | null
          total_spend?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_partners: {
        Row: {
          bio: string | null
          cpa_partner_id: string
          created_at: string
          credentials: string[]
          fee_structure: string | null
          firm_name: string
          id: string
          is_active: boolean
          is_verified: boolean
          location: Json | null
          logo_url: string | null
          partner_email: string
          partner_name: string
          partner_phone: string | null
          partner_type: string
          rating: number | null
          referral_fee_percent: number | null
          review_count: number | null
          specialties: string[]
          updated_at: string
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          cpa_partner_id: string
          created_at?: string
          credentials?: string[]
          fee_structure?: string | null
          firm_name: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          location?: Json | null
          logo_url?: string | null
          partner_email: string
          partner_name: string
          partner_phone?: string | null
          partner_type: string
          rating?: number | null
          referral_fee_percent?: number | null
          review_count?: number | null
          specialties?: string[]
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          cpa_partner_id?: string
          created_at?: string
          credentials?: string[]
          fee_structure?: string | null
          firm_name?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          location?: Json | null
          logo_url?: string | null
          partner_email?: string
          partner_name?: string
          partner_phone?: string | null
          partner_type?: string
          rating?: number | null
          referral_fee_percent?: number | null
          review_count?: number | null
          specialties?: string[]
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
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
      meeting_analytics: {
        Row: {
          action_items_completed: number | null
          action_items_count: number | null
          advisor_id: string
          client_id: string | null
          client_satisfaction_score: number | null
          created_at: string
          follow_up_sent_at: string | null
          follow_up_status: string | null
          id: string
          meeting_date: string
          meeting_duration_minutes: number | null
          meeting_status: string
          meeting_type: string
          recording_status: string | null
          summary_status: string | null
          time_to_follow_up_hours: number | null
          updated_at: string
        }
        Insert: {
          action_items_completed?: number | null
          action_items_count?: number | null
          advisor_id: string
          client_id?: string | null
          client_satisfaction_score?: number | null
          created_at?: string
          follow_up_sent_at?: string | null
          follow_up_status?: string | null
          id?: string
          meeting_date: string
          meeting_duration_minutes?: number | null
          meeting_status?: string
          meeting_type?: string
          recording_status?: string | null
          summary_status?: string | null
          time_to_follow_up_hours?: number | null
          updated_at?: string
        }
        Update: {
          action_items_completed?: number | null
          action_items_count?: number | null
          advisor_id?: string
          client_id?: string | null
          client_satisfaction_score?: number | null
          created_at?: string
          follow_up_sent_at?: string | null
          follow_up_status?: string | null
          id?: string
          meeting_date?: string
          meeting_duration_minutes?: number | null
          meeting_status?: string
          meeting_type?: string
          recording_status?: string | null
          summary_status?: string | null
          time_to_follow_up_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      meeting_integrations: {
        Row: {
          api_credentials: Json | null
          cpa_partner_id: string
          created_at: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_credentials?: Json | null
          cpa_partner_id: string
          created_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_credentials?: Json | null
          cpa_partner_id?: string
          created_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      meeting_recordings: {
        Row: {
          client_id: string | null
          created_at: string
          download_url: string | null
          duration_seconds: number | null
          file_path: string | null
          file_size: number | null
          id: string
          meeting_id: string | null
          metadata: Json | null
          provider_recording_id: string | null
          recording_type: string | null
          recording_url: string
          shared_with: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          download_url?: string | null
          duration_seconds?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          metadata?: Json | null
          provider_recording_id?: string | null
          recording_type?: string | null
          recording_url: string
          shared_with?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          download_url?: string | null
          duration_seconds?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          metadata?: Json | null
          provider_recording_id?: string | null
          recording_type?: string | null
          recording_url?: string
          shared_with?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_recordings_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "video_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_summaries: {
        Row: {
          action_items: Json | null
          client_id: string | null
          confidence_score: number | null
          created_at: string
          error_message: string | null
          id: string
          key_decisions: Json | null
          meeting_duration_minutes: number | null
          meeting_recording_id: string
          next_steps: Json | null
          participants: Json | null
          processing_status: string | null
          summary: string | null
          summary_completed_at: string | null
          transcription: string | null
          transcription_completed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_items?: Json | null
          client_id?: string | null
          confidence_score?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          key_decisions?: Json | null
          meeting_duration_minutes?: number | null
          meeting_recording_id: string
          next_steps?: Json | null
          participants?: Json | null
          processing_status?: string | null
          summary?: string | null
          summary_completed_at?: string | null
          transcription?: string | null
          transcription_completed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_items?: Json | null
          client_id?: string | null
          confidence_score?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          key_decisions?: Json | null
          meeting_duration_minutes?: number | null
          meeting_recording_id?: string
          next_steps?: Json | null
          participants?: Json | null
          processing_status?: string | null
          summary?: string | null
          summary_completed_at?: string | null
          transcription?: string | null
          transcription_completed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_summaries_meeting_recording_id_fkey"
            columns: ["meeting_recording_id"]
            isOneToOne: false
            referencedRelation: "meeting_recordings"
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
      message_audit_trail: {
        Row: {
          action_type: string
          compliance_metadata: Json | null
          id: string
          ip_address: unknown | null
          message_id: string | null
          participant_context: Json | null
          performed_by: string
          tenant_id: string | null
          thread_id: string
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          compliance_metadata?: Json | null
          id?: string
          ip_address?: unknown | null
          message_id?: string | null
          participant_context?: Json | null
          performed_by: string
          tenant_id?: string | null
          thread_id: string
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          compliance_metadata?: Json | null
          id?: string
          ip_address?: unknown | null
          message_id?: string | null
          participant_context?: Json | null
          performed_by?: string
          tenant_id?: string | null
          thread_id?: string
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_audit_trail_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "secure_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_audit_trail_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_compliance_settings: {
        Row: {
          auto_archive_enabled: boolean | null
          compliance_officer_email: string | null
          created_at: string | null
          encryption_enabled: boolean | null
          export_format: string | null
          external_messaging_allowed: boolean | null
          id: string
          retention_period_days: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          auto_archive_enabled?: boolean | null
          compliance_officer_email?: string | null
          created_at?: string | null
          encryption_enabled?: boolean | null
          export_format?: string | null
          external_messaging_allowed?: boolean | null
          id?: string
          retention_period_days?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          auto_archive_enabled?: boolean | null
          compliance_officer_email?: string | null
          created_at?: string | null
          encryption_enabled?: boolean | null
          export_format?: string | null
          external_messaging_allowed?: boolean | null
          id?: string
          retention_period_days?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      message_thread_participants: {
        Row: {
          id: string
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_archived: boolean | null
          tenant_id: string | null
          thread_name: string | null
          thread_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_archived?: boolean | null
          tenant_id?: string | null
          thread_name?: string | null
          thread_type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_archived?: boolean | null
          tenant_id?: string | null
          thread_name?: string | null
          thread_type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      mfa_bypass_audit: {
        Row: {
          bypass_reason: string
          created_at: string | null
          expires_at: string | null
          id: string
          initiated_by: string | null
          is_active: boolean | null
          user_id: string
          user_role: string
        }
        Insert: {
          bypass_reason: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          initiated_by?: string | null
          is_active?: boolean | null
          user_id: string
          user_role: string
        }
        Update: {
          bypass_reason?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          initiated_by?: string | null
          is_active?: boolean | null
          user_id?: string
          user_role?: string
        }
        Relationships: []
      }
      migration_jobs: {
        Row: {
          backup_location: string | null
          client_user_id: string | null
          completed_at: string | null
          cpa_partner_id: string
          created_at: string
          created_by: string
          error_log: Json | null
          estimated_completion: string | null
          failed_records: number | null
          file_mappings: Json | null
          id: string
          migration_config: Json | null
          migration_type: string
          processed_records: number | null
          progress_percentage: number | null
          source_system: string
          source_version: string | null
          started_at: string | null
          status: string | null
          total_records: number | null
          updated_at: string
        }
        Insert: {
          backup_location?: string | null
          client_user_id?: string | null
          completed_at?: string | null
          cpa_partner_id: string
          created_at?: string
          created_by: string
          error_log?: Json | null
          estimated_completion?: string | null
          failed_records?: number | null
          file_mappings?: Json | null
          id?: string
          migration_config?: Json | null
          migration_type: string
          processed_records?: number | null
          progress_percentage?: number | null
          source_system: string
          source_version?: string | null
          started_at?: string | null
          status?: string | null
          total_records?: number | null
          updated_at?: string
        }
        Update: {
          backup_location?: string | null
          client_user_id?: string | null
          completed_at?: string | null
          cpa_partner_id?: string
          created_at?: string
          created_by?: string
          error_log?: Json | null
          estimated_completion?: string | null
          failed_records?: number | null
          file_mappings?: Json | null
          id?: string
          migration_config?: Json | null
          migration_type?: string
          processed_records?: number | null
          progress_percentage?: number | null
          source_system?: string
          source_version?: string | null
          started_at?: string | null
          status?: string | null
          total_records?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_jobs_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
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
      network_impact_summary: {
        Row: {
          calculated_at: string | null
          created_at: string
          id: string
          impact_stories: Json | null
          period_end: string
          period_start: string
          period_type: string
          tenant_id: string | null
          top_charities: Json | null
          total_charities: number | null
          total_donated: number | null
          total_families: number | null
          total_projects: number | null
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string
          id?: string
          impact_stories?: Json | null
          period_end: string
          period_start: string
          period_type: string
          tenant_id?: string | null
          top_charities?: Json | null
          total_charities?: number | null
          total_donated?: number | null
          total_families?: number | null
          total_projects?: number | null
        }
        Update: {
          calculated_at?: string | null
          created_at?: string
          id?: string
          impact_stories?: Json | null
          period_end?: string
          period_start?: string
          period_type?: string
          tenant_id?: string | null
          top_charities?: Json | null
          total_charities?: number | null
          total_donated?: number | null
          total_families?: number | null
          total_projects?: number | null
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
      nudge_history: {
        Row: {
          client_user_id: string
          effectiveness_score: number | null
          id: string
          nudge_sent_at: string | null
          onboarding_id: string | null
          response_received_at: string | null
          rule_id: string | null
          trigger_reason: string
        }
        Insert: {
          client_user_id: string
          effectiveness_score?: number | null
          id?: string
          nudge_sent_at?: string | null
          onboarding_id?: string | null
          response_received_at?: string | null
          rule_id?: string | null
          trigger_reason: string
        }
        Update: {
          client_user_id?: string
          effectiveness_score?: number | null
          id?: string
          nudge_sent_at?: string | null
          onboarding_id?: string | null
          response_received_at?: string | null
          rule_id?: string | null
          trigger_reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "nudge_history_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "ai_nudge_rules"
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
      oauth_sessions: {
        Row: {
          access_token_encrypted: string | null
          auth_code: string | null
          connector_id: string
          created_at: string
          expires_at: string | null
          id: string
          platform_name: string
          refresh_token_encrypted: string | null
          scope: string | null
          state_token: string
          status: string
          updated_at: string
        }
        Insert: {
          access_token_encrypted?: string | null
          auth_code?: string | null
          connector_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          platform_name: string
          refresh_token_encrypted?: string | null
          scope?: string | null
          state_token: string
          status?: string
          updated_at?: string
        }
        Update: {
          access_token_encrypted?: string | null
          auth_code?: string | null
          connector_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          platform_name?: string
          refresh_token_encrypted?: string | null
          scope?: string | null
          state_token?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_sessions_connector_id_fkey"
            columns: ["connector_id"]
            isOneToOne: false
            referencedRelation: "platform_connectors"
            referencedColumns: ["id"]
          },
        ]
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
      onboarding_documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          session_id: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          session_id?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          session_id?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_documents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "onboarding_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          app_id: string
          completed_at: string | null
          created_at: string
          data: Json | null
          id: string
          notes: string | null
          status: string | null
          step_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          notes?: string | null
          status?: string | null
          step_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          notes?: string | null
          status?: string | null
          step_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_sessions: {
        Row: {
          completed_at: string | null
          completed_steps: string[] | null
          created_at: string | null
          current_step: string | null
          id: string
          invitation_id: string | null
          session_data: Json | null
          started_at: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: string | null
          id?: string
          invitation_id?: string | null
          session_data?: Json | null
          started_at?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: string | null
          id?: string
          invitation_id?: string | null
          session_data?: Json | null
          started_at?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_sessions_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "client_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_step_completions: {
        Row: {
          completed_at: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          session_id: string | null
          step_name: string
          tenant_id: string
          updated_at: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          completed_at?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          session_id?: string | null
          step_name: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          session_id?: string | null
          step_name?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_step_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "onboarding_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_step_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          app_id: string
          component_name: string | null
          created_at: string
          description: string | null
          estimated_minutes: number | null
          help_text: string | null
          id: string
          is_required: boolean | null
          step_key: string
          step_number: number
          title: string
        }
        Insert: {
          app_id: string
          component_name?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          step_key: string
          step_number: number
          title: string
        }
        Update: {
          app_id?: string
          component_name?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          step_key?: string
          step_number?: number
          title?: string
        }
        Relationships: []
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
      partner_applications: {
        Row: {
          address: Json | null
          approved_at: string | null
          business_type: string | null
          compliance_status: string
          contact_person: string | null
          created_at: string
          email: string
          id: string
          license_number: string | null
          loan_products: string[] | null
          maximum_loan_amount: number | null
          minimum_loan_amount: number | null
          onboarding_docs: string[] | null
          partner_name: string
          phone: string | null
          status: string
          submitted_at: string
          tenant_id: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: Json | null
          approved_at?: string | null
          business_type?: string | null
          compliance_status?: string
          contact_person?: string | null
          created_at?: string
          email: string
          id?: string
          license_number?: string | null
          loan_products?: string[] | null
          maximum_loan_amount?: number | null
          minimum_loan_amount?: number | null
          onboarding_docs?: string[] | null
          partner_name: string
          phone?: string | null
          status?: string
          submitted_at?: string
          tenant_id?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: Json | null
          approved_at?: string | null
          business_type?: string | null
          compliance_status?: string
          contact_person?: string | null
          created_at?: string
          email?: string
          id?: string
          license_number?: string | null
          loan_products?: string[] | null
          maximum_loan_amount?: number | null
          minimum_loan_amount?: number | null
          onboarding_docs?: string[] | null
          partner_name?: string
          phone?: string | null
          status?: string
          submitted_at?: string
          tenant_id?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      partner_metrics: {
        Row: {
          approval_rate: number | null
          avg_approval_time_hours: number | null
          avg_funding_time_hours: number | null
          calculated_at: string
          client_satisfaction_score: number | null
          funding_rate: number | null
          id: string
          loans_approved: number | null
          loans_funded: number | null
          loans_received: number | null
          metric_period: string
          partner_id: string
          total_volume: number | null
        }
        Insert: {
          approval_rate?: number | null
          avg_approval_time_hours?: number | null
          avg_funding_time_hours?: number | null
          calculated_at?: string
          client_satisfaction_score?: number | null
          funding_rate?: number | null
          id?: string
          loans_approved?: number | null
          loans_funded?: number | null
          loans_received?: number | null
          metric_period: string
          partner_id: string
          total_volume?: number | null
        }
        Update: {
          approval_rate?: number | null
          avg_approval_time_hours?: number | null
          avg_funding_time_hours?: number | null
          calculated_at?: string
          client_satisfaction_score?: number | null
          funding_rate?: number | null
          id?: string
          loans_approved?: number | null
          loans_funded?: number | null
          loans_received?: number | null
          metric_period?: string
          partner_id?: string
          total_volume?: number | null
        }
        Relationships: []
      }
      password_history: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          tenant_id?: string | null
          user_id?: string | null
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
      phishing_simulation_results: {
        Row: {
          clicked_at: string | null
          created_at: string
          data_entered: boolean | null
          email_opened: boolean | null
          id: string
          ip_address: unknown | null
          link_clicked: boolean | null
          opened_at: string | null
          reported_at: string | null
          reported_suspicious: boolean | null
          simulation_id: string
          tenant_id: string | null
          time_to_report_minutes: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          data_entered?: boolean | null
          email_opened?: boolean | null
          id?: string
          ip_address?: unknown | null
          link_clicked?: boolean | null
          opened_at?: string | null
          reported_at?: string | null
          reported_suspicious?: boolean | null
          simulation_id: string
          tenant_id?: string | null
          time_to_report_minutes?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          data_entered?: boolean | null
          email_opened?: boolean | null
          id?: string
          ip_address?: unknown | null
          link_clicked?: boolean | null
          opened_at?: string | null
          reported_at?: string | null
          reported_suspicious?: boolean | null
          simulation_id?: string
          tenant_id?: string | null
          time_to_report_minutes?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phishing_simulation_results_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "phishing_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      phishing_simulations: {
        Row: {
          campaign_name: string
          campaign_type: string
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          launch_date: string
          results_summary: Json | null
          status: string
          success_criteria: Json | null
          target_users: string[]
          template_content: Json
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          campaign_name: string
          campaign_type: string
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          launch_date: string
          results_summary?: Json | null
          status?: string
          success_criteria?: Json | null
          target_users?: string[]
          template_content?: Json
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          campaign_name?: string
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          launch_date?: string
          results_summary?: Json | null
          status?: string
          success_criteria?: Json | null
          target_users?: string[]
          template_content?: Json
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
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
      pipeline_stage_config: {
        Row: {
          advisor_id: string
          created_at: string | null
          email_template: string | null
          follow_up_delay_hours: number | null
          id: string
          is_active: boolean | null
          sms_template: string | null
          stage_name: string
          updated_at: string | null
        }
        Insert: {
          advisor_id: string
          created_at?: string | null
          email_template?: string | null
          follow_up_delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          sms_template?: string | null
          stage_name: string
          updated_at?: string | null
        }
        Update: {
          advisor_id?: string
          created_at?: string | null
          email_template?: string | null
          follow_up_delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          sms_template?: string | null
          stage_name?: string
          updated_at?: string | null
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
      planning_guides: {
        Row: {
          content_url: string | null
          cpa_partner_id: string
          created_at: string
          description: string | null
          download_count: number | null
          guide_title: string
          guide_type: string
          id: string
          is_active: boolean
          is_premium: boolean
          target_audience: Json
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          content_url?: string | null
          cpa_partner_id: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          guide_title: string
          guide_type: string
          id?: string
          is_active?: boolean
          is_premium?: boolean
          target_audience?: Json
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          content_url?: string | null
          cpa_partner_id?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          guide_title?: string
          guide_type?: string
          id?: string
          is_active?: boolean
          is_premium?: boolean
          target_audience?: Json
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planning_scenarios: {
        Row: {
          advisor_id: string | null
          ai_analysis: Json | null
          created_at: string
          created_by: string | null
          id: string
          input_parameters: Json
          recommendations: string | null
          scenario_name: string
          scenario_type: string
          simulation_results: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_id?: string | null
          ai_analysis?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          input_parameters?: Json
          recommendations?: string | null
          scenario_name: string
          scenario_type: string
          simulation_results?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_id?: string | null
          ai_analysis?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          input_parameters?: Json
          recommendations?: string | null
          scenario_name?: string
          scenario_type?: string
          simulation_results?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_scenarios_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_connectors: {
        Row: {
          configuration: Json
          connector_type: string
          created_at: string
          created_by: string
          field_mappings: Json
          id: string
          is_active: boolean
          oauth_credentials: Json | null
          platform_name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          connector_type: string
          created_at?: string
          created_by: string
          field_mappings?: Json
          id?: string
          is_active?: boolean
          oauth_credentials?: Json | null
          platform_name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          connector_type?: string
          created_at?: string
          created_by?: string
          field_mappings?: Json
          id?: string
          is_active?: boolean
          oauth_credentials?: Json | null
          platform_name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_field_mappings: {
        Row: {
          created_at: string
          data_type: string
          default_mapping: Json
          id: string
          is_system_template: boolean
          platform_name: string
          source_fields: Json
          target_fields: Json
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type: string
          default_mapping: Json
          id?: string
          is_system_template?: boolean
          platform_name: string
          source_fields: Json
          target_fields: Json
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          default_mapping?: Json
          id?: string
          is_system_template?: boolean
          platform_name?: string
          source_fields?: Json
          target_fields?: Json
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
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
      policy_version_history: {
        Row: {
          action_type: string
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          policy_definition: string | null
          policy_name: string
          table_name: string
        }
        Insert: {
          action_type: string
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          policy_definition?: string | null
          policy_name: string
          table_name: string
        }
        Update: {
          action_type?: string
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          policy_definition?: string | null
          policy_name?: string
          table_name?: string
        }
        Relationships: []
      }
      practice_metrics: {
        Row: {
          cpa_partner_id: string
          created_at: string
          id: string
          metric_data: Json | null
          metric_date: string
          metric_type: string
          metric_value: number | null
        }
        Insert: {
          cpa_partner_id: string
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_date: string
          metric_type: string
          metric_value?: number | null
        }
        Update: {
          cpa_partner_id?: string
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_date?: string
          metric_type?: string
          metric_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_metrics_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
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
      product_audit_log: {
        Row: {
          action_type: string
          change_summary: string | null
          created_at: string | null
          field_name: string | null
          id: string
          ip_address: unknown | null
          new_value: string | null
          old_value: string | null
          product_id: string
          record_id: string
          table_name: string
          tenant_id: string
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action_type: string
          change_summary?: string | null
          created_at?: string | null
          field_name?: string | null
          id?: string
          ip_address?: unknown | null
          new_value?: string | null
          old_value?: string | null
          product_id: string
          record_id: string
          table_name: string
          tenant_id: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action_type?: string
          change_summary?: string | null
          created_at?: string | null
          field_name?: string | null
          id?: string
          ip_address?: unknown | null
          new_value?: string | null
          old_value?: string | null
          product_id?: string
          record_id?: string
          table_name?: string
          tenant_id?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_audit_log_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "investment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_compliance_tracking: {
        Row: {
          assigned_to: string | null
          compliance_checklist: Json | null
          conditions_or_requirements: string | null
          created_at: string | null
          created_by: string
          decision: string | null
          decision_reason: string | null
          escalated_at: string | null
          id: string
          priority: string | null
          product_id: string
          required_documents: Json | null
          review_completed_at: string | null
          review_started_at: string | null
          review_type: string
          reviewer_notes: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          compliance_checklist?: Json | null
          conditions_or_requirements?: string | null
          created_at?: string | null
          created_by: string
          decision?: string | null
          decision_reason?: string | null
          escalated_at?: string | null
          id?: string
          priority?: string | null
          product_id: string
          required_documents?: Json | null
          review_completed_at?: string | null
          review_started_at?: string | null
          review_type: string
          reviewer_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          compliance_checklist?: Json | null
          conditions_or_requirements?: string | null
          created_at?: string | null
          created_by?: string
          decision?: string | null
          decision_reason?: string | null
          escalated_at?: string | null
          id?: string
          priority?: string | null
          product_id?: string
          required_documents?: Json | null
          review_completed_at?: string | null
          review_started_at?: string | null
          review_type?: string
          reviewer_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_compliance_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "investment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_documents: {
        Row: {
          access_level: string | null
          compliance_approved: boolean | null
          compliance_notes: string | null
          created_at: string | null
          description: string | null
          document_type: string
          file_size: number | null
          file_url: string | null
          id: string
          is_current_version: boolean | null
          mime_type: string | null
          name: string
          product_id: string
          requires_compliance_review: boolean | null
          updated_at: string | null
          uploaded_by: string
          version_number: number | null
        }
        Insert: {
          access_level?: string | null
          compliance_approved?: boolean | null
          compliance_notes?: string | null
          created_at?: string | null
          description?: string | null
          document_type: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_current_version?: boolean | null
          mime_type?: string | null
          name: string
          product_id: string
          requires_compliance_review?: boolean | null
          updated_at?: string | null
          uploaded_by: string
          version_number?: number | null
        }
        Update: {
          access_level?: string | null
          compliance_approved?: boolean | null
          compliance_notes?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_current_version?: boolean | null
          mime_type?: string | null
          name?: string
          product_id?: string
          requires_compliance_review?: boolean | null
          updated_at?: string | null
          uploaded_by?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "investment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_assignments: {
        Row: {
          assigned_by: string
          client_id: string
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          professional_id: string | null
          relationship: string
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_by: string
          client_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          professional_id?: string | null
          relationship: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string
          client_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          professional_id?: string | null
          relationship?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_assignments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_client_connections: {
        Row: {
          client_id: string
          connection_type: string
          created_at: string
          id: string
          initial_message: string | null
          professional_id: string
          professional_response: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          connection_type?: string
          created_at?: string
          id?: string
          initial_message?: string | null
          professional_id: string
          professional_response?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          connection_type?: string
          created_at?: string
          id?: string
          initial_message?: string | null
          professional_id?: string
          professional_response?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_client_connections_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "tax_professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_compliance: {
        Row: {
          created_at: string | null
          doc_type: string
          doc_url: string | null
          id: string
          last_reviewed: string | null
          professional_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type: string
          doc_url?: string | null
          id?: string
          last_reviewed?: string | null
          professional_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: string
          doc_url?: string | null
          id?: string
          last_reviewed?: string | null
          professional_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_compliance_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_credentials: {
        Row: {
          created_at: string
          credential_name: string
          credential_type: string
          current_hours: number | null
          documents: Json | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          license_number: string | null
          professional_id: string
          renewal_period: string | null
          required_hours: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_name: string
          credential_type: string
          current_hours?: number | null
          documents?: Json | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          license_number?: string | null
          professional_id: string
          renewal_period?: string | null
          required_hours?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_name?: string
          credential_type?: string
          current_hours?: number | null
          documents?: Json | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          license_number?: string | null
          professional_id?: string
          renewal_period?: string | null
          required_hours?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      professional_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invite_token: string
          invited_as: string
          invited_by: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_as: string
          invited_by: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_as?: string
          invited_by?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_onboarding: {
        Row: {
          approved_at: string | null
          created_at: string | null
          current_step: string | null
          form_data: Json | null
          id: string
          professional_type: string
          segment: string
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          uploaded_documents: string[] | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          current_step?: string | null
          form_data?: Json | null
          id?: string
          professional_type: string
          segment: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          uploaded_documents?: string[] | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          current_step?: string | null
          form_data?: Json | null
          id?: string
          professional_type?: string
          segment?: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          uploaded_documents?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      professional_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          professional_id: string | null
          rating: number | null
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          rating?: number | null
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          rating?: number | null
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_users: {
        Row: {
          assigned_clients: number
          bio: string | null
          certifications: string[] | null
          created_at: string
          email: string
          firm_id: string
          id: string
          last_active_at: string | null
          name: string
          onboarded_at: string | null
          phone: string | null
          profile_url: string | null
          role: string
          specialties: string[] | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_clients?: number
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          email: string
          firm_id: string
          id?: string
          last_active_at?: string | null
          name: string
          onboarded_at?: string | null
          phone?: string | null
          profile_url?: string | null
          role?: string
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_clients?: number
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          email?: string
          firm_id?: string
          id?: string
          last_active_at?: string | null
          name?: string
          onboarded_at?: string | null
          phone?: string | null
          profile_url?: string | null
          role?: string
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_users_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          accepting_new_clients: boolean | null
          accepts_referrals: boolean | null
          address: string | null
          aum_minimums: number | null
          availability: Json | null
          bio: string | null
          certifications: string[] | null
          client_capacity: number | null
          company: string | null
          compliance_status: string | null
          created_at: string
          custom_fields: Json | null
          email: string
          external_review_score: number | null
          external_verification_id: string | null
          featured: boolean | null
          fee_model: string | null
          firm: string | null
          id: string
          languages: string[] | null
          license_states: string[] | null
          location: string | null
          marketplace_tier: string | null
          min_client_assets: number | null
          name: string
          notes: string | null
          onboarding_process: string | null
          phone: string | null
          photo_url: string | null
          practice_areas: string[] | null
          rating: number | null
          ratings_average: number | null
          referral_fee_structure: string | null
          reviews_count: number | null
          scheduling_url: string | null
          segment: string | null
          show_email: boolean | null
          show_phone: boolean | null
          specialties: string[] | null
          sponsored: boolean | null
          status: string | null
          tenant_id: string
          type: string
          typical_engagement_fee: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          accepting_new_clients?: boolean | null
          accepts_referrals?: boolean | null
          address?: string | null
          aum_minimums?: number | null
          availability?: Json | null
          bio?: string | null
          certifications?: string[] | null
          client_capacity?: number | null
          company?: string | null
          compliance_status?: string | null
          created_at?: string
          custom_fields?: Json | null
          email: string
          external_review_score?: number | null
          external_verification_id?: string | null
          featured?: boolean | null
          fee_model?: string | null
          firm?: string | null
          id?: string
          languages?: string[] | null
          license_states?: string[] | null
          location?: string | null
          marketplace_tier?: string | null
          min_client_assets?: number | null
          name: string
          notes?: string | null
          onboarding_process?: string | null
          phone?: string | null
          photo_url?: string | null
          practice_areas?: string[] | null
          rating?: number | null
          ratings_average?: number | null
          referral_fee_structure?: string | null
          reviews_count?: number | null
          scheduling_url?: string | null
          segment?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          specialties?: string[] | null
          sponsored?: boolean | null
          status?: string | null
          tenant_id: string
          type?: string
          typical_engagement_fee?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          accepting_new_clients?: boolean | null
          accepts_referrals?: boolean | null
          address?: string | null
          aum_minimums?: number | null
          availability?: Json | null
          bio?: string | null
          certifications?: string[] | null
          client_capacity?: number | null
          company?: string | null
          compliance_status?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string
          external_review_score?: number | null
          external_verification_id?: string | null
          featured?: boolean | null
          fee_model?: string | null
          firm?: string | null
          id?: string
          languages?: string[] | null
          license_states?: string[] | null
          location?: string | null
          marketplace_tier?: string | null
          min_client_assets?: number | null
          name?: string
          notes?: string | null
          onboarding_process?: string | null
          phone?: string | null
          photo_url?: string | null
          practice_areas?: string[] | null
          rating?: number | null
          ratings_average?: number | null
          referral_fee_structure?: string | null
          reviews_count?: number | null
          scheduling_url?: string | null
          segment?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          specialties?: string[] | null
          sponsored?: boolean | null
          status?: string | null
          tenant_id?: string
          type?: string
          typical_engagement_fee?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
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
          account_locked_until: string | null
          advisor_id: string | null
          ai_features_access: boolean | null
          ai_queries_limit: number | null
          ai_queries_used: number | null
          avatar_url: string | null
          bio: string | null
          client_segment: string | null
          coaching_certifications: string[] | null
          coaching_firm: string | null
          coaching_specialties: string[] | null
          created_at: string | null
          date_format: string | null
          date_of_birth: string | null
          date_of_birth_date: string | null
          display_name: string | null
          document_uploads_limit: number | null
          document_uploads_used: number | null
          email: string | null
          email_opt_in: boolean | null
          failed_login_attempts: number | null
          first_name: string | null
          gender: string | null
          ghl_contact_id: string | null
          id: string
          investor_type: string | null
          language: string | null
          last_active_at: string | null
          last_login_at: string | null
          last_name: string | null
          lead_stage: string | null
          lending_access: boolean | null
          lending_applications_limit: number | null
          lending_applications_used: number | null
          location: string | null
          marital_status: string | null
          middle_name: string | null
          notification_preferences: Json | null
          permissions: string[] | null
          personalization_settings: Json | null
          phone: string | null
          premium_analytics_access: boolean | null
          privacy_settings: Json | null
          recruited_at: string | null
          referring_advisor_id: string | null
          role: string | null
          sms_opt_in: boolean | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_active: boolean | null
          subscription_tier: string | null
          suffix: string | null
          tax_access: boolean | null
          tax_analyses_limit: number | null
          tax_analyses_used: number | null
          tenant_id: string | null
          timezone: string | null
          title: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          account_locked_until?: string | null
          advisor_id?: string | null
          ai_features_access?: boolean | null
          ai_queries_limit?: number | null
          ai_queries_used?: number | null
          avatar_url?: string | null
          bio?: string | null
          client_segment?: string | null
          coaching_certifications?: string[] | null
          coaching_firm?: string | null
          coaching_specialties?: string[] | null
          created_at?: string | null
          date_format?: string | null
          date_of_birth?: string | null
          date_of_birth_date?: string | null
          display_name?: string | null
          document_uploads_limit?: number | null
          document_uploads_used?: number | null
          email?: string | null
          email_opt_in?: boolean | null
          failed_login_attempts?: number | null
          first_name?: string | null
          gender?: string | null
          ghl_contact_id?: string | null
          id: string
          investor_type?: string | null
          language?: string | null
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          lead_stage?: string | null
          lending_access?: boolean | null
          lending_applications_limit?: number | null
          lending_applications_used?: number | null
          location?: string | null
          marital_status?: string | null
          middle_name?: string | null
          notification_preferences?: Json | null
          permissions?: string[] | null
          personalization_settings?: Json | null
          phone?: string | null
          premium_analytics_access?: boolean | null
          privacy_settings?: Json | null
          recruited_at?: string | null
          referring_advisor_id?: string | null
          role?: string | null
          sms_opt_in?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_active?: boolean | null
          subscription_tier?: string | null
          suffix?: string | null
          tax_access?: boolean | null
          tax_analyses_limit?: number | null
          tax_analyses_used?: number | null
          tenant_id?: string | null
          timezone?: string | null
          title?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          account_locked_until?: string | null
          advisor_id?: string | null
          ai_features_access?: boolean | null
          ai_queries_limit?: number | null
          ai_queries_used?: number | null
          avatar_url?: string | null
          bio?: string | null
          client_segment?: string | null
          coaching_certifications?: string[] | null
          coaching_firm?: string | null
          coaching_specialties?: string[] | null
          created_at?: string | null
          date_format?: string | null
          date_of_birth?: string | null
          date_of_birth_date?: string | null
          display_name?: string | null
          document_uploads_limit?: number | null
          document_uploads_used?: number | null
          email?: string | null
          email_opt_in?: boolean | null
          failed_login_attempts?: number | null
          first_name?: string | null
          gender?: string | null
          ghl_contact_id?: string | null
          id?: string
          investor_type?: string | null
          language?: string | null
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          lead_stage?: string | null
          lending_access?: boolean | null
          lending_applications_limit?: number | null
          lending_applications_used?: number | null
          location?: string | null
          marital_status?: string | null
          middle_name?: string | null
          notification_preferences?: Json | null
          permissions?: string[] | null
          personalization_settings?: Json | null
          phone?: string | null
          premium_analytics_access?: boolean | null
          privacy_settings?: Json | null
          recruited_at?: string | null
          referring_advisor_id?: string | null
          role?: string | null
          sms_opt_in?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_active?: boolean | null
          subscription_tier?: string | null
          suffix?: string | null
          tax_access?: boolean | null
          tax_analyses_limit?: number | null
          tax_analyses_used?: number | null
          tenant_id?: string | null
          timezone?: string | null
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
      project_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          created_by: string
          description: string
          entity_id: string | null
          entity_type: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          project_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          created_by: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          project_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          created_by?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_analytics: {
        Row: {
          active_team_members: number
          actual_budget: number | null
          actual_hours: number | null
          budget_variance: number | null
          calculated_at: string
          client_satisfaction_score: number | null
          communication_frequency: number | null
          completion_percentage: number
          created_at: string
          days_elapsed: number
          days_remaining: number | null
          estimated_budget: number | null
          estimated_hours: number | null
          hours_variance: number | null
          id: string
          milestones_completed: number
          milestones_total: number
          project_id: string
          schedule_variance: number | null
          task_revision_rate: number | null
          tasks_completed: number
          tasks_total: number
          team_size: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active_team_members?: number
          actual_budget?: number | null
          actual_hours?: number | null
          budget_variance?: number | null
          calculated_at?: string
          client_satisfaction_score?: number | null
          communication_frequency?: number | null
          completion_percentage?: number
          created_at?: string
          days_elapsed?: number
          days_remaining?: number | null
          estimated_budget?: number | null
          estimated_hours?: number | null
          hours_variance?: number | null
          id?: string
          milestones_completed?: number
          milestones_total?: number
          project_id: string
          schedule_variance?: number | null
          task_revision_rate?: number | null
          tasks_completed?: number
          tasks_total?: number
          team_size?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active_team_members?: number
          actual_budget?: number | null
          actual_hours?: number | null
          budget_variance?: number | null
          calculated_at?: string
          client_satisfaction_score?: number | null
          communication_frequency?: number | null
          completion_percentage?: number
          created_at?: string
          days_elapsed?: number
          days_remaining?: number | null
          estimated_budget?: number | null
          estimated_hours?: number | null
          hours_variance?: number | null
          id?: string
          milestones_completed?: number
          milestones_total?: number
          project_id?: string
          schedule_variance?: number | null
          task_revision_rate?: number | null
          tasks_completed?: number
          tasks_total?: number
          team_size?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_communications: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          created_by: string
          id: string
          is_pinned: boolean | null
          mentions: string[] | null
          parent_id: string | null
          participants: string[] | null
          project_id: string
          subject: string | null
          tags: string[] | null
          thread_count: number | null
          type: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_pinned?: boolean | null
          mentions?: string[] | null
          parent_id?: string | null
          participants?: string[] | null
          project_id: string
          subject?: string | null
          tags?: string[] | null
          thread_count?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_pinned?: boolean | null
          mentions?: string[] | null
          parent_id?: string | null
          participants?: string[] | null
          project_id?: string
          subject?: string | null
          tags?: string[] | null
          thread_count?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_communications_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "project_communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          access_level: string
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          folder_path: string | null
          id: string
          is_confidential: boolean | null
          project_id: string
          tags: string[] | null
          updated_at: string
          uploaded_by: string
          version: number | null
        }
        Insert: {
          access_level?: string
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          folder_path?: string | null
          id?: string
          is_confidential?: boolean | null
          project_id: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by: string
          version?: number | null
        }
        Update: {
          access_level?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          folder_path?: string | null
          id?: string
          is_confidential?: boolean | null
          project_id?: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          assigned_team: string[] | null
          completed: boolean
          completed_date: string | null
          created_at: string
          deliverables: string[] | null
          dependencies: string[] | null
          description: string | null
          due_date: string
          id: string
          priority: string
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_team?: string[] | null
          completed?: boolean
          completed_date?: string | null
          created_at?: string
          deliverables?: string[] | null
          dependencies?: string[] | null
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_team?: string[] | null
          completed?: boolean
          completed_date?: string | null
          created_at?: string
          deliverables?: string[] | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          milestone_id: string | null
          priority: string
          project_id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          milestone_id?: string | null
          priority?: string
          project_id: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          milestone_id?: string | null
          priority?: string
          project_id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          created_at: string
          id: string
          is_active: boolean | null
          notes: string | null
          permissions: string[] | null
          professional_id: string
          project_id: string
          role: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          permissions?: string[] | null
          professional_id: string
          project_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          permissions?: string[] | null
          professional_id?: string
          project_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_hours: number | null
          budget: number | null
          client_id: string
          completed_date: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          family_id: string | null
          id: string
          name: string
          priority: string
          progress: number | null
          project_lead_id: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          tenant_id: string
          updated_at: string
          vertical: string
        }
        Insert: {
          actual_hours?: number | null
          budget?: number | null
          client_id: string
          completed_date?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          family_id?: string | null
          id?: string
          name: string
          priority?: string
          progress?: number | null
          project_lead_id?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string
          vertical?: string
        }
        Update: {
          actual_hours?: number | null
          budget?: number | null
          client_id?: string
          completed_date?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          family_id?: string | null
          id?: string
          name?: string
          priority?: string
          progress?: number | null
          project_lead_id?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string
          vertical?: string
        }
        Relationships: []
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
      proposal_audit: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: unknown | null
          proposal_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          proposal_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          proposal_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_audit_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "draft_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_overrides: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          new_value: Json
          original_value: Json
          override_type: string
          proposal_id: string | null
          reason: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          new_value: Json
          original_value: Json
          override_type: string
          proposal_id?: string | null
          reason?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          new_value?: Json
          original_value?: Json
          override_type?: string
          proposal_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_overrides_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "draft_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      prospect_invitations: {
        Row: {
          activated_at: string | null
          advisor_id: string
          client_segment: string
          created_at: string
          email: string
          expires_at: string
          id: string
          magic_token: string
          personal_note: string | null
          sent_at: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          activated_at?: string | null
          advisor_id: string
          client_segment?: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          magic_token: string
          personal_note?: string | null
          sent_at?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          activated_at?: string | null
          advisor_id?: string
          client_segment?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          magic_token?: string
          personal_note?: string | null
          sent_at?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
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
      reports: {
        Row: {
          download_url: string | null
          format: string
          generated_at: string
          id: string
          metadata: Json | null
          report_type: string
          role: string
          user_id: string
        }
        Insert: {
          download_url?: string | null
          format: string
          generated_at?: string
          id?: string
          metadata?: Json | null
          report_type: string
          role: string
          user_id: string
        }
        Update: {
          download_url?: string | null
          format?: string
          generated_at?: string
          id?: string
          metadata?: Json | null
          report_type?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      resource_utilization_analytics: {
        Row: {
          active_projects: number
          active_team_members: number
          average_completion_rate: number | null
          average_project_satisfaction: number | null
          budget_utilization: number | null
          calculated_at: string
          capacity_utilization: number | null
          completed_projects: number
          created_at: string
          id: string
          overdue_projects: number
          period_end: string
          period_start: string
          tenant_id: string
          total_budget_allocated: number
          total_budget_spent: number
          total_hours_allocated: number
          total_hours_available: number
          total_hours_logged: number
          total_team_members: number
          updated_at: string
          utilization_rate: number | null
        }
        Insert: {
          active_projects?: number
          active_team_members?: number
          average_completion_rate?: number | null
          average_project_satisfaction?: number | null
          budget_utilization?: number | null
          calculated_at?: string
          capacity_utilization?: number | null
          completed_projects?: number
          created_at?: string
          id?: string
          overdue_projects?: number
          period_end: string
          period_start: string
          tenant_id: string
          total_budget_allocated?: number
          total_budget_spent?: number
          total_hours_allocated?: number
          total_hours_available?: number
          total_hours_logged?: number
          total_team_members?: number
          updated_at?: string
          utilization_rate?: number | null
        }
        Update: {
          active_projects?: number
          active_team_members?: number
          average_completion_rate?: number | null
          average_project_satisfaction?: number | null
          budget_utilization?: number | null
          calculated_at?: string
          capacity_utilization?: number | null
          completed_projects?: number
          created_at?: string
          id?: string
          overdue_projects?: number
          period_end?: string
          period_start?: string
          tenant_id?: string
          total_budget_allocated?: number
          total_budget_spent?: number
          total_hours_allocated?: number
          total_hours_available?: number
          total_hours_logged?: number
          total_team_members?: number
          updated_at?: string
          utilization_rate?: number | null
        }
        Relationships: []
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
      ria_onboarding_configs: {
        Row: {
          created_at: string | null
          custom_agreements: string[] | null
          firm_name: string
          id: string
          logo_url: string | null
          optional_steps: string[] | null
          payment_amount: number | null
          payment_frequency: string | null
          payment_required: boolean | null
          primary_color: string | null
          required_steps: string[] | null
          secondary_color: string | null
          tenant_id: string
          updated_at: string | null
          welcome_message: string | null
          welcome_video_url: string | null
        }
        Insert: {
          created_at?: string | null
          custom_agreements?: string[] | null
          firm_name: string
          id?: string
          logo_url?: string | null
          optional_steps?: string[] | null
          payment_amount?: number | null
          payment_frequency?: string | null
          payment_required?: boolean | null
          primary_color?: string | null
          required_steps?: string[] | null
          secondary_color?: string | null
          tenant_id: string
          updated_at?: string | null
          welcome_message?: string | null
          welcome_video_url?: string | null
        }
        Update: {
          created_at?: string | null
          custom_agreements?: string[] | null
          firm_name?: string
          id?: string
          logo_url?: string | null
          optional_steps?: string[] | null
          payment_amount?: number | null
          payment_frequency?: string | null
          payment_required?: boolean | null
          primary_color?: string | null
          required_steps?: string[] | null
          secondary_color?: string | null
          tenant_id?: string
          updated_at?: string | null
          welcome_message?: string | null
          welcome_video_url?: string | null
        }
        Relationships: []
      }
      rollup_analytics: {
        Row: {
          avg_client_satisfaction: number | null
          avg_onboarding_time_days: number | null
          calculated_at: string
          churn_rate: number | null
          created_at: string
          id: string
          new_clients_acquired: number | null
          new_firms_added: number | null
          parent_tenant_id: string
          period_end: string
          period_start: string
          total_clients: number
          total_documents_processed: number | null
          total_firms: number
          total_revenue: number | null
          total_support_tickets: number | null
          total_tax_returns: number | null
          total_users: number
        }
        Insert: {
          avg_client_satisfaction?: number | null
          avg_onboarding_time_days?: number | null
          calculated_at?: string
          churn_rate?: number | null
          created_at?: string
          id?: string
          new_clients_acquired?: number | null
          new_firms_added?: number | null
          parent_tenant_id: string
          period_end: string
          period_start: string
          total_clients?: number
          total_documents_processed?: number | null
          total_firms?: number
          total_revenue?: number | null
          total_support_tickets?: number | null
          total_tax_returns?: number | null
          total_users?: number
        }
        Update: {
          avg_client_satisfaction?: number | null
          avg_onboarding_time_days?: number | null
          calculated_at?: string
          churn_rate?: number | null
          created_at?: string
          id?: string
          new_clients_acquired?: number | null
          new_firms_added?: number | null
          parent_tenant_id?: string
          period_end?: string
          period_start?: string
          total_clients?: number
          total_documents_processed?: number | null
          total_firms?: number
          total_revenue?: number | null
          total_support_tickets?: number | null
          total_tax_returns?: number | null
          total_users?: number
        }
        Relationships: []
      }
      seat_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          ended_at: string | null
          firm_id: string
          id: string
          professional_user_id: string
          started_at: string
          status: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          ended_at?: string | null
          firm_id: string
          id?: string
          professional_user_id: string
          started_at?: string
          status?: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          ended_at?: string | null
          firm_id?: string
          id?: string
          professional_user_id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "professional_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_assignments_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_assignments_professional_user_id_fkey"
            columns: ["professional_user_id"]
            isOneToOne: false
            referencedRelation: "professional_users"
            referencedColumns: ["id"]
          },
        ]
      }
      secure_messages: {
        Row: {
          created_at: string | null
          edited_at: string | null
          encryption_key_id: string
          id: string
          is_edited: boolean | null
          message_content: string
          message_hash: string
          message_type: string | null
          reply_to_id: string | null
          sender_id: string
          tenant_id: string | null
          thread_id: string
        }
        Insert: {
          created_at?: string | null
          edited_at?: string | null
          encryption_key_id: string
          id?: string
          is_edited?: boolean | null
          message_content: string
          message_hash: string
          message_type?: string | null
          reply_to_id?: string | null
          sender_id: string
          tenant_id?: string | null
          thread_id: string
        }
        Update: {
          created_at?: string | null
          edited_at?: string | null
          encryption_key_id?: string
          id?: string
          is_edited?: boolean | null
          message_content?: string
          message_hash?: string
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string
          tenant_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "secure_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "secure_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secure_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      securities: {
        Row: {
          asset_class: string
          created_at: string | null
          expense_ratio: number | null
          id: string
          market_cap_category: string | null
          metadata: Json | null
          name: string
          sector: string | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          asset_class: string
          created_at?: string | null
          expense_ratio?: number | null
          id?: string
          market_cap_category?: string | null
          metadata?: Json | null
          name: string
          sector?: string | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          asset_class?: string
          created_at?: string | null
          expense_ratio?: number | null
          id?: string
          market_cap_category?: string | null
          metadata?: Json | null
          name?: string
          sector?: string | null
          ticker?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          changed_fields: string[] | null
          compliance_flags: string[] | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string | null
          retention_date: string | null
          session_id: string | null
          severity: string | null
          table_name: string
          tenant_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          changed_fields?: string[] | null
          compliance_flags?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id?: string | null
          retention_date?: string | null
          session_id?: string | null
          severity?: string | null
          table_name: string
          tenant_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          changed_fields?: string[] | null
          compliance_flags?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string | null
          retention_date?: string | null
          session_id?: string | null
          severity?: string | null
          table_name?: string
          tenant_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          affected_resources: Json | null
          assigned_to: string | null
          auto_remediation_applied: boolean | null
          compliance_impact: string[] | null
          created_at: string
          description: string
          evidence: Json | null
          id: string
          incident_type: string
          remediation_actions: Json | null
          resolved_at: string | null
          risk_score: number | null
          severity: string
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_resources?: Json | null
          assigned_to?: string | null
          auto_remediation_applied?: boolean | null
          compliance_impact?: string[] | null
          created_at?: string
          description: string
          evidence?: Json | null
          id?: string
          incident_type: string
          remediation_actions?: Json | null
          resolved_at?: string | null
          risk_score?: number | null
          severity: string
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_resources?: Json | null
          assigned_to?: string | null
          auto_remediation_applied?: boolean | null
          compliance_impact?: string[] | null
          created_at?: string
          description?: string
          evidence?: Json | null
          id?: string
          incident_type?: string
          remediation_actions?: Json | null
          resolved_at?: string | null
          risk_score?: number | null
          severity?: string
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_issue_reports: {
        Row: {
          affected_systems: string[] | null
          anonymized: boolean | null
          assigned_to: string | null
          created_at: string
          description: string
          evidence_urls: string[] | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          immediate_actions_taken: string | null
          incident_datetime: string | null
          issue_type: string
          location: string | null
          reported_by_user_id: string | null
          reporter_email: string
          reporter_name: string | null
          reporter_phone: string | null
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          status: string
          tenant_id: string | null
          title: string
          updated_at: string
          witnesses: string[] | null
        }
        Insert: {
          affected_systems?: string[] | null
          anonymized?: boolean | null
          assigned_to?: string | null
          created_at?: string
          description: string
          evidence_urls?: string[] | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          immediate_actions_taken?: string | null
          incident_datetime?: string | null
          issue_type: string
          location?: string | null
          reported_by_user_id?: string | null
          reporter_email: string
          reporter_name?: string | null
          reporter_phone?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
          witnesses?: string[] | null
        }
        Update: {
          affected_systems?: string[] | null
          anonymized?: boolean | null
          assigned_to?: string | null
          created_at?: string
          description?: string
          evidence_urls?: string[] | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          immediate_actions_taken?: string | null
          incident_datetime?: string | null
          issue_type?: string
          location?: string | null
          reported_by_user_id?: string | null
          reporter_email?: string
          reporter_name?: string | null
          reporter_phone?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
          witnesses?: string[] | null
        }
        Relationships: []
      }
      security_remediation_rules: {
        Row: {
          applications_count: number | null
          auto_apply: boolean | null
          cooldown_minutes: number | null
          created_at: string
          created_by: string | null
          id: string
          incident_pattern: Json
          is_active: boolean | null
          last_applied_at: string | null
          max_applications: number | null
          remediation_actions: Json
          rule_name: string
          success_rate: number | null
          updated_at: string
        }
        Insert: {
          applications_count?: number | null
          auto_apply?: boolean | null
          cooldown_minutes?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          incident_pattern: Json
          is_active?: boolean | null
          last_applied_at?: string | null
          max_applications?: number | null
          remediation_actions: Json
          rule_name: string
          success_rate?: number | null
          updated_at?: string
        }
        Update: {
          applications_count?: number | null
          auto_apply?: boolean | null
          cooldown_minutes?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          incident_pattern?: Json
          is_active?: boolean | null
          last_applied_at?: string | null
          max_applications?: number | null
          remediation_actions?: Json
          rule_name?: string
          success_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      security_review_checklists: {
        Row: {
          checklist_items: Json
          checklist_name: string
          checklist_type: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          mandatory_items: string[] | null
          tenant_id: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          checklist_items?: Json
          checklist_name: string
          checklist_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          mandatory_items?: string[] | null
          tenant_id?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          checklist_items?: Json
          checklist_name?: string
          checklist_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          mandatory_items?: string[] | null
          tenant_id?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      security_review_completions: {
        Row: {
          approved_for_production: boolean | null
          blocking_issues: string[] | null
          checklist_id: string
          checklist_responses: Json
          created_at: string
          id: string
          notes: string | null
          overall_status: string
          recommendations: string[] | null
          review_date: string
          review_subject: string
          review_type: string
          reviewed_by: string
          security_concerns: string[] | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          approved_for_production?: boolean | null
          blocking_issues?: string[] | null
          checklist_id: string
          checklist_responses?: Json
          created_at?: string
          id?: string
          notes?: string | null
          overall_status: string
          recommendations?: string[] | null
          review_date?: string
          review_subject: string
          review_type: string
          reviewed_by: string
          security_concerns?: string[] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          approved_for_production?: boolean | null
          blocking_issues?: string[] | null
          checklist_id?: string
          checklist_responses?: Json
          created_at?: string
          id?: string
          notes?: string | null
          overall_status?: string
          recommendations?: string[] | null
          review_date?: string
          review_subject?: string
          review_type?: string
          reviewed_by?: string
          security_concerns?: string[] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_review_completions_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "security_review_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      security_training_completions: {
        Row: {
          attempts: number | null
          certificate_issued: boolean | null
          certificate_url: string | null
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          passed: boolean | null
          program_id: string
          schedule_id: string | null
          score: number | null
          started_at: string | null
          tenant_id: string | null
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          passed?: boolean | null
          program_id: string
          schedule_id?: string | null
          score?: number | null
          started_at?: string | null
          tenant_id?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          passed?: boolean | null
          program_id?: string
          schedule_id?: string | null
          score?: number | null
          started_at?: string | null
          tenant_id?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_training_completions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "security_training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_training_completions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "security_training_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      security_training_programs: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          passing_score: number | null
          program_name: string
          program_type: string
          quiz_questions: Json | null
          required_for_roles: string[] | null
          tenant_id: string | null
          training_materials: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          passing_score?: number | null
          program_name: string
          program_type: string
          quiz_questions?: Json | null
          required_for_roles?: string[] | null
          tenant_id?: string | null
          training_materials?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          passing_score?: number | null
          program_name?: string
          program_type?: string
          quiz_questions?: Json | null
          required_for_roles?: string[] | null
          tenant_id?: string | null
          training_materials?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      security_training_schedules: {
        Row: {
          created_at: string
          escalation_days_after: number | null
          frequency: string
          id: string
          last_completed_date: string | null
          mandatory: boolean
          next_due_date: string
          program_id: string
          reminder_days_before: number | null
          schedule_name: string
          target_audience: string[] | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          escalation_days_after?: number | null
          frequency: string
          id?: string
          last_completed_date?: string | null
          mandatory?: boolean
          next_due_date: string
          program_id: string
          reminder_days_before?: number | null
          schedule_name: string
          target_audience?: string[] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          escalation_days_after?: number | null
          frequency?: string
          id?: string
          last_completed_date?: string | null
          mandatory?: boolean
          next_due_date?: string
          program_id?: string
          reminder_days_before?: number | null
          schedule_name?: string
          target_audience?: string[] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_training_schedules_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "security_training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      service_role_audit_logs: {
        Row: {
          compliance_flags: string[] | null
          error_message: string | null
          execution_context: string | null
          execution_time_ms: number | null
          function_name: string
          id: string
          operation_type: string
          request_metadata: Json | null
          severity: string | null
          success: boolean
          tenant_context: string | null
          timestamp: string
          user_context: string | null
        }
        Insert: {
          compliance_flags?: string[] | null
          error_message?: string | null
          execution_context?: string | null
          execution_time_ms?: number | null
          function_name: string
          id?: string
          operation_type: string
          request_metadata?: Json | null
          severity?: string | null
          success?: boolean
          tenant_context?: string | null
          timestamp?: string
          user_context?: string | null
        }
        Update: {
          compliance_flags?: string[] | null
          error_message?: string | null
          execution_context?: string | null
          execution_time_ms?: number | null
          function_name?: string
          id?: string
          operation_type?: string
          request_metadata?: Json | null
          severity?: string | null
          success?: boolean
          tenant_context?: string | null
          timestamp?: string
          user_context?: string | null
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
      signature_requests: {
        Row: {
          client_user_id: string
          cpa_partner_id: string
          created_at: string
          document_content: string
          document_template_id: string | null
          document_title: string
          id: string
          sent_at: string | null
          signature_data: Json | null
          signature_status: string
          signed_at: string | null
          updated_at: string
        }
        Insert: {
          client_user_id: string
          cpa_partner_id: string
          created_at?: string
          document_content: string
          document_template_id?: string | null
          document_title: string
          id?: string
          sent_at?: string | null
          signature_data?: Json | null
          signature_status?: string
          signed_at?: string | null
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          cpa_partner_id?: string
          created_at?: string
          document_content?: string
          document_template_id?: string | null
          document_title?: string
          id?: string
          sent_at?: string | null
          signature_data?: Json | null
          signature_status?: string
          signed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
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
      subscription_analytics: {
        Row: {
          add_on_type: string | null
          created_at: string | null
          event_type: string
          feature_name: string | null
          id: string
          metadata: Json | null
          revenue_impact: number | null
          subscription_tier: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          add_on_type?: string | null
          created_at?: string | null
          event_type: string
          feature_name?: string | null
          id?: string
          metadata?: Json | null
          revenue_impact?: number | null
          subscription_tier?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          add_on_type?: string | null
          created_at?: string | null
          event_type?: string
          feature_name?: string | null
          id?: string
          metadata?: Json | null
          revenue_impact?: number | null
          subscription_tier?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          end_date: string | null
          firm_id: string
          id: string
          next_billing_date: string
          plan_name: string
          price_per_seat: number
          seats: number
          start_date: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          end_date?: string | null
          firm_id: string
          id?: string
          next_billing_date?: string
          plan_name?: string
          price_per_seat?: number
          seats?: number
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          end_date?: string | null
          firm_id?: string
          id?: string
          next_billing_date?: string
          plan_name?: string
          price_per_seat?: number
          seats?: number
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
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
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          last_updated: string
          priority: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          last_updated?: string
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          last_updated?: string
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      sync_conflicts: {
        Row: {
          conflicting_fields: string[]
          created_at: string
          entity_id: string
          entity_type: string
          external_data: Json
          external_entity_id: string | null
          id: string
          local_data: Json
          resolution_strategy: string | null
          resolved_at: string | null
          resolved_by: string | null
          resolved_data: Json | null
          status: string
          sync_job_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          conflicting_fields: string[]
          created_at?: string
          entity_id: string
          entity_type: string
          external_data: Json
          external_entity_id?: string | null
          id?: string
          local_data: Json
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_data?: Json | null
          status?: string
          sync_job_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          conflicting_fields?: string[]
          created_at?: string
          entity_id?: string
          entity_type?: string
          external_data?: Json
          external_entity_id?: string | null
          id?: string
          local_data?: Json
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_data?: Json | null
          status?: string
          sync_job_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_conflicts_sync_job_id_fkey"
            columns: ["sync_job_id"]
            isOneToOne: false
            referencedRelation: "sync_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_jobs: {
        Row: {
          batch_size: number | null
          completed_at: string | null
          conflicts_resolved: Json | null
          created_at: string
          created_by: string | null
          direction: string
          duration_ms: number | null
          entity_type: string
          error_details: Json | null
          filters: Json
          id: string
          integration_id: string | null
          job_type: string
          progress_percentage: number | null
          records_failed: number | null
          records_processed: number | null
          records_success: number | null
          records_total: number | null
          result_summary: Json | null
          started_at: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          batch_size?: number | null
          completed_at?: string | null
          conflicts_resolved?: Json | null
          created_at?: string
          created_by?: string | null
          direction: string
          duration_ms?: number | null
          entity_type: string
          error_details?: Json | null
          filters?: Json
          id?: string
          integration_id?: string | null
          job_type: string
          progress_percentage?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_success?: number | null
          records_total?: number | null
          result_summary?: Json | null
          started_at?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          batch_size?: number | null
          completed_at?: string | null
          conflicts_resolved?: Json | null
          created_at?: string
          created_by?: string | null
          direction?: string
          duration_ms?: number | null
          entity_type?: string
          error_details?: Json | null
          filters?: Json
          id?: string
          integration_id?: string | null
          job_type?: string
          progress_percentage?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_success?: number | null
          records_total?: number | null
          result_summary?: Json | null
          started_at?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_jobs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_brackets: {
        Row: {
          bracket_order: number
          created_at: string
          created_by: string | null
          filing_status: string
          id: string
          is_active: boolean
          max_income: number | null
          min_income: number
          rate: number
          tax_year: number
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          bracket_order: number
          created_at?: string
          created_by?: string | null
          filing_status?: string
          id?: string
          is_active?: boolean
          max_income?: number | null
          min_income?: number
          rate: number
          tax_year: number
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          bracket_order?: number
          created_at?: string
          created_by?: string | null
          filing_status?: string
          id?: string
          is_active?: boolean
          max_income?: number | null
          min_income?: number
          rate?: number
          tax_year?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_completion_triggers: {
        Row: {
          content: Json
          cpa_partner_id: string
          created_at: string
          delay_days: number
          id: string
          is_active: boolean
          target_audience: Json
          trigger_name: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          cpa_partner_id: string
          created_at?: string
          delay_days?: number
          id?: string
          is_active?: boolean
          target_audience?: Json
          trigger_name: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          cpa_partner_id?: string
          created_at?: string
          delay_days?: number
          id?: string
          is_active?: boolean
          target_audience?: Json
          trigger_name?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      tax_deductions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          deduction_type: string
          description: string | null
          filing_status: string
          id: string
          is_active: boolean
          tax_year: number
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          deduction_type: string
          description?: string | null
          filing_status?: string
          id?: string
          is_active?: boolean
          tax_year: number
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          deduction_type?: string
          description?: string | null
          filing_status?: string
          id?: string
          is_active?: boolean
          tax_year?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_documents: {
        Row: {
          category: string
          created_at: string
          encrypted_key: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          professional_id: string | null
          shared_at: string | null
          shared_with_professional: boolean | null
          storage_path: string
          updated_at: string
          upload_status: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          encrypted_key?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          professional_id?: string | null
          shared_at?: string | null
          shared_with_professional?: boolean | null
          storage_path: string
          updated_at?: string
          upload_status?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          encrypted_key?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          professional_id?: string | null
          shared_at?: string | null
          shared_with_professional?: boolean | null
          storage_path?: string
          updated_at?: string
          upload_status?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_planning_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          page_context: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_context?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_context?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      tax_professionals: {
        Row: {
          available_for_new_clients: boolean | null
          bio: string | null
          created_at: string
          credentials: string[]
          hourly_rate: number | null
          id: string
          location: string | null
          professional_name: string
          rating: number | null
          review_count: number | null
          scheduling_url: string | null
          specialties: string[]
          updated_at: string
          user_id: string
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          available_for_new_clients?: boolean | null
          bio?: string | null
          created_at?: string
          credentials?: string[]
          hourly_rate?: number | null
          id?: string
          location?: string | null
          professional_name: string
          rating?: number | null
          review_count?: number | null
          scheduling_url?: string | null
          specialties?: string[]
          updated_at?: string
          user_id: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          available_for_new_clients?: boolean | null
          bio?: string | null
          created_at?: string
          credentials?: string[]
          hourly_rate?: number | null
          id?: string
          location?: string | null
          professional_name?: string
          rating?: number | null
          review_count?: number | null
          scheduling_url?: string | null
          specialties?: string[]
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      tax_rules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          effective_year: number
          expires_year: number | null
          id: string
          is_active: boolean
          rule_name: string
          rule_type: string
          rule_value: Json
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_year: number
          expires_year?: number | null
          id?: string
          is_active?: boolean
          rule_name: string
          rule_type: string
          rule_value: Json
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_year?: number
          expires_year?: number | null
          id?: string
          is_active?: boolean
          rule_name?: string
          rule_type?: string
          rule_value?: Json
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_productivity_analytics: {
        Row: {
          active_projects: number
          average_task_duration: number | null
          calculated_at: string
          client_feedback_score: number | null
          created_at: string
          documents_shared: number
          hours_logged: number
          id: string
          meetings_attended: number
          messages_sent: number
          period_end: string
          period_start: string
          productivity_score: number | null
          projects_completed: number
          task_revision_count: number
          tasks_assigned: number
          tasks_completed: number
          tasks_completion_rate: number | null
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_projects?: number
          average_task_duration?: number | null
          calculated_at?: string
          client_feedback_score?: number | null
          created_at?: string
          documents_shared?: number
          hours_logged?: number
          id?: string
          meetings_attended?: number
          messages_sent?: number
          period_end: string
          period_start: string
          productivity_score?: number | null
          projects_completed?: number
          task_revision_count?: number
          tasks_assigned?: number
          tasks_completed?: number
          tasks_completion_rate?: number | null
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_projects?: number
          average_task_duration?: number | null
          calculated_at?: string
          client_feedback_score?: number | null
          created_at?: string
          documents_shared?: number
          hours_logged?: number
          id?: string
          meetings_attended?: number
          messages_sent?: number
          period_end?: string
          period_start?: string
          productivity_score?: number | null
          projects_completed?: number
          task_revision_count?: number
          tasks_assigned?: number
          tasks_completed?: number
          tasks_completion_rate?: number | null
          tenant_id?: string
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
      tenant_hierarchies: {
        Row: {
          child_tenant_id: string
          created_at: string
          created_by: string | null
          id: string
          parent_tenant_id: string
        }
        Insert: {
          child_tenant_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          parent_tenant_id: string
        }
        Update: {
          child_tenant_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          parent_tenant_id?: string
        }
        Relationships: []
      }
      tenant_invitations: {
        Row: {
          accepted_at: string | null
          advisor_role: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_by: string
          notes: string | null
          role: string
          segments: string[] | null
          sent_at: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          advisor_role?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_token: string
          invited_by: string
          notes?: string | null
          role?: string
          segments?: string[] | null
          sent_at?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          advisor_role?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by?: string
          notes?: string | null
          role?: string
          segments?: string[] | null
          sent_at?: string
          status?: string
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
      tool_connectors: {
        Row: {
          connection_config: Json
          connection_status: string
          connector_version: string
          created_at: string
          created_by: string
          credentials_encrypted: string | null
          id: string
          last_sync_at: string | null
          project_field_map: Json
          sync_comments: boolean
          sync_errors: Json | null
          sync_files: boolean
          sync_in_progress: boolean
          sync_projects: boolean
          sync_tasks: boolean
          sync_users: boolean
          task_field_map: Json
          tenant_id: string
          tool_name: string
          tool_type: string
          updated_at: string
          user_field_map: Json
        }
        Insert: {
          connection_config?: Json
          connection_status?: string
          connector_version?: string
          created_at?: string
          created_by: string
          credentials_encrypted?: string | null
          id?: string
          last_sync_at?: string | null
          project_field_map?: Json
          sync_comments?: boolean
          sync_errors?: Json | null
          sync_files?: boolean
          sync_in_progress?: boolean
          sync_projects?: boolean
          sync_tasks?: boolean
          sync_users?: boolean
          task_field_map?: Json
          tenant_id: string
          tool_name: string
          tool_type: string
          updated_at?: string
          user_field_map?: Json
        }
        Update: {
          connection_config?: Json
          connection_status?: string
          connector_version?: string
          created_at?: string
          created_by?: string
          credentials_encrypted?: string | null
          id?: string
          last_sync_at?: string | null
          project_field_map?: Json
          sync_comments?: boolean
          sync_errors?: Json | null
          sync_files?: boolean
          sync_in_progress?: boolean
          sync_projects?: boolean
          sync_tasks?: boolean
          sync_users?: boolean
          task_field_map?: Json
          tenant_id?: string
          tool_name?: string
          tool_type?: string
          updated_at?: string
          user_field_map?: Json
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
      transaction_categories: {
        Row: {
          amount_ranges: Json | null
          category_name: string
          confidence_score: number | null
          created_at: string | null
          id: string
          is_system_generated: boolean | null
          keywords: string[] | null
          parent_category: string | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string
          vendor_patterns: string[] | null
        }
        Insert: {
          amount_ranges?: Json | null
          category_name: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_system_generated?: boolean | null
          keywords?: string[] | null
          parent_category?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
          vendor_patterns?: string[] | null
        }
        Update: {
          amount_ranges?: Json | null
          category_name?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_system_generated?: boolean | null
          keywords?: string[] | null
          parent_category?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
          vendor_patterns?: string[] | null
        }
        Relationships: []
      }
      transaction_classifications: {
        Row: {
          ai_model_used: string | null
          anomaly_reasons: string[] | null
          cleaned_description: string | null
          confidence_score: number | null
          created_at: string | null
          final_category: string | null
          id: string
          is_anomaly: boolean | null
          is_recurring: boolean | null
          learning_data: Json | null
          manual_override: boolean | null
          original_description: string
          suggested_category: string | null
          tenant_id: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          ai_model_used?: string | null
          anomaly_reasons?: string[] | null
          cleaned_description?: string | null
          confidence_score?: number | null
          created_at?: string | null
          final_category?: string | null
          id?: string
          is_anomaly?: boolean | null
          is_recurring?: boolean | null
          learning_data?: Json | null
          manual_override?: boolean | null
          original_description: string
          suggested_category?: string | null
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          ai_model_used?: string | null
          anomaly_reasons?: string[] | null
          cleaned_description?: string | null
          confidence_score?: number | null
          created_at?: string | null
          final_category?: string | null
          id?: string
          is_anomaly?: boolean | null
          is_recurring?: boolean | null
          learning_data?: Json | null
          manual_override?: boolean | null
          original_description?: string
          suggested_category?: string | null
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: []
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
      user_charities: {
        Row: {
          charity_id: string | null
          created_at: string
          date_selected: string | null
          id: string
          is_primary: boolean | null
          user_id: string
        }
        Insert: {
          charity_id?: string | null
          created_at?: string
          date_selected?: string | null
          id?: string
          is_primary?: boolean | null
          user_id: string
        }
        Update: {
          charity_id?: string | null
          created_at?: string
          date_selected?: string | null
          id?: string
          is_primary?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_charities_charity_id_fkey"
            columns: ["charity_id"]
            isOneToOne: false
            referencedRelation: "charities"
            referencedColumns: ["id"]
          },
        ]
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
      user_consent: {
        Row: {
          consent_type: string
          given_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          user_agent: string | null
          user_id: string | null
          version: string
          withdrawn_at: string | null
        }
        Insert: {
          consent_type: string
          given_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          user_agent?: string | null
          user_id?: string | null
          version: string
          withdrawn_at?: string | null
        }
        Update: {
          consent_type?: string
          given_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          user_agent?: string | null
          user_id?: string | null
          version?: string
          withdrawn_at?: string | null
        }
        Relationships: []
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
      user_donations: {
        Row: {
          amount: number
          charity_id: string | null
          created_at: string
          description: string | null
          donation_date: string
          id: string
          is_verified: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          charity_id?: string | null
          created_at?: string
          description?: string | null
          donation_date: string
          id?: string
          is_verified?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          charity_id?: string | null
          created_at?: string
          description?: string | null
          donation_date?: string
          id?: string
          is_verified?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_donations_charity_id_fkey"
            columns: ["charity_id"]
            isOneToOne: false
            referencedRelation: "charities"
            referencedColumns: ["id"]
          },
        ]
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
      user_goals: {
        Row: {
          aspirational_description: string | null
          category: Database["public"]["Enums"]["goal_category"]
          completed_at: string | null
          created_at: string
          current_amount: number
          description: string | null
          experience_story: string | null
          family_member_ids: string[] | null
          funding_frequency:
            | Database["public"]["Enums"]["funding_frequency"]
            | null
          goal_metadata: Json | null
          id: string
          image_url: string | null
          linked_account_ids: string[] | null
          monthly_contribution: number | null
          name: string
          priority: Database["public"]["Enums"]["goal_priority"] | null
          sort_order: number | null
          status: Database["public"]["Enums"]["goal_status"] | null
          target_amount: number
          target_date: string | null
          tenant_id: string
          updated_at: string
          user_id: string
          why_important: string | null
        }
        Insert: {
          aspirational_description?: string | null
          category: Database["public"]["Enums"]["goal_category"]
          completed_at?: string | null
          created_at?: string
          current_amount?: number
          description?: string | null
          experience_story?: string | null
          family_member_ids?: string[] | null
          funding_frequency?:
            | Database["public"]["Enums"]["funding_frequency"]
            | null
          goal_metadata?: Json | null
          id?: string
          image_url?: string | null
          linked_account_ids?: string[] | null
          monthly_contribution?: number | null
          name: string
          priority?: Database["public"]["Enums"]["goal_priority"] | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_amount?: number
          target_date?: string | null
          tenant_id?: string
          updated_at?: string
          user_id: string
          why_important?: string | null
        }
        Update: {
          aspirational_description?: string | null
          category?: Database["public"]["Enums"]["goal_category"]
          completed_at?: string | null
          created_at?: string
          current_amount?: number
          description?: string | null
          experience_story?: string | null
          family_member_ids?: string[] | null
          funding_frequency?:
            | Database["public"]["Enums"]["funding_frequency"]
            | null
          goal_metadata?: Json | null
          id?: string
          image_url?: string | null
          linked_account_ids?: string[] | null
          monthly_contribution?: number | null
          name?: string
          priority?: Database["public"]["Enums"]["goal_priority"] | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_amount?: number
          target_date?: string | null
          tenant_id?: string
          updated_at?: string
          user_id?: string
          why_important?: string | null
        }
        Relationships: []
      }
      user_impact_preferences: {
        Row: {
          allow_public_recognition: boolean | null
          annual_reports: boolean | null
          created_at: string
          email_notifications: boolean | null
          id: string
          quarterly_reports: boolean | null
          report_format: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_public_recognition?: boolean | null
          annual_reports?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          quarterly_reports?: boolean | null
          report_format?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_public_recognition?: boolean | null
          annual_reports?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          quarterly_reports?: boolean | null
          report_format?: string | null
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
      user_product_interests_marketplace: {
        Row: {
          advisor_response: string | null
          advisor_response_at: string | null
          created_at: string | null
          id: string
          interest_type: string
          notes: string | null
          product_id: string
          request_details: Json | null
          status: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          advisor_response?: string | null
          advisor_response_at?: string | null
          created_at?: string | null
          id?: string
          interest_type: string
          notes?: string | null
          product_id: string
          request_details?: Json | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          advisor_response?: string | null
          advisor_response_at?: string | null
          created_at?: string | null
          id?: string
          interest_type?: string
          notes?: string | null
          product_id?: string
          request_details?: Json | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_product_interests_marketplace_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "investment_products"
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
      user_sessions: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          location_data: Json | null
          revoked_at: string | null
          revoked_by: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location_data?: Json | null
          revoked_at?: string | null
          revoked_by?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location_data?: Json | null
          revoked_at?: string | null
          revoked_by?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
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
      vendor_learning: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          default_category: string | null
          frequency_pattern: string | null
          id: string
          last_seen_at: string | null
          tenant_id: string | null
          transaction_count: number | null
          typical_amounts: Json | null
          updated_at: string | null
          user_id: string
          vendor_aliases: string[] | null
          vendor_name: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          default_category?: string | null
          frequency_pattern?: string | null
          id?: string
          last_seen_at?: string | null
          tenant_id?: string | null
          transaction_count?: number | null
          typical_amounts?: Json | null
          updated_at?: string | null
          user_id: string
          vendor_aliases?: string[] | null
          vendor_name: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          default_category?: string | null
          frequency_pattern?: string | null
          id?: string
          last_seen_at?: string | null
          tenant_id?: string | null
          transaction_count?: number | null
          typical_amounts?: Json | null
          updated_at?: string | null
          user_id?: string
          vendor_aliases?: string[] | null
          vendor_name?: string
        }
        Relationships: []
      }
      video_meeting_integrations: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          provider: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          provider: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          provider?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_meetings: {
        Row: {
          attendees: Json | null
          calendar_event_id: string | null
          created_at: string
          description: string | null
          end_time: string
          external_meeting_id: string
          id: string
          integration_id: string
          join_url: string
          lead_id: string | null
          passcode: string | null
          phone_dial_in: string | null
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: Json | null
          calendar_event_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          external_meeting_id: string
          id?: string
          integration_id: string
          join_url: string
          lead_id?: string | null
          passcode?: string | null
          phone_dial_in?: string | null
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: Json | null
          calendar_event_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          external_meeting_id?: string
          id?: string
          integration_id?: string
          join_url?: string
          lead_id?: string | null
          passcode?: string | null
          phone_dial_in?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_meetings_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "video_meeting_integrations"
            referencedColumns: ["id"]
          },
        ]
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
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          provider: string
          webhook_type: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          provider: string
          webhook_type: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          provider?: string
          webhook_type?: string
        }
        Relationships: []
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
      white_label_configs: {
        Row: {
          accent_color: string | null
          brand_name: string
          contact_email: string | null
          contact_phone: string | null
          cpa_partner_id: string
          created_at: string
          custom_css: string | null
          custom_domain: string | null
          favicon_url: string | null
          features_enabled: Json | null
          font_family: string | null
          footer_text: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          pricing_tiers: Json | null
          primary_color: string | null
          privacy_url: string | null
          secondary_color: string | null
          ssl_enabled: boolean | null
          subdomain: string | null
          terms_url: string | null
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          accent_color?: string | null
          brand_name: string
          contact_email?: string | null
          contact_phone?: string | null
          cpa_partner_id: string
          created_at?: string
          custom_css?: string | null
          custom_domain?: string | null
          favicon_url?: string | null
          features_enabled?: Json | null
          font_family?: string | null
          footer_text?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          pricing_tiers?: Json | null
          primary_color?: string | null
          privacy_url?: string | null
          secondary_color?: string | null
          ssl_enabled?: boolean | null
          subdomain?: string | null
          terms_url?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          accent_color?: string | null
          brand_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          cpa_partner_id?: string
          created_at?: string
          custom_css?: string | null
          custom_domain?: string | null
          favicon_url?: string | null
          features_enabled?: Json | null
          font_family?: string | null
          footer_text?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          pricing_tiers?: Json | null
          primary_color?: string | null
          privacy_url?: string | null
          secondary_color?: string | null
          ssl_enabled?: boolean | null
          subdomain?: string | null
          terms_url?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "white_label_configs_cpa_partner_id_fkey"
            columns: ["cpa_partner_id"]
            isOneToOne: false
            referencedRelation: "cpa_partners"
            referencedColumns: ["id"]
          },
        ]
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
      audit_public_schema_extensions: {
        Args: Record<PropertyKey, never>
        Returns: {
          extension_name: string
          version: string
          schema_name: string
          is_essential: boolean
          security_risk: string
          recommendation: string
        }[]
      }
      audit_rls_coverage: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          rls_enabled: boolean
          policy_count: number
          missing_operations: string[]
          security_score: number
          recommendations: string[]
        }[]
      }
      best_model_for_holdings: {
        Args: { holdings: Json }
        Returns: {
          model_id: string
          score: number
          model_name: string
        }[]
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
      calculate_advisor_performance_metrics: {
        Args: {
          p_advisor_id: string
          p_period_start: string
          p_period_end: string
          p_period_type?: string
        }
        Returns: undefined
      }
      calculate_advisor_roi_metrics: {
        Args: {
          p_advisor_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: Json
      }
      calculate_agency_average_rating: {
        Args: { p_agency_id: string }
        Returns: number
      }
      calculate_goal_progress: {
        Args: { goal_id: string }
        Returns: number
      }
      calculate_lead_score: {
        Args: { p_lead_id: string }
        Returns: number
      }
      calculate_network_impact_summary: {
        Args: {
          p_tenant_id: string
          p_period_type: string
          p_period_start: string
          p_period_end: string
        }
        Returns: undefined
      }
      calculate_next_training_due_date: {
        Args: { p_frequency: string; p_last_completed?: string }
        Returns: string
      }
      calculate_onboarding_progress: {
        Args: { onboarding_id: string }
        Returns: number
      }
      calculate_project_analytics: {
        Args: { p_project_id: string }
        Returns: undefined
      }
      calculate_provider_rating: {
        Args: { provider_id: string }
        Returns: number
      }
      calculate_questionnaire_complexity: {
        Args: { responses: Json }
        Returns: number
      }
      calculate_security_score: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          score: number
          max_score: number
          issues: string[]
          status: string
        }[]
      }
      check_impact_milestones: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      check_nudge_triggers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_limit_type: string
          p_max_attempts?: number
          p_window_minutes?: number
          p_block_minutes?: number
        }
        Returns: Json
      }
      check_security_alerts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_expired_export_requests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_otp_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_diagnostic_runs: {
        Args: { p_retention_days?: number }
        Returns: number
      }
      complete_attorney_onboarding: {
        Args: { p_onboarding_id: string }
        Returns: boolean
      }
      count_advisors: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_clients: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_fee_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_health_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_ltc_tests: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_open_tickets: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_attorney_document: {
        Args: {
          p_onboarding_id: string
          p_document_type: string
          p_document_name: string
          p_file_path: string
          p_file_size?: number
        }
        Returns: string
      }
      create_attorney_onboarding: {
        Args: {
          p_first_name: string
          p_last_name: string
          p_email: string
          p_phone?: string
        }
        Returns: string
      }
      create_default_email_template: {
        Args: { p_advisor_id: string }
        Returns: string
      }
      create_default_onboarding_steps: {
        Args: { app_id: string } | { app_id: string }
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
      create_security_incident: {
        Args: {
          p_incident_type: string
          p_severity: string
          p_title: string
          p_description: string
          p_affected_resources?: Json
          p_evidence?: Json
          p_tenant_id?: string
        }
        Returns: string
      }
      delete_attorney_document: {
        Args: { p_document_id: string }
        Returns: boolean
      }
      detect_service_role_abuse: {
        Args: Record<PropertyKey, never>
        Returns: {
          alert_type: string
          description: string
          severity: string
          count: number
          first_occurrence: string
          last_occurrence: string
        }[]
      }
      detect_suspicious_activities: {
        Args: Record<PropertyKey, never>
        Returns: {
          alert_type: string
          description: string
          severity: string
          count: number
          first_occurrence: string
          last_occurrence: string
        }[]
      }
      detect_transaction_anomalies: {
        Args: {
          p_user_id: string
          p_vendor_name: string
          p_amount: number
          p_description: string
        }
        Returns: Json
      }
      final_security_validation: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          status: string
          remaining_issues: string[]
        }[]
      }
      generate_coach_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_compliance_report: {
        Args: { p_compliance_framework?: string }
        Returns: Json
      }
      generate_franchise_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_intake_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_secure_otp: {
        Args: { p_user_id: string; p_otp_type?: string }
        Returns: string
      }
      generate_user_impact_report: {
        Args: {
          p_user_id: string
          p_report_type: string
          p_period_start: string
          p_period_end: string
        }
        Returns: string
      }
      get_attorney_onboardings: {
        Args: { p_user_id?: string }
        Returns: {
          id: string
          user_id: string
          tenant_id: string
          current_step: string
          first_name: string
          last_name: string
          email: string
          phone: string
          office_address: string
          firm_name: string
          firm_website: string
          attorney_bio: string
          bar_number: string
          primary_jurisdiction: string
          jurisdictions_licensed: string[]
          admission_dates: Json
          bar_status: string
          cle_hours_completed: number
          cle_hours_required: number
          cle_expiration_date: string
          cle_compliance_status: string
          primary_practice_area: string
          practice_areas: string[]
          years_experience: number
          specializations: string[]
          hourly_rate: number
          consultation_fee: number
          billing_method: string
          retainer_required: boolean
          typical_retainer_amount: number
          terms_accepted: boolean
          nda_signed: boolean
          participation_agreement_signed: boolean
          status: string
          created_at: string
          updated_at: string
        }[]
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
      get_cpa_staff_permissions: {
        Args: { staff_user_id: string }
        Returns: Json
      }
      get_current_user_firm_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      get_enhanced_security_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_category: string
          metric_name: string
          metric_value: number
          status: string
          last_updated: string
          details: Json
        }[]
      }
      get_onboarding_documents: {
        Args: { p_onboarding_id: string }
        Returns: {
          id: string
          onboarding_id: string
          user_id: string
          document_type: string
          document_name: string
          file_path: string
          file_size: number
          status: string
          uploaded_at: string
          verified_at: string
          verified_by: string
        }[]
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
      get_security_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_security_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: number
          status: string
          last_updated: string
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
      has_coach_access_to_advisor: {
        Args: { p_coach_id: string; p_advisor_id: string }
        Returns: boolean
      }
      has_cpa_permission: {
        Args: { staff_user_id: string; permission_name: string }
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
      is_firm_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      log_file_access: {
        Args: {
          p_file_path: string
          p_bucket_name: string
          p_access_type: string
          p_file_size?: number
        }
        Returns: string
      }
      log_proposal_action: {
        Args: {
          p_proposal_id: string
          p_action: string
          p_details?: Json
          p_user_id?: string
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
      log_rls_violation: {
        Args: {
          p_table_name: string
          p_operation: string
          p_user_id?: string
          p_additional_context?: Json
        }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          p_event_type: string
          p_severity: string
          p_resource_type?: string
          p_resource_id?: string
          p_action_performed?: string
          p_outcome?: string
          p_metadata?: Json
        }
        Returns: string
      }
      log_service_role_usage: {
        Args: {
          p_function_name: string
          p_operation_type: string
          p_execution_context?: string
          p_user_context?: string
          p_tenant_context?: string
          p_execution_time_ms?: number
          p_success?: boolean
          p_error_message?: string
          p_request_metadata?: Json
        }
        Returns: string
      }
      process_advisor_referral: {
        Args: { p_referral_code: string; p_new_advisor_id: string }
        Returns: boolean
      }
      process_partner_application: {
        Args: { p_application_id: string; p_action: string; p_notes?: string }
        Returns: boolean
      }
      rpc_backup_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      rpc_database_health: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      schedule_follow_up: {
        Args: { p_lead_id: string; p_stage: string }
        Returns: undefined
      }
      send_onboarding_reminder: {
        Args: { p_onboarding_id: string }
        Returns: boolean
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
      track_subscription_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_feature_name?: string
          p_subscription_tier?: string
          p_add_on_type?: string
          p_usage_count?: number
          p_revenue_impact?: number
          p_metadata?: Json
        }
        Returns: string
      }
      update_agency_performance_metrics: {
        Args: {
          p_agency_id: string
          p_period_start: string
          p_period_end: string
        }
        Returns: undefined
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
      update_onboarding_status: {
        Args: { p_onboarding_id: string; p_status: string }
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
      validate_security_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_name: string
          status: string
          details: string
        }[]
      }
      validate_user_role_access: {
        Args: {
          p_required_roles: string[]
          p_resource_type?: string
          p_resource_id?: string
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
      cpa_staff_role:
        | "tax_only"
        | "bookkeeping"
        | "planning"
        | "admin"
        | "advisor"
      funding_frequency: "monthly" | "quarterly" | "annually" | "one_time"
      goal_category:
        | "retirement"
        | "healthcare_healthspan"
        | "travel_bucket_list"
        | "family_experience"
        | "charitable_giving"
        | "education"
        | "real_estate"
        | "wedding"
        | "vehicle"
        | "emergency_fund"
        | "debt_paydown"
        | "lifetime_gifting"
        | "legacy_inheritance"
        | "life_insurance"
        | "other"
      goal_priority: "low" | "medium" | "high" | "top_aspiration"
      goal_status: "active" | "completed" | "paused" | "archived"
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
    Enums: {
      cpa_staff_role: [
        "tax_only",
        "bookkeeping",
        "planning",
        "admin",
        "advisor",
      ],
      funding_frequency: ["monthly", "quarterly", "annually", "one_time"],
      goal_category: [
        "retirement",
        "healthcare_healthspan",
        "travel_bucket_list",
        "family_experience",
        "charitable_giving",
        "education",
        "real_estate",
        "wedding",
        "vehicle",
        "emergency_fund",
        "debt_paydown",
        "lifetime_gifting",
        "legacy_inheritance",
        "life_insurance",
        "other",
      ],
      goal_priority: ["low", "medium", "high", "top_aspiration"],
      goal_status: ["active", "completed", "paused", "archived"],
    },
  },
} as const
