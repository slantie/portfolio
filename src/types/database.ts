/**
 * Database types for Supabase
 * These types define the structure of your Supabase database tables
 * 
 * To generate these automatically from your Supabase project, run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          long_description: string | null;
          event: string | null;
          start_month: string;
          start_year: number;
          end_month: string | null;
          end_year: number | null;
          is_ongoing: boolean;
          image: string;
          images: string[] | null;
          tags: string[];
          link: string | null;
          github_link: string | null;
          live_link: string | null;
          featured: boolean;
          is_featured: boolean;
          category: string[];
          skills: string[];
          achievements: string[] | null;
          team_size: number | null;
          role: string | null;
          testimonial_quote: string | null;
          testimonial_author: string | null;
          testimonial_position: string | null;
          testimonial_company: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          long_description?: string | null;
          event?: string | null;
          start_month: string;
          start_year: number;
          end_month?: string | null;
          end_year?: number | null;
          is_ongoing?: boolean;
          image: string;
          images?: string[] | null;
          tags?: string[];
          link?: string | null;
          github_link?: string | null;
          live_link?: string | null;
          featured?: boolean;
          is_featured?: boolean;
          category?: string[];
          skills?: string[];
          achievements?: string[] | null;
          team_size?: number | null;
          role?: string | null;
          testimonial_quote?: string | null;
          testimonial_author?: string | null;
          testimonial_position?: string | null;
          testimonial_company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          long_description?: string | null;
          event?: string | null;
          start_month?: string;
          start_year?: number;
          end_month?: string | null;
          end_year?: number | null;
          is_ongoing?: boolean;
          image?: string;
          images?: string[] | null;
          tags?: string[];
          link?: string | null;
          github_link?: string | null;
          live_link?: string | null;
          featured?: boolean;
          is_featured?: boolean;
          category?: string[];
          skills?: string[];
          achievements?: string[] | null;
          team_size?: number | null;
          role?: string | null;
          testimonial_quote?: string | null;
          testimonial_author?: string | null;
          testimonial_position?: string | null;
          testimonial_company?: string | null;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          type: string;
          title: string;
          organization: string;
          description: string;
          date_month: string;
          date_year: number;
          image: string;
          link: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          organization: string;
          description: string;
          date_month: string;
          date_year: number;
          image: string;
          link?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          organization?: string;
          description?: string;
          date_month?: string;
          date_year?: number;
          image?: string;
          link?: string | null;
          tags?: string[];
          updated_at?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          url: string;
          caption: string;
          date_month: string | null;
          date_year: number | null;
          category: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          caption: string;
          date_month?: string | null;
          date_year?: number | null;
          category?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          caption?: string;
          date_month?: string | null;
          date_year?: number | null;
          category?: string;
          sort_order?: number;
        };
      };
      experiences: {
        Row: {
          id: string;
          title: string;
          company: string;
          period: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          period: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          period?: string;
          description?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          degree: string;
          institution: string;
          period: string;
          description: string | null;
          location: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          degree: string;
          institution: string;
          period: string;
          description?: string | null;
          location?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          degree?: string;
          institution?: string;
          period?: string;
          description?: string | null;
          location?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          image: string;
          period: string;
          link: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          image: string;
          period: string;
          link?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          image?: string;
          period?: string;
          link?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      leadership: {
        Row: {
          id: string;
          title: string;
          organization: string;
          period: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization: string;
          period: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization?: string;
          period?: string;
          description?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
      blogs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          tags: string[] | null;
          featured: boolean;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image?: string | null;
          tags?: string[] | null;
          featured?: boolean;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string | null;
          tags?: string[] | null;
          featured?: boolean;
          published?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          read?: boolean;
        };
      };
      item_stats: {
        Row: {
          id: string;
          item_id: string;
          item_type: string;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          item_type: string;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          item_type?: string;
          views?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_category: "ai-ml" | "web-development" | "hackathon" | "academic" | "research" | "iot" | "cybersecurity" | "data-science";
      achievement_type: "award" | "certificate" | "felicitation" | "publication" | "recognition";
      gallery_category: "home" | "main" | "moments";
    };
  };
}

// Helper types for easier usage
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type AchievementRow = Database["public"]["Tables"]["achievements"]["Row"];
export type AchievementInsert = Database["public"]["Tables"]["achievements"]["Insert"];
export type AchievementUpdate = Database["public"]["Tables"]["achievements"]["Update"];

export type GalleryImageRow = Database["public"]["Tables"]["gallery_images"]["Row"];
export type GalleryImageInsert = Database["public"]["Tables"]["gallery_images"]["Insert"];
export type GalleryImageUpdate = Database["public"]["Tables"]["gallery_images"]["Update"];

export type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
export type ExperienceInsert = Database["public"]["Tables"]["experiences"]["Insert"];
export type ExperienceUpdate = Database["public"]["Tables"]["experiences"]["Update"];

export type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
export type SkillUpdate = Database["public"]["Tables"]["skills"]["Update"];

export type EducationRow = Database["public"]["Tables"]["education"]["Row"];
export type EducationInsert = Database["public"]["Tables"]["education"]["Insert"];
export type EducationUpdate = Database["public"]["Tables"]["education"]["Update"];

export type CertificationRow = Database["public"]["Tables"]["certifications"]["Row"];
export type CertificationInsert = Database["public"]["Tables"]["certifications"]["Insert"];
export type CertificationUpdate = Database["public"]["Tables"]["certifications"]["Update"];

export type LeadershipRow = Database["public"]["Tables"]["leadership"]["Row"];
export type LeadershipInsert = Database["public"]["Tables"]["leadership"]["Insert"];
export type LeadershipUpdate = Database["public"]["Tables"]["leadership"]["Update"];

export type SettingRow = Database["public"]["Tables"]["settings"]["Row"];
export type SettingInsert = Database["public"]["Tables"]["settings"]["Insert"];
export type SettingUpdate = Database["public"]["Tables"]["settings"]["Update"];

export type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];
export type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"];
export type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"];

export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export type ItemStatRow = Database["public"]["Tables"]["item_stats"]["Row"];
export type ItemStatInsert = Database["public"]["Tables"]["item_stats"]["Insert"];
export type ItemStatUpdate = Database["public"]["Tables"]["item_stats"]["Update"];
