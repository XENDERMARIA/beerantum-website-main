import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, Handshake, Mail, TrendingUp, Plus } from "lucide-react";
import { teamService, eventsService, partnersService, contactService } from "@/services";
import { useAuthStore } from "@/store/authStore";

export default function AdminDashboard() {
  const user = useAuthStore(s => s.user);
  const [stats, setStats] = useState({ members: 0, events: 0, upcoming: 0, partners: 0, messages: 0, newMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      teamService.getAll(), eventsService.getAll(), partnersService.getAll(), contactService.getAll()
    ]).then(([t, e, p, c]) => {
      const events = e.data.data || [];
      const contacts = c.data.data || [];
      setStats({
        members: t.data.data?.length || 0,
        events: events.length,
        upcoming: events.filter((ev: { status: string }) => ev.status === "upcoming").length,
        partners: p.data.data?.length || 0,
        messages: contacts.length,
        newMessages: contacts.filter((c: { status: string }) => c.status === "new").length,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: "Team Members", value: stats.members, icon: Users, href: "/admin/team", color: "from-[#8B2FC9] to-[#A020C0]" },
    { label: "Total Events", value: stats.events, icon: Calendar, href: "/admin/events", color: "from-[#A020C0] to-[#CC00CC]" },
    { label: "Upcoming Events", value: stats.upcoming, icon: TrendingUp, href: "/admin/events", color: "from-[#CC00CC] to-[#DD00DD]" },
    { label: "Partners", value: stats.partners, icon: Handshake, href: "/admin/partners", color: "from-[#7020A8] to-[#9B2FC9]" },
    { label: "Total Messages", value: stats.messages, icon: Mail, href: "/admin/contacts", color: "from-[#5A1E8A] to-[#8B2FC9]" },
    { label: "New Messages", value: stats.newMessages, icon: Mail, href: "/admin/contacts", color: "from-[#8B2FC9] to-[#FF00FF]" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Dashboard</h1>
        <p className="text-sm text-[var(--brand-text-muted)] mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} to={href} className="brand-card p-5 flex flex-col gap-3 group">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon size={16} className="text-white" />
            </div>
            <div>
              {loading ? <div className="w-8 h-6 bg-[rgba(139,47,201,0.2)] animate-pulse rounded mb-1" /> : <p className="font-display text-2xl font-bold text-white">{value}</p>}
              <p className="text-xs text-[var(--brand-text-muted)] font-mono uppercase tracking-widest">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="brand-card p-6 mb-6">
        <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { to: "/admin/team", label: "Add Member" },
            { to: "/admin/events", label: "Create Event" },
            { to: "/admin/partners", label: "Add Partner" },
            { to: "/admin/contacts", label: "View Messages" },
          ].map(({ to, label }) => (
            <Link key={label} to={to} className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-1.5">
              <Plus size={12} />{label}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[rgba(139,47,201,0.15)] bg-[rgba(139,47,201,0.04)]">
        <p className="text-xs text-[var(--brand-text-muted)]">
          <span className="text-[var(--brand-purple)] font-semibold">Note:</span> Data is stored in MongoDB. Make sure your backend is running and connected before using the admin panel.
        </p>
      </div>
    </div>
  );
}
