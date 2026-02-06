/**
 * API Service Layer
 * Fetches data from Supabase with fallback to static data
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ProjectRow, AchievementRow, GalleryImageRow } from "@/types/database";
import type { Project, Achievement, GalleryImage, ProjectCategory, AchievementType } from "@/types";
import {
  projects as staticProjects,
  achievements as staticAchievements,
  galleryImages as staticGalleryImages,
  mainGalleryImages as staticMainGalleryImages,
} from "@/data/data";

// Helper to bypass strict type checking for tables with incomplete type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromTable = (table: string) => supabase!.from(table) as any;


// Transform database row to frontend type
function transformProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    long_description: row.long_description ?? undefined,
    event: row.event ?? undefined,
    start_date: { month: row.start_month, year: row.start_year },
    end_date: row.end_month && row.end_year
      ? { month: row.end_month, year: row.end_year }
      : undefined,
    is_ongoing: row.is_ongoing,
    image: row.image,
    images: row.images ?? undefined,
    tags: row.tags,
    link: row.link ?? undefined,
    github_link: row.github_link ?? undefined,
    live_link: row.live_link ?? undefined,
    featured: row.featured,
    is_featured: row.is_featured,
    category: row.category as ProjectCategory[],
    skills: row.skills,
    achievements: row.achievements ?? undefined,
    team_size: row.team_size ?? undefined,
    role: row.role ?? undefined,
    testimonial: row.testimonial_quote
      ? {
          quote: row.testimonial_quote,
          author: row.testimonial_author ?? "",
          position: row.testimonial_position ?? "",
          company: row.testimonial_company ?? "",
        }
      : undefined,
  };
}

function transformAchievement(row: AchievementRow): Achievement {
  return {
    id: row.id,
    type: row.type as AchievementType,
    title: row.title,
    organization: row.organization,
    description: row.description,
    date: { month: row.date_month, year: row.date_year },
    image: row.image,
    link: row.link ?? undefined,
    tags: row.tags,
  };
}

function transformGalleryImage(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    url: row.url,
    caption: row.caption,
    date: row.date_month && row.date_year
      ? { month: row.date_month, year: row.date_year }
      : undefined,
  };
}

// Transform static data to match new types (for fallback)
function transformStaticProject(p: typeof staticProjects[0]): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    long_description: p.longDescription,
    event: p.event,
    start_date: p.startDate,
    end_date: p.endDate,
    is_ongoing: p.isOngoing,
    image: p.image,
    images: p.images,
    tags: p.tags,
    link: p.link,
    github_link: p.githubLink,
    live_link: p.liveLink,
    featured: p.featured,
    is_featured: p.isFeatured,
    category: Array.isArray(p.category) ? p.category : [p.category],
    skills: p.skills,
    achievements: p.achievements,
    team_size: p.teamSize,
    role: p.role,
    testimonial: p.testimonial,
  };
}

function transformStaticAchievement(a: typeof staticAchievements[0]): Achievement {
  return {
    id: a.id,
    type: a.type,
    title: a.title,
    organization: a.organization,
    description: a.description,
    date: a.date,
    image: a.image,
    link: a.link,
    tags: a.tags,
  };
}

// ============ Projects API ============

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticProjects.map(transformStaticProject);
  }

  const { data, error } = await fromTable("projects")
    .select("*")
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return staticProjects.map(transformStaticProject);
  }

  return data.map(transformProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured || !supabase) {
    const project = staticProjects.find((p) => p.id === id);
    return project ? transformStaticProject(project) : null;
  }

  const { data, error } = await fromTable("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    const project = staticProjects.find((p) => p.id === id);
    return project ? transformStaticProject(project) : null;
  }

  return transformProject(data);
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticProjects
      .filter((p) => {
        if (Array.isArray(p.category)) {
          return p.category.includes(category);
        }
        return p.category === category;
      })
      .map(transformStaticProject);
  }

  const { data, error } = await fromTable("projects")
    .select("*")
    .contains("category", [category])
    .order("start_year", { ascending: false });

  if (error) {
    console.error("Error fetching projects by category:", error);
    return [];
  }

  return data.map(transformProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticProjects
      .filter((p) => p.featured)
      .map(transformStaticProject);
  }

  const { data, error } = await fromTable("projects")
    .select("*")
    .eq("featured", true)
    .order("start_year", { ascending: false });

  if (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }

  return data.map(transformProject);
}

// ============ Achievements API ============

export async function getAchievements(): Promise<Achievement[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticAchievements.map(transformStaticAchievement);
  }

  const { data, error } = await fromTable("achievements")
    .select("*")
    .order("date_year", { ascending: false })
    .order("date_month", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    return staticAchievements.map(transformStaticAchievement);
  }

  return data.map(transformAchievement);
}

export async function getAchievementsByType(type: AchievementType): Promise<Achievement[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticAchievements
      .filter((a) => a.type === type)
      .map(transformStaticAchievement);
  }

  const { data, error } = await fromTable("achievements")
    .select("*")
    .eq("type", type)
    .order("date_year", { ascending: false });

  if (error) {
    console.error("Error fetching achievements by type:", error);
    return [];
  }

  return data.map(transformAchievement);
}

// ============ Gallery API ============

export async function getGalleryImages(category: "home" | "main" = "home"): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured || !supabase) {
    const images = category === "home" ? staticGalleryImages : staticMainGalleryImages;
    return images.map((img, i) => ({
      id: `gallery-${i}`,
      url: img.url,
      caption: img.caption,
      date: img.date,
    }));
  }

  const { data, error } = await fromTable("gallery_images")
    .select("*")
    .eq("category", category)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching gallery images:", error);
    const images = category === "home" ? staticGalleryImages : staticMainGalleryImages;
    return images.map((img, i) => ({
      id: `gallery-${i}`,
      url: img.url,
      caption: img.caption,
      date: img.date,
    }));
  }

  return data.map(transformGalleryImage);
}

// ============ Admin CRUD Operations ============

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project | null> {
  if (!supabase) {
    console.error("Supabase not configured");
    return null;
  }

  const { data, error } = await fromTable("projects")
    .insert({
      title: project.title,
      description: project.description,
      long_description: project.long_description,
      event: project.event,
      start_month: project.start_date.month,
      start_year: project.start_date.year,
      end_month: project.end_date?.month,
      end_year: project.end_date?.year,
      is_ongoing: project.is_ongoing ?? false,
      image: project.image,
      images: project.images,
      tags: project.tags,
      link: project.link,
      github_link: project.github_link,
      live_link: project.live_link,
      featured: project.featured,
      is_featured: project.is_featured ?? false,
      category: Array.isArray(project.category) ? project.category : [project.category],
      skills: project.skills,
      achievements: project.achievements,
      team_size: project.team_size,
      role: project.role,
      testimonial_quote: project.testimonial?.quote,
      testimonial_author: project.testimonial?.author,
      testimonial_position: project.testimonial?.position,
      testimonial_company: project.testimonial?.company,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    return null;
  }

  return transformProject(data);
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (!supabase) {
    console.error("Supabase not configured");
    return null;
  }

  const updateData: Record<string, unknown> = {};
  
  if (updates.title) updateData.title = updates.title;
  if (updates.description) updateData.description = updates.description;
  if (updates.long_description !== undefined) updateData.long_description = updates.long_description;
  if (updates.event !== undefined) updateData.event = updates.event;
  if (updates.start_date) {
    updateData.start_month = updates.start_date.month;
    updateData.start_year = updates.start_date.year;
  }
  if (updates.end_date !== undefined) {
    updateData.end_month = updates.end_date?.month;
    updateData.end_year = updates.end_date?.year;
  }
  if (updates.is_ongoing !== undefined) updateData.is_ongoing = updates.is_ongoing;
  if (updates.image) updateData.image = updates.image;
  if (updates.images !== undefined) updateData.images = updates.images;
  if (updates.tags) updateData.tags = updates.tags;
  if (updates.skills) updateData.skills = updates.skills;
  if (updates.category) {
    updateData.category = Array.isArray(updates.category) ? updates.category : [updates.category];
  }
  if (updates.featured !== undefined) updateData.featured = updates.featured;

  const { data, error } = await fromTable("projects")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    return null;
  }

  return transformProject(data);
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!supabase) {
    console.error("Supabase not configured");
    return false;
  }

  const { error } = await fromTable("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    return false;
  }

  return true;
}

export async function createAchievement(achievement: Omit<Achievement, "id" | "created_at" | "updated_at">): Promise<Achievement | null> {
  if (!supabase) {
    console.error("Supabase not configured");
    return null;
  }

  const { data, error } = await fromTable("achievements")
    .insert({
      type: achievement.type,
      title: achievement.title,
      organization: achievement.organization,
      description: achievement.description,
      date_month: achievement.date.month,
      date_year: achievement.date.year,
      image: achievement.image,
      link: achievement.link,
      tags: achievement.tags,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating achievement:", error);
    return null;
  }

  return transformAchievement(data);
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | null> {
  if (!supabase) {
    console.error("Supabase not configured");
    return null;
  }

  const updateData: Record<string, unknown> = {};
  
  if (updates.type) updateData.type = updates.type;
  if (updates.title) updateData.title = updates.title;
  if (updates.organization) updateData.organization = updates.organization;
  if (updates.description) updateData.description = updates.description;
  if (updates.date) {
    updateData.date_month = updates.date.month;
    updateData.date_year = updates.date.year;
  }
  if (updates.image) updateData.image = updates.image;
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.tags) updateData.tags = updates.tags;

  const { data, error } = await fromTable("achievements")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating achievement:", error);
    return null;
  }

  return transformAchievement(data);
}

export async function deleteAchievement(id: string): Promise<boolean> {
  if (!supabase) {
    console.error("Supabase not configured");
    return false;
  }

  const { error } = await fromTable("achievements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting achievement:", error);
    return false;
  }

  return true;
}

export async function createGalleryImage(image: Omit<GalleryImage, "id" | "created_at">, category: "home" | "main" | "moments" = "main"): Promise<GalleryImage | null> {
  if (!supabase) {
    console.error("Supabase not configured");
    return null;
  }

  const { data, error } = await fromTable("gallery_images")
    .insert({
      url: image.url,
      caption: image.caption,
      date_month: image.date?.month,
      date_year: image.date?.year,
      category,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating gallery image:", error);
    return null;
  }

  return transformGalleryImage(data);
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  if (!supabase) {
    console.error("Supabase not configured");
    return false;
  }

  const { error } = await fromTable("gallery_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting gallery image:", error);
    return false;
  }

  return true;
}

// ============================================
// Experiences API
// ============================================

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
}

export async function getExperiences(): Promise<Experience[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await fromTable("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    period: row.period,
    description: row.description || "",
    order: row.sort_order,
  }));
}

export async function createExperience(
  experience: Omit<Experience, "id">
): Promise<Experience | null> {
  if (!supabase) return null;

  const { data, error } = await fromTable("experiences")
    .insert({
      title: experience.title,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      sort_order: experience.order,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating experience:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    company: data.company,
    period: data.period,
    description: data.description || "",
    order: data.sort_order,
  };
}

export async function updateExperience(
  id: string,
  experience: Partial<Omit<Experience, "id">>
): Promise<Experience | null> {
  if (!supabase) return null;

  const updateData: Record<string, unknown> = {};
  if (experience.title !== undefined) updateData.title = experience.title;
  if (experience.company !== undefined) updateData.company = experience.company;
  if (experience.period !== undefined) updateData.period = experience.period;
  if (experience.description !== undefined) updateData.description = experience.description;
  if (experience.order !== undefined) updateData.sort_order = experience.order;

  const { data, error } = await fromTable("experiences")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating experience:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    company: data.company,
    period: data.period,
    description: data.description || "",
    order: data.sort_order,
  };
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("experiences").delete().eq("id", id);

  if (error) {
    console.error("Error deleting experience:", error);
    return false;
  }

  return true;
}

// ============================================
// Skills API
// ============================================

export interface Skill {
  id: string;
  name: string;
  category: string;
  order: number;
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await fromTable("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category || "other",
    order: row.sort_order,
  }));
}

export async function createSkill(skill: Omit<Skill, "id">): Promise<Skill | null> {
  if (!supabase) return null;

  const { data, error } = await fromTable("skills")
    .insert({
      name: skill.name,
      category: skill.category,
      sort_order: skill.order,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating skill:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category || "other",
    order: data.sort_order,
  };
}

export async function updateSkill(
  id: string,
  skill: Partial<Omit<Skill, "id">>
): Promise<Skill | null> {
  if (!supabase) return null;

  const updateData: Record<string, unknown> = {};
  if (skill.name !== undefined) updateData.name = skill.name;
  if (skill.category !== undefined) updateData.category = skill.category;
  if (skill.order !== undefined) updateData.sort_order = skill.order;

  const { data, error } = await fromTable("skills")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating skill:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category || "other",
    order: data.sort_order,
  };
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("skills").delete().eq("id", id);

  if (error) {
    console.error("Error deleting skill:", error);
    return false;
  }

  return true;
}

// ============================================
// Education API
// ============================================

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  location: string;
  order: number;
}

export async function getEducation(): Promise<Education[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await fromTable("education")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching education:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    degree: row.degree,
    institution: row.institution,
    period: row.period,
    description: row.description || "",
    location: row.location || "",
    order: row.sort_order,
  }));
}

export async function createEducation(
  education: Omit<Education, "id">
): Promise<Education | null> {
  if (!supabase) return null;

  const { data, error } = await fromTable("education")
    .insert({
      degree: education.degree,
      institution: education.institution,
      period: education.period,
      description: education.description,
      location: education.location,
      sort_order: education.order,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating education:", error);
    return null;
  }

  return {
    id: data.id,
    degree: data.degree,
    institution: data.institution,
    period: data.period,
    description: data.description || "",
    location: data.location || "",
    order: data.sort_order,
  };
}

export async function updateEducation(
  id: string,
  education: Partial<Omit<Education, "id">>
): Promise<Education | null> {
  if (!supabase) return null;

  const updateData: Record<string, unknown> = {};
  if (education.degree !== undefined) updateData.degree = education.degree;
  if (education.institution !== undefined) updateData.institution = education.institution;
  if (education.period !== undefined) updateData.period = education.period;
  if (education.description !== undefined) updateData.description = education.description;
  if (education.location !== undefined) updateData.location = education.location;
  if (education.order !== undefined) updateData.sort_order = education.order;

  const { data, error } = await fromTable("education")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating education:", error);
    return null;
  }

  return {
    id: data.id,
    degree: data.degree,
    institution: data.institution,
    period: data.period,
    description: data.description || "",
    location: data.location || "",
    order: data.sort_order,
  };
}

export async function deleteEducation(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("education").delete().eq("id", id);

  if (error) {
    console.error("Error deleting education:", error);
    return false;
  }

  return true;
}

// ============================================
// Certifications API
// ============================================

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  image: string;
  period: string;
  link?: string;
  order: number;
}

export async function getCertifications(): Promise<Certification[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await fromTable("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    image: row.image,
    period: row.period,
    link: row.link || undefined,
    order: row.sort_order,
  }));
}

export async function createCertification(
  certification: Omit<Certification, "id">
): Promise<Certification | null> {
  if (!supabase) return null;

  const { data, error } = await fromTable("certifications")
    .insert({
      title: certification.title,
      issuer: certification.issuer,
      image: certification.image,
      period: certification.period,
      link: certification.link,
      sort_order: certification.order,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating certification:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    issuer: data.issuer,
    image: data.image,
    period: data.period,
    link: data.link || undefined,
    order: data.sort_order,
  };
}

export async function updateCertification(
  id: string,
  certification: Partial<Omit<Certification, "id">>
): Promise<Certification | null> {
  if (!supabase) return null;

  const updateData: Record<string, unknown> = {};
  if (certification.title !== undefined) updateData.title = certification.title;
  if (certification.issuer !== undefined) updateData.issuer = certification.issuer;
  if (certification.image !== undefined) updateData.image = certification.image;
  if (certification.period !== undefined) updateData.period = certification.period;
  if (certification.link !== undefined) updateData.link = certification.link;
  if (certification.order !== undefined) updateData.sort_order = certification.order;

  const { data, error } = await fromTable("certifications")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating certification:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    issuer: data.issuer,
    image: data.image,
    period: data.period,
    link: data.link || undefined,
    order: data.sort_order,
  };
}

export async function deleteCertification(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("certifications").delete().eq("id", id);

  if (error) {
    console.error("Error deleting certification:", error);
    return false;
  }

  return true;
}

// ============================================
// Leadership API
// ============================================

export interface Leadership {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  order: number;
}

export async function getLeadership(): Promise<Leadership[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await fromTable("leadership")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching leadership:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    organization: row.organization,
    period: row.period,
    description: row.description || "",
    order: row.sort_order,
  }));
}

export async function createLeadership(
  leadership: Omit<Leadership, "id">
): Promise<Leadership | null> {
  if (!supabase) return null;

  const { data, error } = await fromTable("leadership")
    .insert({
      title: leadership.title,
      organization: leadership.organization,
      period: leadership.period,
      description: leadership.description,
      sort_order: leadership.order,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating leadership:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    organization: data.organization,
    period: data.period,
    description: data.description || "",
    order: data.sort_order,
  };
}

export async function updateLeadership(
  id: string,
  leadership: Partial<Omit<Leadership, "id">>
): Promise<Leadership | null> {
  if (!supabase) return null;

  const updateData: Record<string, unknown> = {};
  if (leadership.title !== undefined) updateData.title = leadership.title;
  if (leadership.organization !== undefined) updateData.organization = leadership.organization;
  if (leadership.period !== undefined) updateData.period = leadership.period;
  if (leadership.description !== undefined) updateData.description = leadership.description;
  if (leadership.order !== undefined) updateData.sort_order = leadership.order;

  const { data, error } = await fromTable("leadership")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating leadership:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    organization: data.organization,
    period: data.period,
    description: data.description || "",
    order: data.sort_order,
  };
}

export async function deleteLeadership(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("leadership").delete().eq("id", id);

  if (error) {
    console.error("Error deleting leadership:", error);
    return false;
  }

  return true;
}

// ============================================
// Settings API
// ============================================

export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export async function getSettings(): Promise<Setting[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await fromTable("settings").select("*");

  if (error) {
    console.error("Error fetching settings:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    key: row.key,
    value: row.value,
    description: row.description || undefined,
  }));
}

export async function getSetting(key: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await fromTable("settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    console.error("Error fetching setting:", error);
    return null;
  }

  return data?.value ?? null;
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("settings")
    .update({ value })
    .eq("key", key);

  if (error) {
    console.error("Error updating setting:", error);
    return false;
  }

  return true;
}

export async function upsertSetting(
  key: string,
  value: string,
  description?: string
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("settings").upsert(
    {
      key,
      value,
      description,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("Error upserting setting:", error);
    return false;
  }

  return true;
}

// ============================================
// Analytics & Visitor Tracking
// ============================================

export interface PageView {
  id: string;
  page: string;
  visitor_id: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

export interface DailyStats {
  id: string;
  date: string;
  total_views: number;
  unique_visitors: number;
  page_views: Record<string, number>;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

// Generate or get visitor ID from localStorage
function getVisitorId(): string {
  const key = "portfolio_visitor_id";
  let visitorId = localStorage.getItem(key);
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  
  return visitorId;
}

// Track a page view
export async function trackPageView(page: string): Promise<void> {
  if (!supabase) return;

  try {
    const visitorId = getVisitorId();
    
    await fromTable("page_views").insert({
      page,
      visitor_id: visitorId,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });
  } catch (error) {
    // Silently fail - don't break the app for analytics
    console.debug("Page view tracking failed:", error);
  }
}

// Get total stats
export async function getTotalStats(): Promise<{
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayVisitors: number;
}> {
  if (!supabase) {
    return { totalViews: 0, uniqueVisitors: 0, todayViews: 0, todayVisitors: 0 };
  }

  try {
    // Get all-time stats
    const { count: totalViews } = await fromTable("page_views")
      .select("*", { count: "exact", head: true });

    const { data: uniqueData } = await fromTable("page_views")
      .select("visitor_id")
      .limit(10000);
    
    const uniqueVisitors = new Set(uniqueData?.map((d) => d.visitor_id)).size;

    // Get today's stats
    const today = new Date().toISOString().split("T")[0];
    const { count: todayViews } = await fromTable("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`);

    const { data: todayUniqueData } = await fromTable("page_views")
      .select("visitor_id")
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`);

    const todayVisitors = new Set(todayUniqueData?.map((d) => d.visitor_id)).size;

    return {
      totalViews: totalViews || 0,
      uniqueVisitors,
      todayViews: todayViews || 0,
      todayVisitors,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { totalViews: 0, uniqueVisitors: 0, todayViews: 0, todayVisitors: 0 };
  }
}

// Get stats for last N days
export async function getRecentStats(days: number = 7): Promise<{
  date: string;
  views: number;
  visitors: number;
}[]> {
  if (!supabase) return [];

  try {
    const results: { date: string; views: number; visitors: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const { count: views } = await fromTable("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${dateStr}T00:00:00`)
        .lt("created_at", `${dateStr}T23:59:59`);

      const { data: visitorsData } = await fromTable("page_views")
        .select("visitor_id")
        .gte("created_at", `${dateStr}T00:00:00`)
        .lt("created_at", `${dateStr}T23:59:59`);

      results.push({
        date: dateStr,
        views: views || 0,
        visitors: new Set(visitorsData?.map((d) => d.visitor_id)).size,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching recent stats:", error);
    return [];
  }
}

// Get top pages
export async function getTopPages(limit: number = 10): Promise<{
  page: string;
  views: number;
}[]> {
  if (!supabase) return [];

  try {
    const { data } = await fromTable("page_views")
      .select("page");

    if (!data) return [];

    const pageCounts: Record<string, number> = {};
    for (const row of data) {
      pageCounts[row.page] = (pageCounts[row.page] || 0) + 1;
    }

    return Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching top pages:", error);
    return [];
  }
}

// ============================================
// Contact Messages
// ============================================

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("contact_messages").insert({
    name: data.name,
    email: data.email,
    subject: data.subject || null,
    message: data.message,
  });

  if (error) {
    console.error("Error submitting contact message:", error);
    return false;
  }

  return true;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!supabase) return [];

  const { data, error } = await fromTable("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }

  return data || [];
}

export async function markMessageAsRead(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("contact_messages")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking message as read:", error);
    return false;
  }

  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await fromTable("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting contact message:", error);
    return false;
  }

  return true;
}

// ============================================
// Per-Item View Tracking
// ============================================

export type ItemType = "project" | "achievement" | "gallery" | "blog";

// Track a view on a specific item (project, achievement, or gallery image)
export async function trackItemView(
  itemType: ItemType,
  itemId: string,
  itemTitle?: string
): Promise<void> {
  if (!supabase) return;

  try {
    const visitorId = getVisitorId();
    
    await fromTable("item_views").insert({
      item_type: itemType,
      item_id: itemId,
      item_title: itemTitle || null,
      visitor_id: visitorId,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });
  } catch (error) {
    console.debug("Item view tracking failed:", error);
  }
}

// Get stats for a specific item
export async function getItemStats(
  itemType: ItemType,
  itemId: string
): Promise<{ totalViews: number; uniqueVisitors: number } | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await fromTable("item_stats")
      .select("total_views, unique_visitors")
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .single();

    if (error || !data) return null;

    return {
      totalViews: data.total_views,
      uniqueVisitors: data.unique_visitors,
    };
  } catch (error) {
    console.error("Error fetching item stats:", error);
    return null;
  }
}

// Get top viewed items by type
export async function getTopItems(
  itemType: ItemType,
  limit: number = 10
): Promise<{
  itemId: string;
  itemTitle: string;
  totalViews: number;
  uniqueVisitors: number;
}[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await fromTable("item_stats")
      .select("item_id, item_title, total_views, unique_visitors")
      .eq("item_type", itemType)
      .order("total_views", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((d) => ({
      itemId: d.item_id,
      itemTitle: d.item_title || "Unknown",
      totalViews: d.total_views,
      uniqueVisitors: d.unique_visitors,
    }));
  } catch (error) {
    console.error("Error fetching top items:", error);
    return [];
  }
}

// Get all item stats for admin dashboard
export async function getAllItemStats(): Promise<{
  projects: { itemId: string; itemTitle: string; totalViews: number; uniqueVisitors: number }[];
  achievements: { itemId: string; itemTitle: string; totalViews: number; uniqueVisitors: number }[];
  gallery: { itemId: string; itemTitle: string; totalViews: number; uniqueVisitors: number }[];
}> {
  const [projects, achievements, gallery] = await Promise.all([
    getTopItems("project", 50),
    getTopItems("achievement", 50),
    getTopItems("gallery", 50),
  ]);

  return { projects, achievements, gallery };
}

// Get counts for admin dashboard
export async function getAdminDashboardCounts(): Promise<{
  projects: number;
  achievements: number;
  galleryImages: number;
  unreadMessages: number;
}> {
  if (!supabase) {
    return { projects: 0, achievements: 0, galleryImages: 0, unreadMessages: 0 };
  }

  try {
    const [projectsRes, achievementsRes, galleryRes, messagesRes] = await Promise.all([
      fromTable("projects").select("*", { count: "exact", head: true }),
      fromTable("achievements").select("*", { count: "exact", head: true }),
      fromTable("gallery_images").select("*", { count: "exact", head: true }),
      fromTable("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
    ]);

    return {
      projects: projectsRes.count || 0,
      achievements: achievementsRes.count || 0,
      galleryImages: galleryRes.count || 0,
      unreadMessages: messagesRes.count || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return { projects: 0, achievements: 0, galleryImages: 0, unreadMessages: 0 };
  }
}

// ==========================================
// BLOG FUNCTIONS
// ==========================================

import type { Blog, ItemStat } from "@/types";

// Get all blogs (published only for public, all for admin)
export async function getBlogs(includeUnpublished = false): Promise<Blog[]> {
  if (!supabase) {
    return [];
  }

  try {
    let query = supabase
      .from("blogs")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: true })
      .order("created_at", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Get single blog by slug or ID
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await fromTable("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function getBlogById(id: string): Promise<Blog | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await fromTable("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// Create a new blog
export async function createBlog(blog: Partial<Blog>): Promise<Blog | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await fromTable("blogs")
      .insert({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        cover_image: blog.cover_image || null,
        author: blog.author || "Slantie",
        tags: blog.tags || [],
        published: blog.published || false,
        featured: blog.featured || false,
        published_at: blog.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating blog:", error);
    return null;
  }
}

// Update a blog
export async function updateBlog(id: string, blog: Partial<Blog>): Promise<Blog | null> {
  if (!supabase) return null;

  try {
    const updateData: Record<string, unknown> = {
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image: blog.cover_image || null,
      author: blog.author,
      tags: blog.tags,
      featured: blog.featured,
    };

    // Handle publish status change
    if (blog.published !== undefined) {
      updateData.published = blog.published;
      if (blog.published) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await fromTable("blogs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating blog:", error);
    return null;
  }
}

// Delete a blog
export async function deleteBlog(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await fromTable("blogs").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    return false;
  }
}

