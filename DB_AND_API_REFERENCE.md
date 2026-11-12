# Portfolio data, database, and API reference

This is the implementation contract for the portfolio application. It is intended to let another agent build or redesign a public portfolio without guessing at data formats or accidentally exposing private workspace content.

## 1. System overview

The client is a Vite + React application that talks directly to **Supabase** using `@supabase/supabase-js`; there is no separate REST/Express backend in this repository.

```text
Public pages ─┬─ Supabase public portfolio tables
              ├─ Static fallback in src/data/data.ts (when Supabase is unavailable)
              └─ Cloudinary URLs stored as plain strings for images

Private /slantie workspace ─ Supabase Auth + RLS-protected tables + private storage
```

Configuration is entirely client-side environment variables:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned-upload-preset>
```

When either Supabase variable is absent, the main portfolio fetch functions use the static project, achievement, and gallery content in `src/data/data.ts`. Admin CRUD calls return failure in that mode. Cloudinary is optional, but the existing admin image workflow expects it.

**Do not use a service-role key in this browser application.** The anon key is meant to be public; access control must live in Supabase Row Level Security (RLS).

## 2. Data domains and safety boundary

| Domain | Tables / storage | Visibility | Use in a portfolio redesign |
| --- | --- | --- | --- |
| Public portfolio content | `projects`, `achievements`, `gallery_images`, `experiences`, `skills`, `education`, `certifications`, `leadership`, `settings`, `blogs` | Intended for public pages and authenticated admin editing | Use this domain for the website. |
| Contact and analytics | `contact_messages`, `page_views`, `item_views`, `item_stats` | Contact messages and dashboard analytics should be admin-only; page/item tracking needs narrowly scoped public insert access if retained | Do not render raw messages, visitor IDs, user agents, or referrers publicly. |
| Private productivity / academic workspace | `workspace_*`, `leetcode_progress`, `job_applications`, `workspace-library` bucket | Authenticated owner only, enforced by migrations/RLS | Never query or surface this content on public portfolio routes. |
| Static fallback | `src/data/data.ts` | Bundled into the browser | Use only for public display; it cannot be edited by an administrator at runtime. |

## 3. Formats used everywhere

| Format | Representation | Example / rule |
| --- | --- | --- |
| IDs | UUID strings | `f6261fa4-69b4-483d-a044-1c543fb510b8` |
| Dates/times | Supabase returns ISO-8601 strings | `2026-08-14T12:30:00Z`; `date` columns return `YYYY-MM-DD` |
| Portfolio month/year | two separate fields | `start_month: "August"`, `start_year: 2025`; months are full English names |
| Lists | PostgreSQL `text[]`, represented as `string[]` | `tags`, `skills`, `category`, `images` |
| Rich blog body | plain `text` | Existing UI treats `blogs.content` as a string; decide and sanitize a rendering format before enabling HTML/Markdown. |
| Images and links | URL strings | Existing media is normally a Cloudinary HTTPS URL, but any valid safe HTTPS URL is possible. |
| Sort order | integer, ascending | `sort_order` / UI alias `order`; lower number appears first. |

All timestamp fields are server-style strings in TypeScript. Treat timestamps as UTC, store UTC, and localize only at rendering time.

## 4. Public portfolio schema

The TypeScript source of truth is `src/types/database.ts`. The concise table shapes below describe a selected row (required fields have no `?`; `null` means SQL NULL).

### `projects`

```ts
type ProjectRow = {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  event: string | null;
  start_month: string; start_year: number;
  end_month: string | null; end_year: number | null;
  is_ongoing: boolean;
  image: string; images: string[] | null;
  tags: string[];
  link: string | null; github_link: string | null; live_link: string | null;
  featured: boolean; is_featured: boolean;
  category: ProjectCategory[]; skills: string[]; achievements: string[] | null;
  team_size: number | null; role: string | null;
  testimonial_quote: string | null; testimonial_author: string | null;
  testimonial_position: string | null; testimonial_company: string | null;
  created_at: string; updated_at: string;
};
```

`ProjectCategory` is one of: `ai-ml`, `web-development`, `hackathon`, `academic`, `research`, `iot`, `cybersecurity`, `data-science`. The client stores `category` as an array even for one category. `featured` is the field used by the legacy API; `is_featured` is used by the professional experience. Preserve both until the schema is cleaned up.

Frontend normalization changes database names to `start_date`, `end_date`, and a nested `testimonial` object. See the API section for the exact returned shape.

### `achievements`

```ts
type AchievementRow = {
  id: string; type: AchievementType; title: string; organization: string;
  description: string; date_month: string; date_year: number;
  image: string; link: string | null; tags: string[];
  created_at: string; updated_at: string;
};
```

`AchievementType`: `award`, `certificate`, `felicitation`, `publication`, `recognition`.

### `gallery_images`

```ts
type GalleryImageRow = {
  id: string; url: string; caption: string;
  date_month: string | null; date_year: number | null;
  category: "home" | "main" | "moments";
  sort_order: number; created_at: string;
};
```

The read API currently only queries `home` and `main`; the admin create API can write `moments`. A redesigned Moments page must explicitly query `moments` or extend `getGalleryImages` to accept it.

### Resume/profile and supporting sections

| Table | Fields (all strings unless shown) | Notes |
| --- | --- | --- |
| `experiences` | `id`, `title`, `company`, `period`, `description: string \| null`, `sort_order: number`, timestamps | `period` is display text, not a structured date range. |
| `skills` | `id`, `name`, `category: string \| null`, `sort_order: number`, timestamps | Suggested categories are `programming`, `frameworks`, `tools`, `ai-ml`, `cloud`, `other`; no DB enum is declared. |
| `education` | `id`, `degree`, `institution`, `period`, `description: string \| null`, `location: string \| null`, `sort_order: number`, timestamps | `period` is display text. |
| `certifications` | `id`, `title`, `issuer`, `image`, `period`, `link: string \| null`, `sort_order: number`, timestamps | `image` is required. |
| `leadership` | `id`, `title`, `organization`, `period`, `description: string \| null`, `sort_order: number`, timestamps | Used as a timeline/list. |
| `settings` | `id`, `key`, `value`, timestamps | A flexible key/value store; values are strings, not JSON. |
| `blogs` | `id`, `slug`, `title`, `excerpt`, `content`, `cover_image: string \| null`, `tags: string[] \| null`, `featured: boolean`, `published: boolean`, `published_at: string \| null`, timestamps | See the mismatches section: the client also writes `author`. |

Common settings keys are `resume_url`, `profile_image`, `bio`, `email`, `linkedin_url`, `github_url`, and `twitter_url`. The professional refresh routine additionally uses `hero_title`, `hero_bio`, `scholar_url`, and `stat_projects`.

## 5. Analytics and contact schema inferred from client usage

These tables are referenced by the application but are not represented consistently in the generated TypeScript database types or tracked migrations. Confirm their actual production definitions in the Supabase dashboard before creating migrations or a new client.

```ts
// Inserted by the public client
type PageView = {
  id: string; page: string; visitor_id: string;
  referrer: string | null; user_agent: string | null;
  country: string | null; city: string | null; created_at: string;
};

type ItemView = {
  item_type: "project" | "achievement" | "gallery" | "blog";
  item_id: string; item_title: string | null; visitor_id: string;
  referrer: string | null; user_agent: string | null;
};

type ItemStatsExpectedByApi = {
  item_type: string; item_id: string; item_title: string | null;
  total_views: number; unique_visitors: number;
};

type ContactMessage = {
  id: string; name: string; email: string; subject: string | null;
  message: string; read: boolean; created_at: string;
};
```

The generated type file instead contains a `messages` table and an `item_stats` shape with `views`, which conflicts with the runtime APIs that use `contact_messages` and `total_views` / `unique_visitors`. This is a known drift, not a safe alternative contract.

## 6. Private workspace schema

The SQL migrations under `supabase/migrations/` are authoritative for this domain. Every row has `user_id` defaulting to `auth.uid()` and an `FOR ALL` RLS policy requiring `auth.uid() = user_id`.

| Table | Key fields and constraints |
| --- | --- |
| `workspace_tasks` | `title` 1–200 chars; `notes`; `status` = `TODO` / `DOING` / `DONE`; `priority` = `LOW` / `MEDIUM` / `HIGH`; `tags text[]`; optional `due_at`, email flags, timestamps. An update trigger refreshes `updated_at`. |
| `workspace_reminders` | `title` 1–200 chars; optional `notes`; required `remind_at`; email flags; `sent_at`; created timestamp. |
| `job_applications` | `company`, `role`, `status` default `SAVED`, optional `applied_at: date`, `link`, `notes`, timestamps. No UI is currently wired for it. |
| `workspace_courses` | `code`, `title`, optional `instructor`, `color` default `slate`; unique `(user_id, code)`. |
| `workspace_topics` | belongs to a course (`course_id` cascading delete); `text`, optional `unit`, order; coverage/preparation booleans and timestamps. |
| `workspace_materials` | belongs to a course; `kind` = `PROFESSOR` / `SENIOR` / `PERSONAL` / `REFERENCE`; metadata plus `storage_path` or inline `raw_text`. |
| `workspace_files` | standalone private-file metadata plus required `storage_path`. |
| `leetcode_progress` | `roadmap_key`, `solved`, `solved_at`, `note`, `updated_at`; unique `(user_id, roadmap_key)`, used as the client upsert conflict target. |

The private `workspace-library` Supabase Storage bucket has per-user object policies. Client objects are stored under `<auth-user-id>/<materials|files>/<uuid>-<sanitized-original-name>`. The UI accepts only PDF/JPEG/PNG/WebP material uploads and caps each file at 50 MB; files opened in the UI use a 60-second signed URL.

## 7. Client API contract

All service functions live in `src/lib/api.ts`. They call Supabase directly and return `null`, `false`, `[]`, or a static fallback on most failures rather than throwing. An agent should handle empty results and failed mutations explicitly.

### Read APIs for portfolio pages

| Function | Query behavior | Return |
| --- | --- | --- |
| `getProjects()` | all projects, descending `start_year`, then `start_month` | `Project[]`; static fallback |
| `getProjectById(id)` | exact UUID, `.single()` | `Project \| null`; static fallback |
| `getProjectsByCategory(category)` | array containment on `category` | `Project[]` |
| `getFeaturedProjects()` | `featured = true` | `Project[]` |
| `getAchievements()` / `getAchievementsByType(type)` | date descending; optional type filter | `Achievement[]` |
| `getGalleryImages(category = "home")` | category and ascending `sort_order` | `GalleryImage[]`; static fallback |
| `getExperiences()`, `getSkills()`, `getEducation()`, `getCertifications()`, `getLeadership()` | ascending `sort_order` | respective arrays |
| `getSettings()` / `getSetting(key)` | settings list / key lookup | `Setting[]` / `string \| null` |
| `getBlogs(includeUnpublished = false)` | published only by default; descending publication date | `Blog[]` |
| `getBlogBySlug(slug)` / `getBlogById(id)` | exact `.single()` | `Blog \| null` |

### Normalized public objects

`getProjects` maps database columns to this shape:

```ts
type Project = {
  id: string; title: string; description: string;
  long_description?: string; event?: string;
  start_date: { month: string; year: number };
  end_date?: { month: string; year: number };
  is_ongoing?: boolean; image: string; images?: string[]; tags: string[];
  link?: string; github_link?: string; live_link?: string;
  featured: boolean; is_featured?: boolean;
  category: ProjectCategory[]; skills: string[]; achievements?: string[];
  team_size?: number; role?: string;
  testimonial?: { quote: string; author: string; position: string; company: string };
};
```

Achievements normalize `date_month` and `date_year` into `date: { month, year }`. Gallery images normalize `date_month` / `date_year` into an optional `date` object. Use these normalized shapes in React components rather than mixing DB column names into the UI.

### Mutations

| Entity | Functions |
| --- | --- |
| Projects | `createProject`, `updateProject`, `deleteProject` |
| Achievements | `createAchievement`, `updateAchievement`, `deleteAchievement` |
| Gallery | `createGalleryImage`, `deleteGalleryImage` (no update/reorder service wrapper) |
| Supporting sections | create/update/delete wrappers for experiences, skills, education, certifications, leadership |
| Settings | `updateSetting(key, value)`, `upsertSetting({ key, value, description? })` |
| Blogs | `createBlog`, `updateBlog`, `deleteBlog` |
| Contact | `submitContactMessage`, `getContactMessages`, `markMessageAsRead`, `deleteContactMessage` |
| Analytics | `trackPageView`, `getTotalStats`, `getRecentStats`, `getTopPages`, `trackItemView`, `getItemStats`, `getTopItems`, `getAllItemStats` |

Important mutation behavior:

- `updateProject` and `updateAchievement` use truthiness for several text/list fields, so they cannot clear a non-null string to `""` or replace an array with `[]` through that wrapper. Write a corrected update wrapper if that is required.
- Blog creation defaults `author` to `"Slantie"`, defaults tags to `[]`, and stamps `published_at` when initially published. Updating a published post stamps `published_at` again.
- `upsertSetting` needs a unique constraint on `settings.key` in the actual database because it uses `onConflict: "key"`.

### Direct workspace calls

Private workspace components bypass `src/lib/api.ts` and call `supabase.from(...)` directly. They cover CRUD for tasks, reminders, courses, topics, materials, private files, and LeetCode progress. Preserve the existing RLS policy before extracting or reusing these calls.

## 8. Media API

`src/lib/cloudinary.ts` uses an unsigned Cloudinary upload preset. The upload widget permits `png`, `jpg`, `jpeg`, `gif`, `webp`, and `svg`, has a 10 MB max size, and produces eager WebP variants at 1200, 800, and 400 px.

Database image fields store the resulting `secure_url` as a string. The app can derive responsive Cloudinary URLs client-side. An agent should render image URLs with meaningful `alt` text from the title/caption and keep media assets outside the database itself.

## 9. Routes that consume data

| Public route | Main content |
| --- | --- |
| `/` | Professional portfolio variant; settings, projects, achievements, skills, education, experiences |
| `/projects`, `/achievements`, `/moments` | Project, achievement, and gallery listings |
| `/blog`, `/blog/:slug` | Published blog list and article |
| `/about`, `/contact`, `/classic` | Supporting profile/contact/legacy views |
| `/test-1` through `/test-4` | Design-study portfolio variants |

`/slantie/*` is the authenticated administrative and private-workspace area. It is not an API boundary by itself: real protection comes from Supabase Auth and RLS.

## 10. Repository limitations and recommended preflight

The repository does **not** include a complete initial migration for the public portfolio tables, contact tables, analytics tables, or their RLS policies. It only tracks private-workspace migrations. Therefore, before independently building against production:

1. Inspect the live Supabase schema and RLS policies, then regenerate `src/types/database.ts` with `npx supabase gen types typescript --project-id <project-id>`.
2. Reconcile the known drift: `messages` vs. `contact_messages`; `item_stats.views` vs. `total_views` / `unique_visitors`; and `blogs.author`, which client code writes but the checked-in generated type omits.
3. Verify unique constraints for `settings.key`, `blogs.slug`, and expected analytics keys; the client relies on uniqueness for `.single()` and upserts.
4. Ensure public `SELECT` is limited to published/public content, anonymous contact submissions are narrowly rate-limited, and public analytics inserts cannot read analytics rows.
5. Keep all `workspace_*`, `leetcode_progress`, `job_applications`, and `workspace-library` strictly owner-scoped. They are out of bounds for a public portfolio.

## 11. Build guidance for an independent portfolio agent

Build from the normalized `Project`, `Achievement`, gallery, and supporting-section read APIs. Use `settings` for profile/header/contact links; use only `published = true` blogs on public routes. Prefer an explicit view model at the page boundary, validate external URLs before rendering them, and show empty states because Supabase calls intentionally degrade to empty data.

For a new data access layer, retain this mapping rather than changing the database prematurely:

```text
projects.start_month + start_year  -> project.start_date.month + year
projects.end_month + end_year      -> optional project.end_date
testimonial_* columns              -> optional project.testimonial object
achievements.date_month + date_year -> achievement.date
gallery_images.date_*              -> optional galleryImage.date
sort_order                         -> display order (ascending)
```

Relevant source files: `src/types/database.ts` (typed schema), `src/types/index.ts` (frontend contracts), `src/lib/api.ts` (service API), `src/lib/supabase.ts` (client setup), `src/lib/cloudinary.ts` (media), `supabase/migrations/` (private schema/RLS), and `src/data/data.ts` (fallback content).
