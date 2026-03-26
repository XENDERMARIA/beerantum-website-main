import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin, Facebook, Music2 } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = ["About", "Team", "Events", "Partners", "Involved", "Contact"];

  const socialLinks = [
    { Icon: Instagram, href: "https://www.instagram.com/beerantum/" },
    { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61586622063433" },
    { Icon: Music2, href: "https://vm.tiktok.com/ZS9JjsEFsfkKe-oMR2c/" },
    { Icon: Linkedin, href: "https://www.linkedin.com/company/beerantum/" },
    { Icon: Youtube, href: "https://youtube.com/@beerantum_official" },
  ];

  return (
    <footer className="bg-[#08080F] border-t border-[rgba(139,47,201,0.15)] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B2FC9] to-transparent" />
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[rgba(139,47,201,0.4)]" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#8B2FC9] to-[#FF00FF]" />
              </div>
              <span className="font-display text-sm font-bold tracking-[0.12em] text-white uppercase">
                Beer<span className="gradient-text">antum</span>
              </span>
            </div>
            <p className="text-sm text-[var(--brand-text-muted)] leading-relaxed mb-4">
              A quantum computing team fusing Beerus' transformative force with Schrödinger's quantum principle.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className="text-sm text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors w-fit">
                  {l}
                </a>
              ))}
            </div>
          </div>

          {}
          <div className="flex flex-col items-start md:items-end gap-4">
            <span className="text-5xl">🐱</span>
            <p className="font-mono text-xs text-[var(--brand-text-muted)] text-right">
              © {year} Beerantum<br />All rights reserved.
            </p>
            <Link to="/admin" className="text-xs font-mono text-[rgba(139,47,201,0.4)] hover:text-[var(--brand-purple)] transition-colors">
              Admin Panel →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
