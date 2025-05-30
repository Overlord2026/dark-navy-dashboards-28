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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          date_of_birth_date: string | null
          display_name: string | null
          email: string | null
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
          date_of_birth_date?: string | null
          display_name?: string | null
          email?: string | null
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
          date_of_birth_date?: string | null
          display_name?: string | null
          email?: string | null
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
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
