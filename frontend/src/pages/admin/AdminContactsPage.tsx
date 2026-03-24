import { useState, useEffect } from "react";
import { Mail, Trash2, Eye, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { contactService } from "@/services";
import { cn, formatDate, getErrorMessage } from "@/utils";
import type { Contact, ContactStatus } from "@/types";

const STATUS_COLORS: Record<ContactStatus, string> = {
  new: "text-[var(--brand-magenta)] border-[rgba(204,0,204,0.3)] bg-[rgba(204,0,204,0.08)]",
  read: "text-blue-400 border-blue-400/30 bg-blue-400/08",
  replied: "text-green-400 border-green-400/30 bg-green-400/08",
  archived: "text-[var(--brand-text-muted)] border-[rgba(90,90,120,0.3)]",
};

function ContactModal({ contact, onClose, onUpdate }: { contact: Contact; onClose: () => void; onUpdate: () => void }) {
  const [status, setStatus] = useState<ContactStatus>(contact.status);
  const [notes, setNotes] = useState(contact.adminNotes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try { await contactService.updateStatus(contact._id, status, notes); toast.success("Updated"); onUpdate(); onClose(); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="brand-card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">Message Details</h2>
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)] mb-1">From</p><p className="text-white font-semibold">{contact.name}</p><p className="text-[var(--brand-text-muted)] text-xs">{contact.email}</p></div>
            <div><p className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)] mb-1">Date</p><p className="text-[var(--brand-text-muted)] text-xs">{formatDate(contact.createdAt)}</p></div>
          </div>
          <div><p className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)] mb-1">Subject</p><p className="text-white text-sm font-semibold">{contact.subject}</p></div>
          <div><p className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)] mb-1">Message</p><div className="bg-[rgba(26,26,46,0.8)] border border-[rgba(139,47,201,0.2)] rounded-lg p-4 text-sm text-[var(--brand-text)]">{contact.message}</div></div>
          <div><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as ContactStatus)} className="brand-input mt-1">
              {(["new", "read", "replied", "archived"] as ContactStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Admin Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Internal notes..." className="brand-input resize-none mt-1" /></div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center"><CheckCircle size={14} />Save</button>
            <button onClick={onClose} className="btn-outline px-4">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Contact | undefined>();
  const [filterStatus, setFilterStatus] = useState<string>("");

  const fetch = async () => { setLoading(true); try { const r = await contactService.getAll({ status: filterStatus || undefined }); setContacts(r.data.data || []); } catch (e) { toast.error(getErrorMessage(e)); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, [filterStatus]);

  const handleDelete = async (id: string) => { if (!confirm("Delete this message?")) return; try { await contactService.remove(id); toast.success("Deleted"); fetch(); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Messages</h1><p className="text-sm text-[var(--brand-text-muted)] mt-1">{contacts.length} submissions</p></div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="brand-input w-auto text-xs py-2 px-3">
          <option value="">All</option>
          {(["new", "read", "replied", "archived"] as ContactStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div className="flex flex-col gap-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-[rgba(139,47,201,0.06)] animate-pulse" />)}</div> : contacts.length === 0 ? (
        <div className="text-center py-20"><Mail size={48} className="mx-auto mb-4 text-[rgba(139,47,201,0.3)]" /><p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)]">No messages</p></div>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map(c => (
            <div key={c._id} className="brand-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="font-semibold text-white text-sm truncate">{c.name}</h3>
                  <span className="text-xs text-[var(--brand-text-muted)]">{c.email}</span>
                  <span className={cn("text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border", STATUS_COLORS[c.status])}>{c.status}</span>
                </div>
                <p className="text-xs text-[var(--brand-text-muted)] truncate"><span className="font-semibold text-[var(--brand-text)]">{c.subject}</span> — {c.message.slice(0, 80)}...</p>
                <p className="text-[10px] text-[rgba(139,47,201,0.5)] mt-0.5">{formatDate(c.createdAt)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setViewing(c)} className="p-1.5 rounded text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-[rgba(139,47,201,0.1)] transition-all"><Eye size={13} /></button>
                <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {viewing && <ContactModal contact={viewing} onClose={() => setViewing(undefined)} onUpdate={fetch} />}
    </div>
  );
}
