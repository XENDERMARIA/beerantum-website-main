import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Save, Handshake, Upload, ExternalLink, Loader2, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { partnersService } from "@/services";
import api from "@/services/api";
import { cn, getErrorMessage } from "@/utils";
import type { Partner } from "@/types";

// ─── Simple inline logo uploader ────────────────────────────────────────────
function LogoUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post<{ success: boolean; data: { url: string } }>(
        `/upload?folder=partners`, fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onChange(res.data.data.url);
      toast.success("Logo uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Logo Image</label>
      
      {/* Preview / Upload area */}
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-colors flex items-center justify-center cursor-pointer overflow-hidden",
          uploading ? "border-[var(--brand-purple)] bg-[rgba(139,47,201,0.05)]" : "border-[rgba(139,47,201,0.25)] hover:border-[var(--brand-purple)] bg-[rgba(139,47,201,0.03)]"
        )}
        style={{ height: value ? "120px" : "100px" }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-[var(--brand-purple)] animate-spin" />
            <span className="text-xs text-[var(--brand-text-muted)]">Uploading…</span>
          </div>
        ) : value ? (
          <img src={value} alt="Logo" className="max-h-[100px] max-w-[200px] object-contain p-3" />
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <ImageIcon size={28} className="text-[var(--brand-purple)] opacity-50" />
            <span className="text-xs text-[var(--brand-text-muted)]">Click to upload logo</span>
            <span className="text-[10px] text-[var(--brand-text-muted)] opacity-60">JPG, PNG, WebP — max 5MB</span>
          </div>
        )}
        
        {/* Clear button */}
        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>
      
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}


// ─── Partner Modal ──────────────────────────────────────────────────────────
interface PartnerFormData {
  name: string;
  logoText: string;
  logoUrl: string;
  website: string;
  tier: string;
  order: number;
}

function PartnerModal({ partner, onClose, onSave }: { partner?: Partner; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!partner;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PartnerFormData>({
    defaultValues: partner
      ? { name: partner.name, logoText: partner.logoText || "", logoUrl: partner.logoUrl || "", website: partner.website || "", tier: partner.tier, order: partner.order }
      : { name: "", logoText: "", logoUrl: "", website: "", tier: "partner", order: 1 },
  });

  const logoUrl = watch("logoUrl");

  const onSubmit = async (data: PartnerFormData) => {
    setLoading(true);
    try {
      if (isEdit) await partnersService.update(partner!._id, data as Partial<Partner>);
      else await partnersService.create(data as never);
      toast.success(isEdit ? "✅ Partner updated!" : "✅ Partner added!");
      onSave(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div className="brand-card w-full max-w-lg p-0 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[rgba(139,47,201,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" }}>
              <Handshake size={16} className="text-white" />
            </div>
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">{isEdit ? "Edit Partner" : "Add Partner"}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--brand-text-muted)] hover:text-white hover:bg-[rgba(139,47,201,0.1)] transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6 overflow-y-auto flex-1">
          
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Université Paris-Saclay"
              className="brand-input"
            />
            {errors.name && <span className="text-red-400 text-[10px]">{errors.name.message}</span>}
          </div>

          {/* Logo Upload */}
          <LogoUpload
            value={logoUrl}
            onChange={(url) => setValue("logoUrl", url)}
          />

          {/* Manual URL fallback */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">
              Logo URL <span className="text-[var(--brand-text-muted)] opacity-50 normal-case">(or paste manually)</span>
            </label>
            <input {...register("logoUrl")} placeholder="https://example.com/logo.png" className="brand-input text-xs" />
          </div>

          {/* Logo Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Logo Text Fallback</label>
            <input {...register("logoText")} placeholder="Text to show if no logo image" className="brand-input" />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Website</label>
            <input {...register("website")} placeholder="https://..." className="brand-input" />
          </div>

          {/* Tier + Order row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Tier</label>
              <select {...register("tier")} className="brand-input">
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Order</label>
              <input {...register("order", { valueAsNumber: true })} type="number" min={1} className="brand-input" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-[rgba(139,47,201,0.1)]">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isEdit ? "Update Partner" : "Add Partner"}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}


// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | undefined>();

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const r = await partnersService.getAll();
      setPartners(r.data.data || []);
    } catch (e) { toast.error(getErrorMessage(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPartners(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from partners?`)) return;
    try {
      await partnersService.remove(id);
      toast.success("Partner removed");
      fetchPartners();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };

  const TIER_STYLE: Record<string, { bg: string; border: string; text: string }> = {
    platinum: { bg: "rgba(209,213,219,0.06)", border: "rgba(209,213,219,0.2)", text: "#D1D5DB" },
    gold:     { bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", text: "#FBBF24" },
    silver:   { bg: "rgba(156,163,175,0.06)", border: "rgba(156,163,175,0.2)", text: "#9CA3AF" },
    partner:  { bg: "rgba(139,47,201,0.06)", border: "rgba(139,47,201,0.2)", text: "var(--brand-purple)" },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Partners & Institutions</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">{partners.length} partners in the network</p>
        </div>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary">
          <Plus size={14} /> Add Partner
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-[rgba(139,47,201,0.06)] animate-pulse" />
          ))}
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-20">
          <Handshake size={48} className="mx-auto mb-4 text-[rgba(139,47,201,0.3)]" />
          <p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)] mb-4">No partners yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">
            <Plus size={14} /> Add First Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map(p => {
            const tier = TIER_STYLE[p.tier] || TIER_STYLE.partner;
            return (
              <div key={p._id} className="brand-card p-0 overflow-hidden group hover:border-[rgba(139,47,201,0.4)] transition-all">
                {/* Logo area */}
                <div className="h-20 flex items-center justify-center px-4 relative"
                  style={{ background: "rgba(139,47,201,0.03)" }}>
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="max-h-[50px] max-w-[140px] object-contain" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(139,47,201,0.15), rgba(204,0,204,0.1))", border: "1px solid rgba(139,47,201,0.2)" }}>
                      <span className="font-display font-bold text-sm text-[var(--brand-purple)]">
                        {(p.logoText || p.name).slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Tier badge */}
                  <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ background: tier.bg, border: `1px solid ${tier.border}`, color: tier.text }}>
                    {p.tier}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between gap-2 border-t border-[rgba(139,47,201,0.1)]">
                  <div className="min-w-0">
                    <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider truncate">{p.name}</h3>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] flex items-center gap-1 mt-0.5 transition-colors">
                        <ExternalLink size={8} /> Website
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => { setEditing(p); setShowForm(true); }}
                      className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-[rgba(139,47,201,0.1)] transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(p._id, p.name)}
                      className="p-2 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <PartnerModal
          partner={editing}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
          onSave={fetchPartners}
        />
      )}
    </div>
  );
}
