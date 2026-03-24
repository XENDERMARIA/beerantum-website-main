import { useState, useEffect } from "react";
import { Save, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { contentService } from "@/services";
import { getErrorMessage } from "@/utils";

const CONTENT_SECTIONS = [
  { key: "hero", label: "Hero Section", fields: [{ name: "headline", label: "Headline", type: "text" }, { name: "subtext", label: "Subtext", type: "textarea" }, { name: "tagline", label: "Tagline", type: "text" }] },
  { key: "mission", label: "Mission Section", fields: [{ name: "text", label: "Mission Text", type: "textarea" }] },
  { key: "whatWeDo", label: "What We Do", fields: [{ name: "description", label: "Description", type: "textarea" }] },
];

export default function AdminContentPage() {
  const [allContent, setAllContent] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService.getAll().then(r => {
      const data = (r.data.data || {}) as Record<string, Record<string, string>>;
      setAllContent(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChange = (sectionKey: string, field: string, value: string) => {
    setAllContent(prev => ({ ...prev, [sectionKey]: { ...(prev[sectionKey] || {}), [field]: value } }));
  };

  const handleSave = async (sectionKey: string, sectionLabel: string) => {
    setSaving(sectionKey);
    try {
      await contentService.upsert(sectionKey, sectionLabel, allContent[sectionKey]);
      toast.success(`${sectionLabel} saved`);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(null); }
  };

  if (loading) return <div className="max-w-3xl mx-auto"><div className="font-display text-2xl font-bold text-white uppercase tracking-wider mb-8">Site Content</div><div className="flex flex-col gap-6">{[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-[rgba(139,47,201,0.06)] animate-pulse" />)}</div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Site Content</h1>
        <p className="text-sm text-[var(--brand-text-muted)] mt-1">Edit text content displayed on the public site</p>
      </div>

      <div className="flex flex-col gap-6">
        {CONTENT_SECTIONS.map(({ key, label, fields }) => (
          <div key={key} className="brand-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[rgba(139,47,201,0.15)] border border-[rgba(139,47,201,0.2)] flex items-center justify-center">
                <FileText size={14} className="text-[var(--brand-purple)]" />
              </div>
              <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">{label}</h2>
            </div>

            <div className="flex flex-col gap-4 mb-5">
              {fields.map(({ name, label: fieldLabel, type }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">{fieldLabel}</label>
                  {type === "textarea" ? (
                    <textarea value={(allContent[key]?.[name] as string) || ""} onChange={e => handleChange(key, name, e.target.value)} rows={4} className="brand-input resize-none" />
                  ) : (
                    <input type="text" value={(allContent[key]?.[name] as string) || ""} onChange={e => handleChange(key, name, e.target.value)} className="brand-input" />
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => handleSave(key, label)} disabled={saving === key} className="btn-primary text-xs py-2.5 px-5">
              {saving === key ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={13} />}
              Save {label}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl border border-[rgba(139,47,201,0.15)] bg-[rgba(139,47,201,0.04)]">
        <p className="text-xs text-[var(--brand-text-muted)]">
          <span className="text-[var(--brand-purple)] font-semibold">Tip:</span> Content changes are saved to MongoDB and reflected on the live site immediately. Team members, events, and partners are managed in their respective sections.
        </p>
      </div>
    </div>
  );
}
