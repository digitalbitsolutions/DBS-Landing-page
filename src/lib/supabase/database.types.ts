export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStatus = "new" | "contacted" | "closed";

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          autoresponder_sent_at: string | null;
          company: string | null;
          created_at: string;
          email: string;
          email_last_error: string | null;
          followup_reminder_sent_at: string | null;
          id: string;
          locale: string;
          metadata: Json;
          message: string;
          name: string;
          notification_sent_at: string | null;
          source: string;
          status: LeadStatus;
        };
        Insert: {
          autoresponder_sent_at?: string | null;
          company?: string | null;
          created_at?: string;
          email: string;
          email_last_error?: string | null;
          followup_reminder_sent_at?: string | null;
          id?: string;
          locale?: string;
          metadata?: Json;
          message: string;
          name: string;
          notification_sent_at?: string | null;
          source?: string;
          status?: LeadStatus;
        };
        Update: {
          autoresponder_sent_at?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string;
          email_last_error?: string | null;
          followup_reminder_sent_at?: string | null;
          id?: string;
          locale?: string;
          metadata?: Json;
          message?: string;
          name?: string;
          notification_sent_at?: string | null;
          source?: string;
          status?: LeadStatus;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string;
          featured: boolean;
          gallery: string[];
          id: string;
          image_url: string | null;
          live_url: string | null;
          order_index: number;
          repo_url: string | null;
          short_description: string;
          slug: string;
          stack: string[];
          tags: string[];
          title: string;
          translations: Json;
        };
        Insert: {
          created_at?: string;
          featured?: boolean;
          gallery?: string[];
          id?: string;
          image_url?: string | null;
          live_url?: string | null;
          order_index?: number;
          repo_url?: string | null;
          short_description: string;
          slug: string;
          stack?: string[];
          tags?: string[];
          title: string;
          translations?: Json;
        };
        Update: {
          created_at?: string;
          featured?: boolean;
          gallery?: string[];
          id?: string;
          image_url?: string | null;
          live_url?: string | null;
          order_index?: number;
          repo_url?: string | null;
          short_description?: string;
          slug?: string;
          stack?: string[];
          tags?: string[];
          title?: string;
          translations?: Json;
        };
        Relationships: [];
      };
      services: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          icon: string;
          id: string;
          order_index: number;
          slug: string | null;
          title: string;
          translations: Json;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description: string;
          icon?: string;
          id?: string;
          order_index?: number;
          slug?: string | null;
          title: string;
          translations?: Json;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          order_index?: number;
          slug?: string | null;
          title?: string;
          translations?: Json;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          contact_email: string;
          contact_phone_es: string | null;
          contact_phone_pe: string | null;
          default_locale: string;
          enabled_locales: string[];
          footer_text: string;
          groq_translation_model: string;
          hero_badge: string;
          hero_primary_cta: string;
          hero_secondary_cta: string;
          hero_subtitle: string;
          hero_title: string;
          id: number;
          location_barcelona: string | null;
          location_peru: string | null;
          autoresponder_body: string;
          autoresponder_enabled: boolean;
          autoresponder_subject: string;
          internal_notification_subject: string;
          lead_notification_enabled: boolean;
          resend_from_email: string;
          resend_from_name: string;
          seo_canonical_url: string | null;
          seo_description: string;
          seo_keywords: string[];
          seo_og_image_url: string | null;
          seo_title: string;
          site_name: string;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          contact_email: string;
          contact_phone_es?: string | null;
          contact_phone_pe?: string | null;
          default_locale?: string;
          enabled_locales?: string[];
          footer_text: string;
          groq_translation_model?: string;
          hero_badge: string;
          hero_primary_cta: string;
          hero_secondary_cta: string;
          hero_subtitle: string;
          hero_title: string;
          id?: number;
          location_barcelona?: string | null;
          location_peru?: string | null;
          autoresponder_body: string;
          autoresponder_enabled?: boolean;
          autoresponder_subject: string;
          internal_notification_subject: string;
          lead_notification_enabled?: boolean;
          resend_from_email: string;
          resend_from_name: string;
          seo_canonical_url?: string | null;
          seo_description: string;
          seo_keywords?: string[];
          seo_og_image_url?: string | null;
          seo_title: string;
          site_name: string;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          contact_email?: string;
          contact_phone_es?: string | null;
          contact_phone_pe?: string | null;
          default_locale?: string;
          enabled_locales?: string[];
          footer_text?: string;
          groq_translation_model?: string;
          hero_badge?: string;
          hero_primary_cta?: string;
          hero_secondary_cta?: string;
          hero_subtitle?: string;
          hero_title?: string;
          id?: number;
          location_barcelona?: string | null;
          location_peru?: string | null;
          autoresponder_body?: string;
          autoresponder_enabled?: boolean;
          autoresponder_subject?: string;
          internal_notification_subject?: string;
          lead_notification_enabled?: boolean;
          resend_from_email?: string;
          resend_from_name?: string;
          seo_canonical_url?: string | null;
          seo_description?: string;
          seo_keywords?: string[];
          seo_og_image_url?: string | null;
          seo_title?: string;
          site_name?: string;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
