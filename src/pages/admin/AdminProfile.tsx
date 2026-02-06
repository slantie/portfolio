import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Users,
} from "lucide-react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getLeadership,
  createLeadership,
  updateLeadership,
  deleteLeadership,
  type Experience,
  type Skill,
  type Education,
  type Certification,
  type Leadership,
} from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SKILL_CATEGORY_LABELS, type SkillCategory } from "@/types";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Generic editable list component
interface EditableItem {
  id: string;
  order: number;
}

function EditableListCard<T extends EditableItem>({
  title,
  icon: Icon,
  items,
  renderItem,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  loading,
}: {
  title: string;
  icon: React.ElementType;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  renderForm: (
    item: Partial<T>,
    onChange: (updates: Partial<T>) => void,
  ) => React.ReactNode;
  onCreate: (item: Omit<T, "id">) => Promise<T | null>;
  onUpdate: (id: string, item: Partial<Omit<T, "id">>) => Promise<T | null>;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<T>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    const newItem = await onCreate({
      ...formData,
      order: items.length,
    } as Omit<T, "id">);
    if (newItem) {
      setIsCreating(false);
      setFormData({});
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    const updated = await onUpdate(editingId, formData);
    if (updated) {
      setEditingId(null);
      setFormData({});
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    await onDelete(deleteId);
    setDeleteId(null);
    setSaving(false);
  };

  const startEdit = (item: T) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        {!isCreating && (
          <Button
            size="sm"
            onClick={() => {
              setIsCreating(true);
              setFormData({});
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupabaseConfigured && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            Supabase not configured. Add your credentials to .env to enable this
            feature.
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            {/* Create form */}
            {isCreating && (
              <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                {renderForm(formData, (updates) =>
                  setFormData({ ...formData, ...updates }),
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreate} disabled={saving}>
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )}

            {/* Items list */}
            {items.length === 0 && !isCreating ? (
              <div className="text-center py-8 text-muted-foreground">
                No items yet. Click "Add" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) =>
                  editingId === item.id ? (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg bg-muted/50 space-y-4"
                    >
                      {renderForm(formData, (updates) =>
                        setFormData({ ...formData, ...updates }),
                      )}
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdate}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">{renderItem(item)}</div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default function AdminProfile() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState({
    experiences: true,
    skills: true,
    education: true,
    certifications: true,
    leadership: true,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    const [exp, sk, edu, cert, lead] = await Promise.all([
      getExperiences(),
      getSkills(),
      getEducation(),
      getCertifications(),
      getLeadership(),
    ]);

    setExperiences(exp);
    setSkills(sk);
    setEducation(edu);
    setCertifications(cert);
    setLeadership(lead);
    setLoading({
      experiences: false,
      skills: false,
      education: false,
      certifications: false,
      leadership: false,
    });
  }

  // Experience handlers
  const handleCreateExperience = async (exp: Omit<Experience, "id">) => {
    const created = await createExperience(exp);
    if (created) setExperiences([...experiences, created]);
    return created;
  };

  const handleUpdateExperience = async (
    id: string,
    exp: Partial<Omit<Experience, "id">>,
  ) => {
    const updated = await updateExperience(id, exp);
    if (updated)
      setExperiences(experiences.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const handleDeleteExperience = async (id: string) => {
    const success = await deleteExperience(id);
    if (success) setExperiences(experiences.filter((e) => e.id !== id));
    return success;
  };

  // Skill handlers
  const handleCreateSkill = async (skill: Omit<Skill, "id">) => {
    const created = await createSkill(skill);
    if (created) setSkills([...skills, created]);
    return created;
  };

  const handleUpdateSkill = async (
    id: string,
    skill: Partial<Omit<Skill, "id">>,
  ) => {
    const updated = await updateSkill(id, skill);
    if (updated) setSkills(skills.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const handleDeleteSkill = async (id: string) => {
    const success = await deleteSkill(id);
    if (success) setSkills(skills.filter((s) => s.id !== id));
    return success;
  };

  // Education handlers
  const handleCreateEducation = async (edu: Omit<Education, "id">) => {
    const created = await createEducation(edu);
    if (created) setEducation([...education, created]);
    return created;
  };

  const handleUpdateEducation = async (
    id: string,
    edu: Partial<Omit<Education, "id">>,
  ) => {
    const updated = await updateEducation(id, edu);
    if (updated)
      setEducation(education.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const handleDeleteEducation = async (id: string) => {
    const success = await deleteEducation(id);
    if (success) setEducation(education.filter((e) => e.id !== id));
    return success;
  };

  // Certification handlers
  const handleCreateCertification = async (cert: Omit<Certification, "id">) => {
    const created = await createCertification(cert);
    if (created) setCertifications([...certifications, created]);
    return created;
  };

  const handleUpdateCertification = async (
    id: string,
    cert: Partial<Omit<Certification, "id">>,
  ) => {
    const updated = await updateCertification(id, cert);
    if (updated)
      setCertifications(certifications.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const handleDeleteCertification = async (id: string) => {
    const success = await deleteCertification(id);
    if (success) setCertifications(certifications.filter((c) => c.id !== id));
    return success;
  };

  // Leadership handlers
  const handleCreateLeadership = async (lead: Omit<Leadership, "id">) => {
    const created = await createLeadership(lead);
    if (created) setLeadership([...leadership, created]);
    return created;
  };

  const handleUpdateLeadership = async (
    id: string,
    lead: Partial<Omit<Leadership, "id">>,
  ) => {
    const updated = await updateLeadership(id, lead);
    if (updated)
      setLeadership(leadership.map((l) => (l.id === id ? updated : l)));
    return updated;
  };

  const handleDeleteLeadership = async (id: string) => {
    const success = await deleteLeadership(id);
    if (success) setLeadership(leadership.filter((l) => l.id !== id));
    return success;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile Management</h1>
      </div>

      <Tabs defaultValue="experience" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
        </TabsList>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <EditableListCard<Experience>
            title="Work Experience"
            icon={Briefcase}
            items={experiences}
            loading={loading.experiences}
            onCreate={handleCreateExperience}
            onUpdate={handleUpdateExperience}
            onDelete={handleDeleteExperience}
            renderItem={(exp) => (
              <div>
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground">{exp.period}</p>
                {exp.description && (
                  <p className="text-sm mt-1">{exp.description}</p>
                )}
              </div>
            )}
            renderForm={(data, onChange) => (
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={data.title || ""}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={data.company || ""}
                    onChange={(e) => onChange({ company: e.target.value })}
                    placeholder="e.g. Google, Inc."
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={data.period || ""}
                    onChange={(e) => onChange({ period: e.target.value })}
                    placeholder="e.g. Jan 2023 - Present"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={data.description || ""}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Describe your role and achievements..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          />
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <EditableListCard<Skill>
            title="Skills"
            icon={Code}
            items={skills}
            loading={loading.skills}
            onCreate={handleCreateSkill}
            onUpdate={handleUpdateSkill}
            onDelete={handleDeleteSkill}
            renderItem={(skill) => (
              <div className="flex items-center gap-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs px-2 py-0.5 bg-muted rounded">
                  {SKILL_CATEGORY_LABELS[skill.category as SkillCategory] ||
                    skill.category}
                </span>
              </div>
            )}
            renderForm={(data, onChange) => (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Skill Name</Label>
                  <Input
                    value={data.name || ""}
                    onChange={(e) => onChange({ name: e.target.value })}
                    placeholder="e.g. Python"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={data.category || "other"}
                    onValueChange={(val) => onChange({ category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SKILL_CATEGORY_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          />
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <EditableListCard<Education>
            title="Education"
            icon={GraduationCap}
            items={education}
            loading={loading.education}
            onCreate={handleCreateEducation}
            onUpdate={handleUpdateEducation}
            onDelete={handleDeleteEducation}
            renderItem={(edu) => (
              <div>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">
                  {edu.institution}
                </p>
                <p className="text-xs text-muted-foreground">
                  {edu.period} • {edu.location}
                </p>
                {edu.description && (
                  <p className="text-sm mt-1">{edu.description}</p>
                )}
              </div>
            )}
            renderForm={(data, onChange) => (
              <div className="space-y-3">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={data.degree || ""}
                    onChange={(e) => onChange({ degree: e.target.value })}
                    placeholder="e.g. B.E. Computer Engineering"
                  />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={data.institution || ""}
                    onChange={(e) => onChange({ institution: e.target.value })}
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Period</Label>
                    <Input
                      value={data.period || ""}
                      onChange={(e) => onChange({ period: e.target.value })}
                      placeholder="e.g. 2020 - 2024"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={data.location || ""}
                      onChange={(e) => onChange({ location: e.target.value })}
                      placeholder="e.g. California, USA"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={data.description || ""}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="GPA, achievements, etc."
                    rows={2}
                  />
                </div>
              </div>
            )}
          />
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <EditableListCard<Certification>
            title="Certifications"
            icon={Award}
            items={certifications}
            loading={loading.certifications}
            onCreate={handleCreateCertification}
            onUpdate={handleUpdateCertification}
            onDelete={handleDeleteCertification}
            renderItem={(cert) => (
              <div className="flex gap-3">
                {cert.image && (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground">{cert.period}</p>
                </div>
              </div>
            )}
            renderForm={(data, onChange) => (
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={data.title || ""}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                  />
                </div>
                <div>
                  <Label>Issuer</Label>
                  <Input
                    value={data.issuer || ""}
                    onChange={(e) => onChange({ issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={data.period || ""}
                    onChange={(e) => onChange({ period: e.target.value })}
                    placeholder="e.g. January 2024"
                  />
                </div>
                <div>
                  <Label>Image</Label>
                  <ImageUpload
                    value={data.image || ""}
                    onChange={(url) => onChange({ image: url })}
                    folder="certifications"
                  />
                </div>
                <div>
                  <Label>Link (optional)</Label>
                  <Input
                    value={data.link || ""}
                    onChange={(e) => onChange({ link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          />
        </TabsContent>

        {/* Leadership Tab */}
        <TabsContent value="leadership">
          <EditableListCard<Leadership>
            title="Leadership & Activities"
            icon={Users}
            items={leadership}
            loading={loading.leadership}
            onCreate={handleCreateLeadership}
            onUpdate={handleUpdateLeadership}
            onDelete={handleDeleteLeadership}
            renderItem={(lead) => (
              <div>
                <h3 className="font-semibold">{lead.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {lead.organization}
                </p>
                <p className="text-xs text-muted-foreground">{lead.period}</p>
                {lead.description && (
                  <p className="text-sm mt-1">{lead.description}</p>
                )}
              </div>
            )}
            renderForm={(data, onChange) => (
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={data.title || ""}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="e.g. Chairperson"
                  />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={data.organization || ""}
                    onChange={(e) => onChange({ organization: e.target.value })}
                    placeholder="e.g. IEEE Student Branch"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={data.period || ""}
                    onChange={(e) => onChange({ period: e.target.value })}
                    placeholder="e.g. Dec 2023 - Dec 2024"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={data.description || ""}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Describe your role..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
