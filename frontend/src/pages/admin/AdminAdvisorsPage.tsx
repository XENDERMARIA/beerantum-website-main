import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GraduationCap, Plus, Pencil, Trash2, X, Loader2, Linkedin, Github, Globe } from "lucide-react";
import { advisorsService } from "@/services";
import { cn, getErrorMessage, getInitials } from "@/utils";
import type { Advisor, AdvisorFormData } from "@/types";
import api from "@/services/api";

export default function AdminAdvisorsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Advisor | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AdvisorFormData>();

  const load = () => {
    setLoading(true);
    advisorsService.getAll().then(r => setAdvisors(r.data.data || [])).catch(() => setAdvisors([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null); setPhotoPreview("");
    reset({ name: "", title: "", affiliation: "", bio: "", photoUrl: "", website: "", socialLinks: { linkedin: "", github: "", twitter: "" }, order: 99 });
    setModalOpen(true);
  };
  const openEdit = (a: Advisor) => {
    setEditing(a); setPhotoPreview(a.photoUrl || "");
    reset({ name: a.name, title: a.title || "", affiliation: a.affiliation || "", bio: a.bio || "", photoUrl: a.photoUrl || "", website: a.website || "", socialLinks: { linkedin: a.socialLinks?.linkedin || "", github: a.socialLinks?.github || "", twitter: a.socialLinks?.twitter || "" }, order: a.order ?? 99 });
    setModalOpen(true);
  };
  const close = () => { setModalOpen(false); setEditing(null); setPhotoPreview(""); };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only images"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res = await api.post("/upload?folder=advisors", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = (res.data as any).data?.url || (res.data as any).url;
      if (url) { setValue("photoUrl", url); setPhotoPreview(url); toast.success("Uploaded"); }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const onSubmit = async (data: AdvisorFormData) => {
    setSaving(true);
    try {
      editing ? await advisorsService.update(editing._id, data) : await advisorsService.create(data);
      toast.success(editing ? "Updated" : "Added"); close(); load();
    } catch (err) { toast.error(getErrorMessage(err)); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this advisor?")) return;
    try { await advisorsService.remove(id); toast.success("Removed"); load(); } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">Advisors</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">{advisors.length} advisors</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={16} /> Add Advisor</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-[var(--brand-purple)]" size={32} /></div>
      ) : advisors.length === 0 ? (
        <div className="brand-card p-16 text-center">
          <GraduationCap size={48} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
          <p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)]">No advisors yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {advisors.map(a => (
            <div key={a._id} className="brand-card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="relative overflow-hidden" style={{ height: "140px" }}>
                {a.photoUrl ? <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" /> : <div className="photo-placeholder w-full h-full text-xl">{getInitials(a.name)}</div>}
                <div className="absolute top-3 left-3 text-white text-[10px] font-display font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(to right,#8B2FC9,#CC00CC)" }}>Advisor</div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider truncate">{a.name}</h3>
                {a.title && <p className="text-xs text-[var(--brand-magenta)] font-mono uppercase tracking-widest mt-1">{a.title}</p>}
                {a.affiliation && <p className="text-xs text-[var(--brand-text-muted)] mt-1">· {a.affiliation}</p>}
                <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid rgba(139,47,201,0.1)" }}>
                  <div className="flex gap-2">
                    {a.socialLinks?.linkedin && <a href={a.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)]"><Linkedin size={14} /></a>}
                    {a.socialLinks?.github && <a href={a.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)]"><Github size={14} /></a>}
                    {a.website && <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)]"><Globe size={14} /></a>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-white hover:bg-white/5"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(a._id)} className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={close}>
          <div className="glass-modal w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(139,47,201,0.15)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(139,47,201,0.2), rgba(204,0,204,0.15))", border: "1px solid rgba(139,47,201,0.3)" }}>
                  <GraduationCap size={18} className="text-[var(--brand-purple)]" />
                </div>
                <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">{editing ? "Edit" : "Add"} Advisor</h2>
              </div>
              <button onClick={close} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[rgba(139,47,201,0.2)]">
                  {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <div className="photo-placeholder w-full h-full text-sm">?</div>}
                </div>
                <div className="flex-1">
                  <label className={cn("btn-primary text-xs cursor-pointer inline-flex", uploading && "opacity-50 pointer-events-none")}>
                    {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : "Upload Photo"}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  <input {...register("photoUrl")} className="brand-input mt-2 text-xs" placeholder="Or paste URL..." />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Name *</label>
                <input {...register("name", { required: "Required" })} className={cn("brand-input", errors.name && "error")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Title</label>
                  <input {...register("title")} className="brand-input" placeholder="Professor" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Affiliation</label>
                  <input {...register("affiliation")} className="brand-input" placeholder="MIT" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Bio</label>
                <textarea {...register("bio")} rows={3} className="brand-input resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Website</label>
                <input {...register("website")} className="brand-input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">LinkedIn</label>
                  <input {...register("socialLinks.linkedin")} className="brand-input text-xs" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">GitHub</label>
                  <input {...register("socialLinks.github")} className="brand-input text-xs" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Twitter</label>
                  <input {...register("socialLinks.twitter")} className="brand-input text-xs" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Order</label>
                <input type="number" {...register("order", { valueAsNumber: true })} className="brand-input" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? "Update" : "Add Advisor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
