
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, X, UserPlus, Crown, UserCheck, Eye, EyeOff, Clock, CheckCircle2, XCircle, Bell } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { cn, getErrorMessage } from "@/utils";
import api from "@/services/api";
import type { User } from "@/types";


function ApproveModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: () => void }) {
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await api.patch(`/auth/users/${user.id}/approve`, { role });
      toast.success(`${user.name} is now an ${role}! They've been notified by email.`);
      onSave(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  const handleReject = async () => {
    if (!confirm(`Remove ${user.name}'s pending account?`)) return;
    setLoading(true);
    try {
      await api.delete(`/auth/users/${user.id}`);
      toast.success("Request removed.");
      onSave(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="brand-card w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">Grant Access</h2>
            <p className="text-xs text-[var(--brand-text-muted)] mt-1">Choose what {user.name} can do</p>
          </div>
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: "rgba(139,47,201,0.06)", border: "1px solid rgba(139,47,201,0.15)" }}>
          {(user as User & { googleAvatar?: string }).googleAvatar ? (
            <img src={(user as User & { googleAvatar?: string }).googleAvatar} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" }}>
              {user.name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-[var(--brand-text-muted)] truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {([
            { value: "editor" as const, Icon: UserCheck, label: "Editor", desc: "Add & edit content. Cannot delete or manage users." },
            { value: "admin" as const, Icon: Crown, label: "Admin", desc: "Full access. Only for trusted people." },
          ] as const).map(({ value, Icon, label, desc }) => (
            <label key={value} className={cn(
              "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              role === value ? "border-[rgba(139,47,201,0.5)] bg-[rgba(139,47,201,0.1)]" : "border-[rgba(139,47,201,0.2)] hover:border-[rgba(139,47,201,0.35)]"
            )}>
              <input type="radio" value={value} checked={role === value} onChange={() => setRole(value)} className="sr-only" />
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: role === value ? "#8B2FC9" : "rgba(139,47,201,0.3)" }}>
                {role === value && <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-purple)]" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5"><Icon size={13} className="text-[var(--brand-purple)]" /><span className="text-sm font-semibold text-white">{label}</span></div>
                <p className="text-xs text-[var(--brand-text-muted)] mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={handleApprove} disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={15} />}
            Approve
          </button>
          <button onClick={handleReject} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 text-sm transition-all">
            <XCircle size={14} />Reject
          </button>
        </div>
      </div>
    </div>
  );
}


function InviteModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ name: string; email: string; password: string; role: "admin" | "editor" }>({ defaultValues: { role: "editor" } });

  const onSubmit = async (data: { name: string; email: string; password: string; role: "admin" | "editor" }) => {
    setLoading(true);
    try { await authService.register(data); toast.success(`${data.name} added as ${data.role}`); onSave(); onClose(); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="brand-card w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">Add with Password</h2>
            <p className="text-xs text-[var(--brand-text-muted)] mt-0.5">For people without Google accounts</p>
          </div>
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            {(["editor", "admin"] as const).map((v) => (
              <label key={v} className={cn("flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all", watch("role") === v ? "border-[rgba(139,47,201,0.5)] bg-[rgba(139,47,201,0.1)]" : "border-[rgba(139,47,201,0.2)]")}>
                <input {...register("role")} type="radio" value={v} className="sr-only" />
                <span className="text-xs font-bold text-white capitalize">{v}</span>
              </label>
            ))}
          </div>
          {([{ name: "name" as const, label: "Full Name", type: "text", placeholder: "Ahmed Hassan", rules: { required: "Required" } }, { name: "email" as const, label: "Email", type: "email", placeholder: "ahmed@beerantum.com", rules: { required: "Required" } }]).map(({ name, label, type, placeholder, rules }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">{label}</label>
              <input {...register(name, rules)} type={type} placeholder={placeholder} className={cn("brand-input", errors[name] && "error")} />
              {errors[name] && <p className="text-xs text-red-400">⚠ {errors[name]?.message}</p>}
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Password</label>
            <div className="relative">
              <input {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 chars" } })} type={showPass ? "text" : "password"} placeholder="Min 8 chars" className={cn("brand-input pr-9", errors.password && "error")} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)] hover:text-white">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">⚠ {errors.password.message}</p>}
          </div>
          <div className="flex gap-3 mt-1">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={14} />}
              Add User
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function AdminUsersPage() {
  const [users, setUsers] = useState<(User & { googleAvatar?: string; authMethod?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "pending">("active");
  const [approving, setApproving] = useState<User | undefined>();
  const [showInvite, setShowInvite] = useState(false);
  const currentUser = useAuthStore((s) => s.user);

  const fetchUsers = async () => {
    setLoading(true);
    try { const r = await api.get<{ data: (User & { googleAvatar?: string; authMethod?: string })[] }>("/auth/users"); setUsers(r.data.data || []); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const pending = users.filter((u) => u.role === "pending");
  const active = users.filter((u) => u.role !== "pending");

  const handleToggle = async (u: User) => {
    if (u.id === currentUser?.id) { toast.error("Cannot deactivate yourself!"); return; }
    try { await api.patch(`/auth/users/${u.id}`, { isActive: !u.isActive }); fetchUsers(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleDelete = async (u: User) => {
    if (u.id === currentUser?.id) { toast.error("Cannot remove yourself!"); return; }
    if (!confirm(`Remove ${u.name}?`)) return;
    try { await api.delete(`/auth/users/${u.id}`); toast.success("Removed"); fetchUsers(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">User Access</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">Control who can edit the website</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary text-sm"><Plus size={15} />Add with Password</button>
      </div>

      {pending.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 cursor-pointer" style={{ background: "rgba(204,0,204,0.08)", border: "1px solid rgba(204,0,204,0.3)" }} onClick={() => setTab("pending")}>
          <Bell size={18} className="text-[var(--brand-magenta)] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">{pending.length} person{pending.length !== 1 ? "s" : ""} waiting for your approval</p>
            <p className="text-xs text-[var(--brand-text-muted)]">{pending.map((u) => u.name).join(", ")}</p>
          </div>
          <span className="ml-auto text-xs font-mono text-[var(--brand-magenta)] uppercase tracking-widest flex-shrink-0">Review →</span>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {([{ key: "active" as const, label: `Active (${active.length})` }, { key: "pending" as const, label: `Pending (${pending.length})` }]).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn("text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-lg border transition-all", tab === key ? "text-white border-transparent" : "text-[var(--brand-text-muted)] border-[rgba(139,47,201,0.3)] hover:border-[var(--brand-magenta)]")}
            style={tab === key ? { background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" } : {}}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <div className="flex flex-col gap-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(139,47,201,0.06)" }} />)}</div>
        : tab === "pending" ? (
          pending.length === 0 ? (
            <div className="text-center py-16 brand-card"><CheckCircle2 size={40} className="mx-auto mb-3 text-green-400 opacity-60" /><p className="text-sm text-[var(--brand-text-muted)]">No pending requests!</p></div>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((u) => (
                <div key={u.id} className="brand-card p-4 flex items-center gap-4">
                  {u.googleAvatar ? <img src={u.googleAvatar} alt={u.name} className="w-10 h-10 rounded-full flex-shrink-0" /> : <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" }}>{u.name[0]}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-sm font-semibold text-white truncate">{u.name}</p><span className="flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full text-[var(--brand-text-muted)]" style={{ background: "rgba(60,60,80,0.6)" }}><Clock size={8} /> Pending</span></div>
                    <p className="text-xs text-[var(--brand-text-muted)] truncate">{u.email}</p>
                    {u.authMethod === "google" && <p className="text-[10px] text-green-400 mt-0.5">✓ Google account verified</p>}
                  </div>
                  <button onClick={() => setApproving(u)} className="btn-primary text-xs py-2 px-4 flex-shrink-0">Review</button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((u) => (
              <div key={u.id} className="brand-card p-4 flex items-center gap-4">
                {u.googleAvatar ? <img src={u.googleAvatar} alt={u.name} className="w-10 h-10 rounded-full flex-shrink-0" /> : <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" }}>{u.name[0]}</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{u.name}</p>
                    {u.id === currentUser?.id && <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[rgba(139,47,201,0.15)] text-[var(--brand-purple)] border border-[rgba(139,47,201,0.2)]">You</span>}
                    <span className={cn("inline-flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full", u.role === "admin" ? "text-[var(--brand-magenta)] border border-[rgba(204,0,204,0.3)] bg-[rgba(204,0,204,0.08)]" : "text-[var(--brand-purple)] border border-[rgba(139,47,201,0.3)] bg-[rgba(139,47,201,0.08)]")}>
                      {u.role === "admin" ? <Crown size={8} /> : <UserCheck size={8} />} {u.role}
                    </span>
                    <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded-full", u.isActive ? "text-green-400 border border-green-500/20" : "text-gray-500 border border-gray-500/20")}>{u.isActive ? "Active" : "Inactive"}</span>
                    {u.authMethod === "google" && <span className="text-[9px] text-[var(--brand-text-muted)]">🔑 Google</span>}
                  </div>
                  <p className="text-xs text-[var(--brand-text-muted)] mt-0.5">{u.email}</p>
                </div>
                {u.id !== currentUser?.id && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(u)} className="text-xs px-3 py-1.5 rounded-lg border transition-all text-[var(--brand-text-muted)] border-[rgba(139,47,201,0.2)] hover:text-white">{u.isActive ? "Deactivate" : "Activate"}</button>
                    <button onClick={() => handleDelete(u)} className="p-1.5 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {approving && <ApproveModal user={approving} onClose={() => setApproving(undefined)} onSave={fetchUsers} />}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onSave={fetchUsers} />}
    </div>
  );
}