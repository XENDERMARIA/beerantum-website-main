import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Partners", href: "#partners" },
  { label: "Involved", href: "#involved" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["about", "team", "events", "partners", "involved", "contact"];
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(s); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.startsWith("#") ? href.slice(1) : href;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-[rgba(139,47,201,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      )}>
        <div className="page-container flex items-center justify-between h-16 md:h-20">
          {}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center group flex-shrink-0"
          >
            <img
              src="/images/BeerantumLogo.png"
              alt="Beerantum"
              className="h-10 md:h-12 w-auto object-contain"
              style={{ filter: "brightness(1.1)" }}
            />
          </button>

          {}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className={cn("nav-link", active === item.href.slice(1) && "active")}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scrollTo("#contact")} className="btn-primary text-xs py-2.5 px-6">
              Contact
            </button>
          </div>

          <button className="md:hidden text-white p-2 rounded" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0F]/98 backdrop-blur-md flex flex-col pt-16">
          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {[...NAV_ITEMS, { label: "Contact", href: "#contact" }].map(item => (
              <button key={item.label} onClick={() => scrollTo(item.href)}
                className="font-display text-2xl font-bold uppercase tracking-widest text-[var(--brand-text-muted)] hover:text-white transition-colors">
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
