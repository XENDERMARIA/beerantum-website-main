
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Plus, Pencil, Trash2, X, Save, User, Shield,
  HelpCircle, Image, Link as LinkIcon, ArrowUp, ArrowDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { teamService } from "@/services";
import { cn, getInitials, getErrorMessage } from "@/utils";
import type { TeamMember } from "@/types";
import ImageUpload from "@/components/ui/ImageUpload";


function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1.5" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <HelpCircle size={13} className="text-[var(--brand-text-muted)] cursor-help" />
      {show && (
        <span className="absolute left-5 top-0 z-50 w-56 text-xs bg-[#1A1A2E] border border-[rgba(139,47,201,0.3)] rounded-lg p-3 text-[var(--brand-text)] shadow-xl">
          {text}
        </span>
      )}
    </span>
  );
}


function ImagePreview({ url, name }: { url?: string; name: string }) {
  if (!url) {
    return (
      <div className="w-16 h-16 rounded-xl photo-placeholder text-sm flex-shrink-0">{getInitials(name || "?")}</div>
    );
  }
  return (
    <img src={url} alt={name} className="w-16 h-16 rounded-xl object-cover border border-[rgba(139,47,201,0.3)] flex-shrink-0"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
  );
}


type FormData = {
  name: string; role: string; education: string; bio: string;
  photoUrl: string; isLeadership: boolean; order: number;
  linkedin: string; github: string; twitter: string;
};

function MemberModal({ member, onClose, onSave }: { member?: TeamMember; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!member;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: member?.name || "",
      role: member?.role || "",
      education: member?.education || "",
      bio: member?.bio || "",
      photoUrl: member?.photoUrl || "",
      isLeadership: member?.isLeadership || false,
      order: member?.order || 99,
      linkedin: member?.socialLinks?.linkedin || "",
      github: member?.socialLinks?.github || "",
      twitter: member?.socialLinks?.twitter || "",
    },
  });

  
  const photoUrlValue = watch("photoUrl");
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        role: data.role,
        education: data.education,
        bio: data.bio,
        photoUrl: data.photoUrl || undefined,
        isLeadership: data.isLeadership,
        order: Number(data.order),
        socialLinks: {
          linkedin: data.linkedin,
          github: data.github,
          twitter: data.twitter,
        },
      };
      if (isEdit) await teamService.update(member!._id, payload);
      else await teamService.create(payload as never);
      toast.success(isEdit ? "✅ Member updated!" : "✅ Member added to the team!");
      onSave();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="brand-card w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {}
        <div className="sticky top-0 z-10 bg-[#141420] px-6 py-4 border-b border-[rgba(139,47,201,0.15)] flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
              {isEdit ? "✏️ Edit Team Member" : "➕ Add New Team Member"}
            </h2>
            <p className="text-xs text-[var(--brand-text-muted)] mt-0.5">
              Fill in the details below — all fields marked * are required
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white p-1"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6" noValidate>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--brand-text)]">
                  Full Name *
                </label>
                <input
                  {...register("name", { required: "Please enter the member's full name" })}
                  placeholder="e.g. Aria Quantum"
                  className={cn("brand-input", errors.name && "error")}
                />
                {errors.name && <p className="text-xs text-red-400">⚠ {errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Role / Position *
                  <Tip text="Their title on the team, e.g. 'Quantum Researcher', 'Event Lead', 'Software Engineer'" />
                </label>
                <input
                  {...register("role", { required: "Please enter their role/position" })}
                  placeholder="e.g. Lead Quantum Researcher"
                  className={cn("brand-input", errors.role && "error")}
                />
                {errors.role && <p className="text-xs text-red-400">⚠ {errors.role.message}</p>}
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Education / University *
                  <Tip text="e.g. 'MIT — Quantum Computing PhD' or 'University of Manchester — Physics BSc'" />
                </label>
                <input
                  {...register("education", { required: "Please enter their education background" })}
                  placeholder="e.g. MIT — Quantum Computing PhD"
                  className={cn("brand-input", errors.education && "error")}
                />
                {errors.education && <p className="text-xs text-red-400">⚠ {errors.education.message}</p>}
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Short Bio
                  <Tip text="2-3 sentences about what they do / their expertise. Optional but looks great on the site." />
                </label>
                <textarea
                  {...register("bio")}
                  rows={3}
                  placeholder="e.g. Pioneering researcher in quantum algorithms with a focus on error correction. Passionate about making quantum computing accessible."
                  className="brand-input resize-none"
                  maxLength={400}
                />
                <p className="text-[10px] text-[var(--brand-text-muted)]">Max 400 characters</p>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">2</span>
              Photo
            </h3>
              <ImageUpload
                value={watch("photoUrl")}
                onChange={(url) => setValue("photoUrl", url)}
                folder="team"
                label="Member Photo"
                previewShape="circle"
              />
            <p className="text-[10px] text-[var(--brand-text-muted)] mt-2">
              Or enter a URL manually:
              <input {...register("photoUrl")} placeholder="https://..." className="brand-input mt-1.5" />
            </p>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">3</span>
              Display Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Display Order
                  <Tip text="Controls where this person appears on the team page. Lower number = shown first. Use 1 for the most important member." />
                </label>
                <input
                  {...register("order", { valueAsNumber: true, min: 1 })}
                  type="number" min={1}
                  placeholder="1 = first, 2 = second, etc."
                  className="brand-input"
                />
              </div>
              <div className="flex items-start gap-3 pt-5">
                <div className="relative">
                  <input
                    {...register("isLeadership")}
                    type="checkbox"
                    id="leadership"
                    className="sr-only"
                  />
                  <label htmlFor="leadership" className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      watch("isLeadership")
                        ? "bg-gradient-to-br from-[#8B2FC9] to-[#CC00CC] border-[#CC00CC]"
                        : "border-[rgba(139,47,201,0.4)] bg-transparent group-hover:border-[var(--brand-magenta)]"
                    )}>
                      {watch("isLeadership") && <Shield size={11} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-text)]">Leadership Badge</p>
                      <p className="text-xs text-[var(--brand-text-muted)]">Shows a "Lead" badge on their card</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">4</span>
              Social Links <span className="text-[var(--brand-text-muted)] font-normal normal-case tracking-normal ml-1">(optional)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "linkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                { name: "github" as const, label: "GitHub", placeholder: "https://github.com/username" },
                { name: "twitter" as const, label: "X / Twitter", placeholder: "https://x.com/username" },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center gap-1">
                    <LinkIcon size={11} />{label}
                  </label>
                  <input {...register(name)} placeholder={placeholder} className="brand-input text-xs" />
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="flex gap-3 pt-2 border-t border-[rgba(139,47,201,0.1)]">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                : <><Save size={15} />{isEdit ? "Save Changes" : "Add to Team"}</>}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | undefined>();

  const fetchMembers = async () => {
    setLoading(true);
    try { const r = await teamService.getAll(); setMembers(r.data.data || []); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the team? This cannot be undone.`)) return;
    try { await teamService.remove(id); toast.success(`${name} removed`); fetchMembers(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const moveOrder = async (member: TeamMember, direction: "up" | "down") => {
    const newOrder = direction === "up" ? (member.order || 1) - 1 : (member.order || 99) + 1;
    try { await teamService.update(member._id, { order: Math.max(1, newOrder) }); fetchMembers(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Team Members</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""} — changes show on the live site immediately
          </p>
        </div>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary">
          <Plus size={15} />Add Member
        </button>
      </div>

      {}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
        style={{ background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.18)" }}>
        <span className="text-xl flex-shrink-0">💡</span>
        <div className="text-[var(--brand-text-muted)]">
          <strong className="text-[var(--brand-text)]">Tips:</strong>{" "}
          Click <strong>Add Member</strong> to add someone new. Click the ✏️ pencil to edit.
          Use ↑↓ arrows to reorder how they appear on the website.
          The <strong>Display Order</strong> number controls position (1 = first).
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(139,47,201,0.06)" }} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 brand-card">
          <User size={52} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
          <p className="font-display text-base uppercase tracking-widest text-white mb-2">No team members yet</p>
          <p className="text-sm text-[var(--brand-text-muted)] mb-6">Add your first team member to display them on the website</p>
          <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary inline-flex">
            <Plus size={15} />Add First Member
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {[...members].sort((a, b) => (a.order || 99) - (b.order || 99)).map((m, idx) => (
            <div key={m._id} className="brand-card p-4 flex items-center gap-4">
              {}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => moveOrder(m, "up")} disabled={idx === 0}
                  className="p-1 rounded text-[var(--brand-text-muted)] hover:text-white disabled:opacity-20 transition-colors">
                  <ArrowUp size={12} />
                </button>
                <span className="text-[10px] font-mono text-center text-[var(--brand-text-muted)]">
                  {m.order || "—"}
                </span>
                <button onClick={() => moveOrder(m, "down")} disabled={idx === members.length - 1}
                  className="p-1 rounded text-[var(--brand-text-muted)] hover:text-white disabled:opacity-20 transition-colors">
                  <ArrowDown size={12} />
                </button>
              </div>

              {}
              <ImagePreview url={m.photoUrl} name={m.name} />

              {}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">{m.name}</h3>
                  {m.isLeadership && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                      style={{ background: "linear-gradient(to right,#8B2FC9,#CC00CC)" }}>
                      <Shield size={9} /> Lead
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: "var(--brand-magenta)" }}>{m.role}</p>
                <p className="text-xs text-[var(--brand-text-muted)] truncate mt-0.5">· {m.education}</p>
              </div>

              {}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditing(m); setShowForm(true); }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-[rgba(139,47,201,0.1)] transition-all border border-transparent hover:border-[rgba(139,47,201,0.2)]"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(m._id, m.name)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <MemberModal
          member={editing}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
          onSave={fetchMembers}
        />
      )}
    </div>
  );
}
