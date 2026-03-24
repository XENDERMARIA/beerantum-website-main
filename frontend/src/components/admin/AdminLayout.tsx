
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, Handshake, Mail, FileText,
  Menu, X, ExternalLink, LogOut, ChevronRight, UserCog, Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services";
import { cn } from "@/utils";

const NAV_LINKS = [
  { href: "/admin",            label: "Dashboard",     icon: LayoutDashboard, exact: true  },
  { href: "/admin/team",       label: "Team Members",  icon: Users                         },
  { href: "/admin/events",     label: "Events",        icon: Calendar                      },
  { href: "/admin/partners",   label: "Partners",      icon: Handshake                     },
  { href: "/admin/contacts",   label: "Messages",      icon: Mail                          },
  { href: "/admin/content",    label: "Site Content",  icon: FileText                      },
];


const USERS_LINK = { href: "/admin/users", label: "Users & Access", icon: UserCog };

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try { await authService.logout(); } catch {  }
    logout();
    navigate("/login");
    toast.success("Logged out");
    onClose?.();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--brand-dark-1)" }}>
      {}
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(139,47,201,0.15)" }}>
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <img src="/images/BeerantumLogo.png" alt="Beerantum" className="h-8 w-auto" />
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white"><X size={18} /></button>
        )}
      </div>

      {}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[var(--brand-text-muted)] px-3 mb-2 mt-2">Content</p>
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => (
          <Link key={href} to={href} onClick={onClose}
            className={cn("admin-sidebar-link", isActive(href, exact) && "active")}>
            <Icon size={16} />{label}
          </Link>
        ))}

        {}
        {isAdmin && (
          <>
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[var(--brand-text-muted)] px-3 mb-2 mt-4">Admin</p>
            <Link to={USERS_LINK.href} onClick={onClose}
              className={cn(
                "admin-sidebar-link relative",
                isActive(USERS_LINK.href) && "active"
              )}>
              <UserCog size={16} />
              {USERS_LINK.label}
              <span className="ml-auto inline-flex items-center gap-0.5 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full text-[var(--brand-magenta)]"
                style={{ background: "rgba(204,0,204,0.1)", border: "1px solid rgba(204,0,204,0.25)" }}>
                <Crown size={8} /> Admin
              </span>
            </Link>
          </>
        )}
      </nav>

      {}
      <div className="p-4" style={{ borderTop: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-display font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" }}>
            {user?.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              {user?.role === "admin"
                ? <Crown size={9} className="text-[var(--brand-magenta)]" />
                : <UserCog size={9} className="text-[var(--brand-purple)]" />}
              <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">{user?.role}</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="admin-sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border-transparent">
          <LogOut size={15} />Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const allLinks = [...NAV_LINKS, USERS_LINK];
  const currentLink = allLinks.find(l =>
    (l as any).exact ? location.pathname === l.href : location.pathname.startsWith(l.href) && l.href !== "/admin"
  );

  return (
    <div className="min-h-screen flex" style={{ background: "var(--brand-black)" }}>
      {}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen flex-shrink-0"
        style={{ borderRight: "1px solid rgba(139,47,201,0.15)" }}>
        <Sidebar />
      </aside>

      {}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}>
          <aside className="w-64 min-h-screen" style={{ borderRight: "1px solid rgba(139,47,201,0.15)" }}
            onClick={e => e.stopPropagation()}>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {}
        <header className="h-16 flex items-center justify-between px-5 flex-shrink-0"
          style={{ background: "var(--brand-dark-1)", borderBottom: "1px solid rgba(139,47,201,0.15)" }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[var(--brand-text-muted)] hover:text-white" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--brand-text-muted)] uppercase tracking-wider">
              <span>Admin</span>
              {currentLink && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-white">{currentLink.label}</span>
                </>
              )}
            </div>
          </div>
          <Link to="/" target="_blank"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors">
            View Site<ExternalLink size={11} />
          </Link>
        </header>

        <main className="flex-1 p-5 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}