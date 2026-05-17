import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Trophy, Plus, Pencil, Trash2, X, ExternalLink, Loader2, Medal, Award,
} from "lucide-react";
import { achievementsService } from "@/services";
import { cn, getErrorMessage } from "@/utils";
import type { Achievement, AchievementFormData } from "@/types";

const PLACEMENT_COLORS: Record<string, string> = {
  "1st Place": "linear-gradient(135deg, #FFD700, #FFA000)",
  "2nd Place": "linear-gradient(135deg, #C0C0C0, #9E9E9E)",
  "3rd Place": "linear-gradient(135deg, #CD7F32, #8B4513)",
};

function getPlacementStyle(placement: string) {
  const lower = placement.toLowerCase();
  if (lower.includes("1st") || lower.includes("first")) return PLACEMENT_COLORS["1st Place"];
  if (lower.includes("2nd") || lower.includes("second")) return PLACEMENT_COLORS["2nd Place"];
  if (lower.includes("3rd") || lower.includes("third")) return PLACEMENT_COLORS["3rd Place"];
  return "linear-gradient(135deg, #8B2FC9, #CC00CC)";
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AchievementFormData>();

  const load = () => {
    setLoading(true);
    achievementsService.getAll()
      .then(r => setAchievements(r.data.data || []))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); reset({ title: "", placement: "", year: new Date().getFullYear(), description: "", competitionUrl: "", imageUrl: "", order: 99 }); setModalOpen(true); };
  const openEdit = (a: Achievement) => { setEditing(a); reset({ title: a.title, placement: a.placement, year: a.year, description: a.description || "", competitionUrl: a.competitionUrl || "", imageUrl: a.imageUrl || "", order: a.order ?? 99 }); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

  const onSubmit = async (data: AchievementFormData) => {
    setSaving(true);
    try {
      if (editing) {
        await achievementsService.update(editing._id, data);
        toast.success("Achievement updated");
      } else {
        await achievementsService.create(data);
        toast.success("Achievement added");
      }
      close(); load();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this achievement?")) return;
    try { await achievementsService.remove(id); toast.success("Removed"); load(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
            Achievements & Awards
          </h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">{achievements.length} achievements recorded</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Add Achievement
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-[var(--brand-purple)]" size={32} />
        </div>
      ) : achievements.length === 0 ? (
        <div className="brand-card p-16 text-center">
          <Trophy size={48} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
          <p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)] mb-2">No achievements yet</p>
          <p className="text-xs text-[var(--brand-text-muted)]">Click "Add Achievement" to record your first win</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map(a => (
            <div key={a._id} className="brand-card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="h-2" style={{ background: getPlacementStyle(a.placement) }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: getPlacementStyle(a.placement) }}>
                      <Trophy size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider truncate">{a.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                          style={{ background: getPlacementStyle(a.placement), fontSize: "10px" }}>
                          {a.placement}
                        </span>
                        <span className="text-xs text-[var(--brand-text-muted)]">{a.year}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {a.competitionUrl && (
                      <a href={a.competitionUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-white/5 transition-all">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button onClick={() => openEdit(a)}
                      className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-white hover:bg-white/5 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(a._id)}
                      className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {a.description && (
                  <p className="text-xs text-[var(--brand-text-muted)] mt-3 leading-relaxed line-clamp-3">{a.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={close}>
          <div className="glass-modal w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(139,47,201,0.15)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(139,47,201,0.2), rgba(204,0,204,0.15))", border: "1px solid rgba(139,47,201,0.3)" }}>
                  <Trophy size={18} className="text-[var(--brand-purple)]" />
                </div>
                <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                  {editing ? "Edit Achievement" : "Add Achievement"}
                </h2>
              </div>
              <button onClick={close} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Competition Name *</label>
                <input {...register("title", { required: "Title required" })} className={cn("brand-input", errors.title && "error")} placeholder="Berlin Kipu Quantum Hackathon" />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Placement *</label>
                  <input {...register("placement", { required: "Placement required" })} className={cn("brand-input", errors.placement && "error")} placeholder="3rd Place" />
                  {errors.placement && <p className="text-xs text-red-400">{errors.placement.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Year *</label>
                  <input type="number" {...register("year", { required: "Year required", valueAsNumber: true })} className={cn("brand-input", errors.year && "error")} placeholder="2026" />
                  {errors.year && <p className="text-xs text-red-400">{errors.year.message}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Description</label>
                <textarea {...register("description")} rows={4} className="brand-input resize-none" placeholder="Describe the achievement..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Competition URL</label>
                <input {...register("competitionUrl")} className="brand-input" placeholder="https://..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Display Order</label>
                <input type="number" {...register("order", { valueAsNumber: true })} className="brand-input" placeholder="99" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? "Update Achievement" : "Add Achievement"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
