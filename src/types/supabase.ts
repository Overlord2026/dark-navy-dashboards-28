
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
      audit_logs: {
        Row: {
          created_at: string
          details: Json
          event_type: string
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          status?: string
          user_id?: string | null
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
        Relationships: []
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          first_name: string | null
          gender: string | null
          id: string
          investor_type: string | null
          last_name: string | null
          marital_status: string | null
          middle_name: string | null
          permissions: string[] | null
          phone: string | null
          role: string | null
          suffix: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          investor_type?: string | null
          last_name?: string | null
          marital_status?: string | null
          middle_name?: string | null
          permissions?: string[] | null
          phone?: string | null
          role?: string | null
          suffix?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          investor_type?: string | null
          last_name?: string | null
          marital_status?: string | null
          middle_name?: string | null
          permissions?: string[] | null
          phone?: string | null
          role?: string | null
          suffix?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_affiliations: {
        Row: {
          awm_employee: boolean
          broker_dealer: boolean
          created_at: string
          custodian: boolean
          family_broker_dealer: boolean
          id: string
          public_company: boolean
          stock_exchange_or_finra: boolean
          updated_at: string
          us_politically_exposed: boolean
          user_id: string
        }
        Insert: {
          awm_employee?: boolean
          broker_dealer?: boolean
          created_at?: string
          custodian?: boolean
          family_broker_dealer?: boolean
          id?: string
          public_company?: boolean
          stock_exchange_or_finra?: boolean
          updated_at?: string
          us_politically_exposed?: boolean
          user_id: string
        }
        Update: {
          awm_employee?: boolean
          broker_dealer?: boolean
          created_at?: string
          custodian?: boolean
          family_broker_dealer?: boolean
          id?: string
          public_company?: boolean
          stock_exchange_or_finra?: boolean
          updated_at?: string
          us_politically_exposed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_affiliations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_beneficiaries: {
        Row: {
          address: string | null
          address2: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          relationship: string
          ssn: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          relationship: string
          ssn?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          relationship?: string
          ssn?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_beneficiaries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: unknown
        }
        Returns: boolean
      }
      notify_advisor: {
        Args: {
          type: string
          data: Json
        }
        Returns: string
      }
      update_timestamp: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
