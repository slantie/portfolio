/**
 * Type definitions for portfolio data
 * These interfaces map to future Supabase database tables
 */

// Date type used across entities
export interface DateInfo {
  month: string;
  year: number;
}

// Project category types
export type ProjectCategory =
  | "ai-ml"
  | "web-development"
  | "hackathon"
  | "academic"
  | "research"
  | "iot"
  | "cybersecurity"
  | "data-science";

// Achievement type categories
export type AchievementType =
  | "award"
  | "certificate"
  | "felicitation"
  | "publication"
  | "recognition";

// Gallery image for moments page
export interface GalleryImage {
  id?: string;
  url: string;
  date?: DateInfo;
  caption: string;
  created_at?: string;
}

// Testimonial for projects
export interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
}

// Project entity (maps to projects table in Supabase)
export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  event?: string;
  start_date: DateInfo;
  end_date?: DateInfo;
  is_ongoing?: boolean;
  image: string;
  images?: string[];
  tags: string[];
  link?: string;
  github_link?: string;
  live_link?: string;
  featured: boolean;
  is_featured?: boolean;
  category: ProjectCategory | ProjectCategory[];
  skills: string[];
  achievements?: string[];
  team_size?: number;
  role?: string;
  testimonial?: Testimonial;
  created_at?: string;
  updated_at?: string;
}

// Achievement entity (maps to achievements table in Supabase)
export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  organization: string;
  description: string;
  date: DateInfo;
  image: string;
  link?: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

// Category labels for UI display
export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "ai-ml": "AI & Machine Learning",
  "web-development": "Web Development",
  hackathon: "Hackathons",
  academic: "Academic",
  research: "Research",
  iot: "IoT",
  cybersecurity: "Cybersecurity",
  "data-science": "Data Science",
};

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementType, string> = {
  award: "Award",
  certificate: "Certificate",
  felicitation: "Felicitation",
  publication: "Publication",
  recognition: "Recognition",
};

// Month ordering utility
export const MONTHS_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthToNumber = (month: string): number => {
  return MONTHS_ORDER.indexOf(month);
};

// Experience entity
export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Skill entity
export interface Skill {
  id: string;
  name: string;
  category: string;
  order: number;
  created_at?: string;
}

// Skill categories
export type SkillCategory =
  | "programming"
  | "frameworks"
  | "tools"
  | "ai-ml"
  | "cloud"
  | "other";

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  programming: "Programming Languages",
  frameworks: "Frameworks & Libraries",
  tools: "Tools & Platforms",
  "ai-ml": "AI & Machine Learning",
  cloud: "Cloud & DevOps",
  other: "Other",
};

// Education entity
export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  location: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Certification entity
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  image: string;
  period: string;
  link?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Leadership entity
export interface Leadership {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Settings entity (for resume URL, etc.)
export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updated_at?: string;
}

// Common settings keys
export const SETTING_KEYS = {
  RESUME_URL: "resume_url",
  PROFILE_IMAGE: "profile_image",
  BIO: "bio",
  EMAIL: "email",
  LINKEDIN: "linkedin_url",
  GITHUB: "github_url",
  TWITTER: "twitter_url",
} as const;

// Blog entity
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  author: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  view_count?: number;
}

// Blog tags
export const BLOG_TAGS = [
  "AI & ML",
  "Web Development",
  "Career",
  "Hackathons",
  "Tutorial",
  "Research",
  "Personal",
  "Technology",
  "Design",
  "Productivity",
] as const;

// Item stats for analytics
export interface ItemStat {
  item_type: string;
  item_id: string;
  item_title: string;
  view_count: number;
  last_viewed_at?: string;
}
