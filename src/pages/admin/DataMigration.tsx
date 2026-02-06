import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Loader2,
  Database,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Static data to migrate
const staticExperiences = [
  {
    title: "Research Assistant",
    company:
      "M. M. Patel Student Research Projects Cell (MMPSRPC), Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, India",
    period: "Dec 2025 - Present",
    description: "",
  },
  {
    title: "Machine Learning Intern",
    company: "National Technical Research Organization (NTRO), Delhi, India",
    period: "Aug 2025 - Oct 2025",
    description: "",
  },
  {
    title: "Frontend Web Developer",
    company: "Institute for Plasma Research (IPR), Gandhinagar, India",
    period: "Aug 2024 - Nov 2024",
    description:
      "Built an online quiz platform with multilingual support, separate Admin & User portals, and integrated Admin Analytics, ensuring a seamless user experience. Technologies: ReactJS, TailwindCSS, i18Next.",
  },
];

const staticSkills = [
  { name: "C", category: "programming" },
  { name: "C++", category: "programming" },
  { name: "Python", category: "programming" },
  { name: "JavaScript", category: "programming" },
  { name: "HTML5", category: "programming" },
  { name: "CSS", category: "programming" },
  { name: "ReactJS", category: "frameworks" },
  { name: "Tailwind", category: "frameworks" },
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Figma", category: "tools" },
  { name: "Canva", category: "tools" },
  { name: "GeoJSON", category: "tools" },
  { name: "Machine Learning", category: "ai-ml" },
  { name: "Natural Language Processing", category: "ai-ml" },
  { name: "Computer Vision", category: "ai-ml" },
  { name: "Cloud Computing", category: "cloud" },
  { name: "Cybersecurity", category: "other" },
  { name: "Ethical Hacking", category: "other" },
  { name: "Computer Networks", category: "other" },
  { name: "IoT", category: "other" },
];

const staticEducation = [
  {
    degree: "Masters",
    institution: "-",
    period: "2025 - 2027",
    description: "-",
    location: "-",
  },
  {
    degree: "B.E. Computer Engineering",
    institution: "LDRP Institute of Technology and Research",
    period: "2022 - Present",
    description: "CPI: 8.44 (Till Semester 6)",
    location: "Gandhinagar, Gujarat",
  },
  {
    degree: "Class 12th",
    institution: "Hebron Higher Secondary School (GHSEB)",
    period: "2020 - 2022",
    description: "Percentage: 73%",
    location: "Ahmedabad, Gujarat",
  },
  {
    degree: "Class 10th",
    institution: "Hebron Higher Secondary School (GSEB)",
    period: "2019 - 2020",
    description: "Percentage: 72%",
    location: "Ahmedabad, Gujarat",
  },
];

const staticCertifications = [
  {
    title: "GATE Qualified - CSE 2025",
    issuer: "GATE",
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825774/gate_jgcdje_bahmdi.avif",
    period: "February 2025",
    link: "",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825772/aws_md37xm_qjffnv.avif",
    period: "Jan 2024 - Jan 2026",
    link: "",
  },
  {
    title: "Letter of Recommendation",
    issuer: "GlobalCert Pte. Ltd., Singapore",
    image:
      "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825773/bip-global-cert43_kmowrb_np7hpx.avif",
    period: "October 2024",
    link: "",
  },
];

const staticLeadership = [
  {
    title: "Chairperson, IEEE Student Branch",
    organization: "LDRP Institute of Technology and Research",
    period: "Dec 2023 - Dec 2024",
    description:
      "Leading the IEEE Student Branch activities and initiatives at the institute.",
  },
  {
    title: "Main Student Event Coordinator",
    organization: "Xenesis'24, LDRP Institute of Technology and Research",
    period: "Feb 2024",
    description:
      "Coordinated and managed the main student technical and cultural fest of the institute.",
  },
];

const staticSettings = [
  {
    key: "resume_url",
    value:
      "https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing",
  },
  { key: "email", value: "slantie.contact@gmail.com" },
  { key: "linkedin_url", value: "https://linkedin.com/in/slantie" },
  { key: "github_url", value: "https://github.com/slantie" },
];

interface MigrationResult {
  type: string;
  title: string;
  success: boolean;
  error?: string;
}

export default function DataMigration() {
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [currentItem, setCurrentItem] = useState("");

  async function migrateExperiences() {
    const migrationResults: MigrationResult[] = [];

    for (let i = 0; i < staticExperiences.length; i++) {
      const exp = staticExperiences[i];
      setCurrentItem(`Experience: ${exp.title}`);

      const { error } = await supabase!.from("experiences").insert({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        sort_order: i,
      } as any);

      migrationResults.push({
        type: "experience",
        title: exp.title,
        success: !error,
        error: error?.message,
      });
    }

    return migrationResults;
  }

  async function migrateSkills() {
    const migrationResults: MigrationResult[] = [];

    for (let i = 0; i < staticSkills.length; i++) {
      const skill = staticSkills[i];
      setCurrentItem(`Skill: ${skill.name}`);

      const { error } = await supabase!.from("skills").insert({
        name: skill.name,
        category: skill.category,
        sort_order: i,
      } as any);

      migrationResults.push({
        type: "skill",
        title: skill.name,
        success: !error,
        error: error?.message,
      });
    }

    return migrationResults;
  }

  async function migrateEducation() {
    const migrationResults: MigrationResult[] = [];

    for (let i = 0; i < staticEducation.length; i++) {
      const edu = staticEducation[i];
      setCurrentItem(`Education: ${edu.degree}`);

      const { error } = await supabase!.from("education").insert({
        degree: edu.degree,
        institution: edu.institution,
        period: edu.period,
        description: edu.description,
        location: edu.location,
        sort_order: i,
      } as any);

      migrationResults.push({
        type: "education",
        title: edu.degree,
        success: !error,
        error: error?.message,
      });
    }

    return migrationResults;
  }

  async function migrateCertifications() {
    const migrationResults: MigrationResult[] = [];

    for (let i = 0; i < staticCertifications.length; i++) {
      const cert = staticCertifications[i];
      setCurrentItem(`Certification: ${cert.title}`);

      const { error } = await supabase!.from("certifications").insert({
        title: cert.title,
        issuer: cert.issuer,
        image: cert.image,
        period: cert.period,
        link: cert.link || null,
        sort_order: i,
      } as any);

      migrationResults.push({
        type: "certification",
        title: cert.title,
        success: !error,
        error: error?.message,
      });
    }

    return migrationResults;
  }

  async function migrateLeadership() {
    const migrationResults: MigrationResult[] = [];

    for (let i = 0; i < staticLeadership.length; i++) {
      const lead = staticLeadership[i];
      setCurrentItem(`Leadership: ${lead.title}`);

      const { error } = await supabase!.from("leadership").insert({
        title: lead.title,
        organization: lead.organization,
        period: lead.period,
        description: lead.description,
        sort_order: i,
      } as any);

      migrationResults.push({
        type: "leadership",
        title: lead.title,
        success: !error,
        error: error?.message,
      });
    }

    return migrationResults;
  }

  async function migrateSettings() {
    const migrationResults: MigrationResult[] = [];

    for (const setting of staticSettings) {
      setCurrentItem(`Setting: ${setting.key}`);

      const { error } = await (supabase!.from("settings") as any)
        .update({ value: setting.value })
        .eq("key", setting.key);

      migrationResults.push({
        type: "setting",
        title: setting.key,
        success: !error,
        error: error?.message,
      });
    }

    return migrationResults;
  }

  async function runMigration() {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please add your credentials to .env");
      return;
    }

    setMigrating(true);
    setResults([]);

    try {
      const expResults = await migrateExperiences();
      setResults((prev) => [...prev, ...expResults]);

      const skillResults = await migrateSkills();
      setResults((prev) => [...prev, ...skillResults]);

      const eduResults = await migrateEducation();
      setResults((prev) => [...prev, ...eduResults]);

      const certResults = await migrateCertifications();
      setResults((prev) => [...prev, ...certResults]);

      const leadResults = await migrateLeadership();
      setResults((prev) => [...prev, ...leadResults]);

      const settingsResults = await migrateSettings();
      setResults((prev) => [...prev, ...settingsResults]);
    } catch (error) {
      console.error("Migration error:", error);
    } finally {
      setMigrating(false);
      setCurrentItem("");
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  const totalItems =
    staticExperiences.length +
    staticSkills.length +
    staticEducation.length +
    staticCertifications.length +
    staticLeadership.length +
    staticSettings.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Data Migration</h1>
        <p className="text-muted-foreground mt-2">
          Migrate your static profile data to Supabase
        </p>
      </div>

      {!isSupabaseConfigured && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-500">
                Supabase Not Configured
              </p>
              <p className="text-sm text-muted-foreground">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env
                file
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Profile Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{staticExperiences.length}</p>
              <p className="text-sm text-muted-foreground">Experiences</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{staticSkills.length}</p>
              <p className="text-sm text-muted-foreground">Skills</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{staticEducation.length}</p>
              <p className="text-sm text-muted-foreground">Education</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {staticCertifications.length}
              </p>
              <p className="text-sm text-muted-foreground">Certifications</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{staticLeadership.length}</p>
              <p className="text-sm text-muted-foreground">Leadership</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{staticSettings.length}</p>
              <p className="text-sm text-muted-foreground">Settings</p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={runMigration}
              disabled={migrating || !isSupabaseConfigured}
              className="w-full"
            >
              {migrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating: {currentItem}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Migrate {totalItems} Items
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Migration Results</span>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-600">
                  {successCount} Success
                </Badge>
                {failCount > 0 && (
                  <Badge variant="destructive">{failCount} Failed</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    result.success
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="truncate max-w-md">{result.title}</span>
                    {result.error && (
                      <span className="text-xs text-red-500">
                        : {result.error}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {result.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Before running migration:</strong> Make sure you have
            created the database tables by running the SQL in{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              supabase/migration-profile-tables.sql
            </code>
          </p>
          <p className="mt-4 text-amber-600 dark:text-amber-400">
            ⚠️ Running migration multiple times may create duplicate entries.
          </p>
          <p>After migration, manage your data in:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <a href="/slantie/profile" className="text-primary hover:underline">
                Profile Management
              </a>{" "}
              - Experience, Skills, Education, Certifications, Leadership
            </li>
            <li>
              <a
                href="/slantie/settings"
                className="text-primary hover:underline"
              >
                Settings
              </a>{" "}
              - Resume URL, social links, etc.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
