import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Handshake } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { partnersService } from "@/services";
import { cn, getErrorMessage } from "@/utils";
import type { Partner } from "@/types";

function PartnerModal({ partner, onClose, onSave }: { partner?: Partner; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!partner;
  const { register, handleSubmit } = useForm({
    defaultValues: partner ? { name: partner.name, logoText: partner.logoText || "", logoUrl: partner.logoUrl || "", website: partner.website || "", tier: partner.tier, order: partner.order } : { tier: "partner" as const },
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      if (isEdit) await partnersService.update(partner!._id, data as Partial<Partner>);
      else await partnersService.create(data as never);
      toast.success(isEdit ? "Updated" : "Added");
      onSave(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="brand-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">{isEdit ? "Edit Partner" : "Add Partner"}</h2>
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1"><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Name *</label><input {...register("name", { required: true })} placeholder="Partner name" className="brand-input" /></div>
          <div className="flex flex-col gap-1"><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Logo Text</label><input {...register("logoText")} placeholder="Fallback text if no logo" className="brand-input" /></div>
          <div className="flex flex-col gap-1"><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Logo URL</label><input {...register("logoUrl")} placeholder="https://..." className="brand-input" /></div>
          <div className="flex flex-col gap-1"><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Website</label><input {...register("website")} placeholder="https://..." className="brand-input" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1"><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Tier</label><select {...register("tier")} className="brand-input"><option value="platinum">Platinum</option><option value="gold">Gold</option><option value="silver">Silver</option><option value="partner">Partner</option></select></div>
            <div className="flex flex-col gap-1"><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Order</label><input {...register("order", { valueAsNumber: true })} type="number" min={1} className="brand-input" /></div>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}{isEdit ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose} className="btn-outline px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | undefined>();

  const fetch = async () => { setLoading(true); try { const r = await partnersService.getAll(); setPartners(r.data.data || []); } catch (e) { toast.error(getErrorMessage(e)); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Remove partner?")) return; try { await partnersService.remove(id); toast.success("Removed"); fetch(); } catch (e) { toast.error(getErrorMessage(e)); } };
  const TIER_COLORS: Record<string, string> = { platinum: "text-gray-200 border-gray-400/30", gold: "text-yellow-400 border-yellow-400/30", silver: "text-gray-400 border-gray-400/30", partner: "text-[var(--brand-purple)] border-[rgba(139,47,201,0.3)]" };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Partners</h1><p className="text-sm text-[var(--brand-text-muted)] mt-1">{partners.length} partners</p></div>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary"><Plus size={14} />Add Partner</button>
      </div>
      {loading ? <div className="grid grid-cols-2 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-[rgba(139,47,201,0.06)] animate-pulse" />)}</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map(p => (
            <div key={p._id} className="brand-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(139,47,201,0.1)] border border-[rgba(139,47,201,0.2)] flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-xs text-[var(--brand-purple)]">{p.logoText?.slice(0, 3) || p.name.slice(0, 3)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider truncate">{p.name}</h3>
                <span className={cn("text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border mt-1 inline-block", TIER_COLORS[p.tier])}>{p.tier}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-1.5 rounded text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-[rgba(139,47,201,0.1)] transition-all"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && partners.length === 0 && <div className="text-center py-20"><Handshake size={48} className="mx-auto mb-4 text-[rgba(139,47,201,0.3)]" /><p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)] mb-4">No partners</p><button onClick={() => setShowForm(true)} className="btn-primary inline-flex"><Plus size={14} />Add First Partner</button></div>}
      {showForm && <PartnerModal partner={editing} onClose={() => { setShowForm(false); setEditing(undefined); }} onSave={fetch} />}
    </div>
  );
}
