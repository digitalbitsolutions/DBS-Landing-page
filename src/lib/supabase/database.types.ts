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
      leads: {
        Row: {
          autoresponder_sent_at: string | null
          company: string | null
          created_at: string
          email: string
          email_last_error: string | null
          followup_reminder_sent_at: string | null
          id: string
          locale: string
          message: string
          metadata: Json
          name: string
          notification_sent_at: string | null
          source: string
          status: Database["public"]["Enums"]["lead_status"]
        }
        Insert: {
          autoresponder_sent_at?: string | null
          company?: string | null
          created_at?: string
          email: string
          email_last_error?: string | null
          followup_reminder_sent_at?: string | null
          id?: string
          locale?: string
          message: string
          metadata?: Json
          name: string
          notification_sent_at?: string | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Update: {
          autoresponder_sent_at?: string | null
          company?: string | null
          created_at?: string
          email?: string
          email_last_error?: string | null
          followup_reminder_sent_at?: string | null
          id?: string
          locale?: string
          message?: string
          metadata?: Json
          name?: string
          notification_sent_at?: string | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          featured: boolean
          gallery: string[]
          id: string
          image_url: string | null
          live_url: string | null
          order_index: number
          repo_url: string | null
          short_description: string
          slug: string
          stack: string[]
          tags: string[]
          title: string
          translations: Json
        }
        Insert: {
          created_at?: string
          featured?: boolean
          gallery?: string[]
          id?: string
          image_url?: string | null
          live_url?: string | null
          order_index?: number
          repo_url?: string | null
          short_description: string
          slug: string
          stack?: string[]
          tags?: string[]
          title: string
          translations?: Json
        }
        Update: {
          created_at?: string
          featured?: boolean
          gallery?: string[]
          id?: string
          image_url?: string | null
          live_url?: string | null
          order_index?: number
          repo_url?: string | null
          short_description?: string
          slug?: string
          stack?: string[]
          tags?: string[]
          title?: string
          translations?: Json
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string
          icon: string
          id: string
          order_index: number
          slug: string | null
          title: string
          translations: Json
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          icon?: string
          id?: string
          order_index?: number
          slug?: string | null
          title: string
          translations?: Json
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          icon?: string
          id?: string
          order_index?: number
          slug?: string | null
          title?: string
          translations?: Json
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          autoresponder_body: string
          autoresponder_enabled: boolean
          autoresponder_subject: string
          contact_email: string
          contact_phone_es: string | null
          contact_phone_pe: string | null
          default_locale: string
          enabled_locales: string[]
          footer_contact_label: string
          footer_directory_label: string
          footer_tagline: string
          footer_text: string
          groq_translation_model: string
          header_access: string
          header_nav_cases: string
          header_nav_contact: string
          header_nav_process: string
          header_nav_services: string
          hero_available_badge: string
          hero_badge: string
          hero_delivery_label: string
          hero_image_url: string | null
          hero_panel_label: string
          hero_panel_title: string
          hero_primary_cta: string
          hero_secondary_cta: string
          hero_stat_ops_label: string
          hero_stat_ops_value: string
          hero_stat_projects_label: string
          hero_stat_projects_value: string
          hero_stat_years_label: string
          hero_stat_years_value: string
          hero_subtitle: string
          hero_title: string
          id: number
          internal_notification_subject: string
          lead_notification_enabled: boolean
          location_barcelona: string | null
          location_peru: string | null
          resend_from_email: string
          resend_from_name: string
          seo_canonical_url: string | null
          seo_description: string
          seo_keywords: string[]
          seo_og_image_url: string | null
          seo_title: string
          site_name: string
          ticker_label: string
          translations: Json
          updated_at: string
        }
        Insert: {
          autoresponder_body?: string
          autoresponder_enabled?: boolean
          autoresponder_subject?: string
          contact_email: string
          contact_phone_es?: string | null
          contact_phone_pe?: string | null
          default_locale?: string
          enabled_locales?: string[]
          footer_contact_label?: string
          footer_directory_label?: string
          footer_tagline?: string
          footer_text: string
          groq_translation_model?: string
          header_access?: string
          header_nav_cases?: string
          header_nav_contact?: string
          header_nav_process?: string
          header_nav_services?: string
          hero_available_badge?: string
          hero_badge?: string
          hero_delivery_label?: string
          hero_image_url?: string | null
          hero_panel_label?: string
          hero_panel_title?: string
          hero_primary_cta: string
          hero_secondary_cta: string
          hero_stat_ops_label?: string
          hero_stat_ops_value?: string
          hero_stat_projects_label?: string
          hero_stat_projects_value?: string
          hero_stat_years_label?: string
          hero_stat_years_value?: string
          hero_subtitle: string
          hero_title: string
          id?: number
          internal_notification_subject?: string
          lead_notification_enabled?: boolean
          location_barcelona?: string | null
          location_peru?: string | null
          resend_from_email: string
          resend_from_name: string
          seo_canonical_url?: string | null
          seo_description: string
          seo_keywords: string[]
          seo_og_image_url?: string | null
          seo_title: string
          site_name: string
          ticker_label?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          autoresponder_body?: string
          autoresponder_enabled?: boolean
          autoresponder_subject?: string
          contact_email?: string
          contact_phone_es?: string | null
          contact_phone_pe?: string | null
          default_locale?: string
          enabled_locales?: string[]
          footer_contact_label?: string
          footer_directory_label?: string
          footer_tagline?: string
          footer_text?: string
          groq_translation_model?: string
          header_access?: string
          header_nav_cases?: string
          header_nav_contact?: string
          header_nav_process?: string
          header_nav_services?: string
          hero_available_badge?: string
          hero_badge?: string
          hero_delivery_label?: string
          hero_image_url?: string | null
          hero_panel_label?: string
          hero_panel_title?: string
          hero_primary_cta?: string
          hero_secondary_cta?: string
          hero_stat_ops_label?: string
          hero_stat_ops_value?: string
          hero_stat_projects_label?: string
          hero_stat_projects_value?: string
          hero_stat_years_label?: string
          hero_stat_years_value?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          internal_notification_subject?: string
          lead_notification_enabled?: boolean
          location_barcelona?: string | null
          location_peru?: string | null
          resend_from_email?: string
          resend_from_name?: string
          seo_canonical_url?: string | null
          seo_description?: string
          seo_keywords?: string[]
          seo_og_image_url?: string | null
          seo_title?: string
          site_name?: string
          ticker_label?: string
          translations?: Json
          updated_at?: string
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
      lead_status: "new" | "contacted" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
