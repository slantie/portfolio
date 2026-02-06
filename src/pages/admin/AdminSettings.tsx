import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  ExternalLink,
  Loader2,
  Layout,
  BarChart3,
  Share2,
  Mail,
  FileText,
  Settings,
  Check,
} from "lucide-react";
import {
  getSettings,
  updateSetting,
  upsertSetting,
  type Setting,
} from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

const SETTING_GROUPS = [
  {
    title: "Hero Section",
    icon: "layout",
    settings: [
      {
        key: "hero_name",
        label: "Your Name",
        description: "Name displayed in the hero section",
        type: "text",
        placeholder: "Kandarp Gajjar",
      },
      {
        key: "hero_title",
        label: "Hero Title",
        description: "Your role/title (e.g., AI/ML & Full-Stack Developer)",
        type: "text",
        placeholder: "AI/ML & Full-Stack Developer",
      },
      {
        key: "hero_bio",
        label: "Hero Bio",
        description: "Short introduction displayed on the homepage",
        type: "textarea",
        placeholder: "Computer Engineering student specializing in...",
      },
      {
        key: "hero_image",
        label: "Hero Image URL",
        description: "Main image on the homepage hero section",
        type: "url",
      },
    ],
  },
  {
    title: "Hero Stats",
    icon: "bar-chart",
    settings: [
      {
        key: "stat_hackathons",
        label: "Hackathons Count",
        description: "Number of hackathons (e.g., 7+)",
        type: "text",
        placeholder: "7+",
      },
      {
        key: "stat_projects",
        label: "Projects Count",
        description: "Number of projects (e.g., 10+)",
        type: "text",
        placeholder: "10+",
      },
      {
        key: "stat_publications",
        label: "Publications Count",
        description: "Number of research publications",
        type: "text",
        placeholder: "1",
      },
    ],
  },
  {
    title: "Social Links",
    icon: "share",
    settings: [
      {
        key: "linkedin_url",
        label: "LinkedIn URL",
        description: "Your LinkedIn profile URL",
        type: "url",
        placeholder: "https://linkedin.com/in/your-profile",
      },
      {
        key: "github_url",
        label: "GitHub URL",
        description: "Your GitHub profile URL",
        type: "url",
        placeholder: "https://github.com/your-username",
      },
      {
        key: "instagram_url",
        label: "Instagram URL",
        description: "Your Instagram profile URL",
        type: "url",
        placeholder: "https://instagram.com/your-handle",
      },
      {
        key: "twitter_url",
        label: "Twitter/X URL",
        description: "Your Twitter/X profile URL",
        type: "url",
        placeholder: "https://x.com/your-handle",
      },
    ],
  },
  {
    title: "Contact Info",
    icon: "mail",
    settings: [
      {
        key: "email",
        label: "Contact Email",
        description: "Your public contact email address",
        type: "email",
        placeholder: "you@example.com",
      },
      {
        key: "phone",
        label: "Phone Number",
        description: "Your contact phone number (optional)",
        type: "text",
        placeholder: "+1 234 567 8900",
      },
      {
        key: "location",
        label: "Location",
        description: "Your city/country for display",
        type: "text",
        placeholder: "Gandhinagar, India",
      },
    ],
  },
  {
    title: "Resume & Profile",
    icon: "file",
    settings: [
      {
        key: "resume_url",
        label: "Resume URL",
        description: "Link to your resume/CV file (Google Drive, etc.)",
        type: "url",
        placeholder: "https://drive.google.com/...",
      },
      {
        key: "profile_image",
        label: "Profile Image URL",
        description: "URL to your profile photo",
        type: "url",
      },
      {
        key: "bio",
        label: "About Bio",
        description: "Longer biography for the About page",
        type: "textarea",
        placeholder: "Tell your story...",
      },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const data = await getSettings();
      const settingsMap: Record<string, string> = {};
      data.forEach((setting: Setting) => {
        settingsMap[setting.key] = setting.value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => ({ ...prev, [key]: true }));
  }

  async function handleSave(key: string) {
    setSaving((prev) => ({ ...prev, [key]: true }));

    // Use upsert to create new settings or update existing ones
    const success = await upsertSetting(key, settings[key] || "");

    if (success) {
      setDirty((prev) => ({ ...prev, [key]: false }));
      toast.success("Saved!");
    } else {
      toast.error("Failed to save setting");
    }

    setSaving((prev) => ({ ...prev, [key]: false }));
  }

  async function handleSaveAll() {
    const dirtyKeys = Object.keys(dirty).filter((key) => dirty[key]);

    for (const key of dirtyKeys) {
      await handleSave(key);
    }
  }

  const hasDirtyFields = Object.values(dirty).some(Boolean);
  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  const getGroupIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      layout: <Layout className="h-4 w-4" />,
      "bar-chart": <BarChart3 className="h-4 w-4" />,
      share: <Share2 className="h-4 w-4" />,
      mail: <Mail className="h-4 w-4" />,
      file: <FileText className="h-4 w-4" />,
    };
    return icons[icon] || <Settings className="h-4 w-4" />;
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your portfolio
            </p>
          </div>
        </div>
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <p className="text-yellow-600 font-medium">
                Supabase is not configured
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your Supabase credentials to the .env file to enable
                settings management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your portfolio content
            </p>
          </div>
        </div>
        {hasDirtyFields && (
          <Button onClick={handleSaveAll} className="shrink-0">
            <Save className="h-4 w-4 mr-2" />
            Save All ({dirtyCount})
          </Button>
        )}
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1 p-1">
            {SETTING_GROUPS.map((group) => (
              <TabsTrigger
                key={group.title.toLowerCase().replace(" ", "-")}
                value={group.title.toLowerCase().replace(" ", "-")}
                className="flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {getGroupIcon(group.icon)}
                <span className="hidden sm:inline">{group.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {SETTING_GROUPS.map((group) => (
            <TabsContent
              key={group.title.toLowerCase().replace(" ", "-")}
              value={group.title.toLowerCase().replace(" ", "-")}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    {getGroupIcon(group.icon)}
                    {group.title}
                  </CardTitle>
                  <CardDescription>
                    Manage your {group.title.toLowerCase()} settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {group.settings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={setting.key}
                            className="text-sm font-medium"
                          >
                            {setting.label}
                            {dirty[setting.key] && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs text-yellow-600 border-yellow-500"
                              >
                                Unsaved
                              </Badge>
                            )}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {settings[setting.key] && setting.type === "url" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                title="Open link"
                                href={settings[setting.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={
                              dirty[setting.key] ? "default" : "secondary"
                            }
                            onClick={() => handleSave(setting.key)}
                            disabled={
                              !dirty[setting.key] || saving[setting.key]
                            }
                            className="h-8"
                          >
                            {saving[setting.key] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : dirty[setting.key] ? (
                              <Save className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {setting.type === "textarea" ? (
                        <Textarea
                          id={setting.key}
                          value={settings[setting.key] || ""}
                          onChange={(e) =>
                            handleChange(setting.key, e.target.value)
                          }
                          placeholder={
                            setting.placeholder ||
                            `Enter ${setting.label.toLowerCase()}...`
                          }
                          rows={4}
                          className={
                            dirty[setting.key]
                              ? "border-yellow-500/50 focus:border-yellow-500"
                              : ""
                          }
                        />
                      ) : (
                        <Input
                          id={setting.key}
                          type={setting.type === "email" ? "email" : "text"}
                          value={settings[setting.key] || ""}
                          onChange={(e) =>
                            handleChange(setting.key, e.target.value)
                          }
                          placeholder={
                            setting.placeholder ||
                            `Enter ${setting.label.toLowerCase()}...`
                          }
                          className={
                            dirty[setting.key]
                              ? "border-yellow-500/50 focus:border-yellow-500"
                              : ""
                          }
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
