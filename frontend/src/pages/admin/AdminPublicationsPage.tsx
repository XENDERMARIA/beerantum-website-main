import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BookOpen, Plus, Pencil, Trash2, X, ExternalLink, Loader2, Tag } from "lucide-react";
import { publicationsService } from "@/services";
import { cn, getErrorMessage } from "@/utils";
import type { Publication, PublicationFormData } from "@/types";

export default function AdminPublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [saving, setSaving] = useState(false);
  const [authorsInput, setAuthorsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PublicationFormData>();

  const load = () => {
    setLoading(true);
    publicationsService.getAll().then(r => setPubs(r.data.data || [])).catch(() => setPubs([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null); setAuthorsInput(""); setTagsInput(""); setPhotoPreview("");
    reset({ title: "", publishedIn: "", year: new Date().getFullYear(), abstract: "", url: "", doi: "", imageUrl: "", order: 99 });
    setModalOpen(true);
  };
  const openEdit = (p: Publication) => {
    setEditing(p); setAuthorsInput((p.authors || []).join(", ")); setTagsInput((p.tags || []).join(", ")); setPhotoPreview(p.imageUrl || "");
    reset({ title: p.title, publishedIn: p.publishedIn || "", year: p.year, abstract: p.abstract || "", url: p.url || "", doi: p.doi || "", imageUrl: p.imageUrl || "", order: p.order ?? 99 });
    setModalOpen(true);
  };
  const close = () => { setModalOpen(false); setEditing(null); setPhotoPreview(""); };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/upload?folder=publications", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      const url = data.data?.url || data.url;
      if (url) {
        setValue("imageUrl", url);
        setPhotoPreview(url);
        toast.success("Image uploaded!");
      }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const onSubmit = async (data: PublicationFormData) => {
    setSaving(true);
    const payload = { ...data, authors: authorsInput.split(",").map(s => s.trim()).filter(Boolean), tags: tagsInput.split(",").map(s => s.trim()).filter(Boolean) };
    try {
      editing ? await publicationsService.update(editing._id, payload) : await publicationsService.create(payload);
      toast.success(editing ? "Updated" : "Added"); close(); load();
    } catch (err) { toast.error(getErrorMessage(err)); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this publication?")) return;
    try { await publicationsService.remove(id); toast.success("Removed"); load(); } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">Publications</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">{pubs.length} publications</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={16} /> Add Publication</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-[var(--brand-purple)]" size={32} /></div>
      ) : pubs.length === 0 ? (
        <div className="brand-card p-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
          <p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)]">No publications yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pubs.map(p => (
            <div key={p._id} className="brand-card p-6 group hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(139,47,201,0.15), rgba(204,0,204,0.1))", border: "1px solid rgba(139,47,201,0.2)" }}>
                    {p.imageUrl ? (
                       <img src={p.imageUrl} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                       <BookOpen size={16} className="text-[var(--brand-purple)]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-white tracking-wide">{p.title}</h3>
                    {p.authors.length > 0 && <p className="text-xs text-[var(--brand-text-muted)] mt-1">{p.authors.join(", ")}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      {p.publishedIn && <span className="text-xs text-[var(--brand-magenta)] font-mono">{p.publishedIn}</span>}
                      <span className="text-xs text-[var(--brand-text-muted)]">{p.year}</span>
                      {p.doi && <span className="text-[10px] text-[var(--brand-text-muted)] font-mono">DOI: {p.doi}</span>}
                    </div>
                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.tags.map(t => (
                          <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full text-[var(--brand-purple)]"
                            style={{ background: "rgba(139,47,201,0.1)", border: "1px solid rgba(139,47,201,0.2)" }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-white/5"><ExternalLink size={14} /></a>}
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-white hover:bg-white/5"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
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
                  <BookOpen size={18} className="text-[var(--brand-purple)]" />
                </div>
                <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">{editing ? "Edit" : "Add"} Publication</h2>
              </div>
              <button onClick={close} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[rgba(139,47,201,0.2)]">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="photo-placeholder w-full h-full text-sm">?</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className={cn("btn-primary text-xs cursor-pointer inline-flex", uploading && "opacity-50 pointer-events-none")}>
                      {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : "Upload Image"}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <input {...register("imageUrl")} className="brand-input mt-2 text-xs" placeholder="Or paste image URL..." />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Title *</label>
                <input {...register("title", { required: "Required" })} className={cn("brand-input", errors.title && "error")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Authors (comma-separated)</label>
                <input value={authorsInput} onChange={e => setAuthorsInput(e.target.value)} className="brand-input" placeholder="John Doe, Jane Smith" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Published In</label>
                  <input {...register("publishedIn")} className="brand-input" placeholder="Nature Quantum" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Year *</label>
                  <input type="number" {...register("year", { required: "Required", valueAsNumber: true })} className={cn("brand-input", errors.year && "error")} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Abstract</label>
                <textarea {...register("abstract")} rows={3} className="brand-input resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">URL</label>
                  <input {...register("url")} className="brand-input" placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">DOI</label>
                  <input {...register("doi")} className="brand-input" placeholder="10.1234/..." />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Tags (comma-separated)</label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="brand-input" placeholder="quantum, computing" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Order</label>
                <input type="number" {...register("order", { valueAsNumber: true })} className="brand-input" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? "Update" : "Add Publication"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
