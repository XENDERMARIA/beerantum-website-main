import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  ChevronDown, Zap, BookOpen, Trophy, Users,
  Lightbulb, Handshake, GraduationCap, Calendar, MapPin,
  Clock, ExternalLink, Send, CheckCircle, Mail, Globe, Linkedin, Github, Twitter,
  Facebook, Instagram, Youtube, Music2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { teamService, eventsService, partnersService, contactService, contentService } from "@/services";
import { cn, formatDateRange, getInitials, truncate, getErrorMessage } from "@/utils";
import type { TeamMember, Event, Partner, ContactFormData } from "@/types";


function HeroSection({ content }: { content?: Record<string, string> }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const bg = heroRef.current?.querySelector<HTMLElement>(".hero-bg");
      if (bg) bg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--brand-black)" }}
    >
      {}
      <div className="hero-bg absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full grid-bg opacity-50" />
        <div className="absolute inset-0 w-full h-full"
          style={{ background: "radial-gradient(ellipse 55% 55% at 65% 45%, rgba(139,47,201,0.14) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-56"
          style={{ background: "linear-gradient(to top, var(--brand-black), transparent)" }} />
        {}
        <div className="absolute top-[28%] left-[8%] w-80 h-80 rounded-full blur-3xl opacity-70 animate-float"
          style={{ background: "rgba(139,47,201,0.07)" }} />
        <div className="absolute bottom-[25%] right-[10%] w-60 h-60 rounded-full blur-3xl"
          style={{ background: "rgba(204,0,204,0.06)", animation: "float 6s ease-in-out infinite 2s" }} />
        {}
        <div className="absolute left-0 right-0 h-px animate-scan"
          style={{ background: "linear-gradient(to right, transparent, rgba(139,47,201,0.25), transparent)" }} />
      </div>

      {}
      <div className="page-container relative z-10 w-full pt-24 pb-16 min-h-screen flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-center">

          {}
          <div className="flex flex-col gap-6 xl:gap-8 min-w-0">
            <div className="flex items-center gap-3 fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-10 h-px" style={{ background: "linear-gradient(to right,#8B2FC9,#FF00FF)" }} />
              <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">
                Quantum Computing Team
              </span>
            </div>

            <h1 className="font-display font-black uppercase leading-tight fade-up" style={{ animationDelay: "0.2s" }}>
              {content?.headline ? (
                <span className="block gradient-text mt-1 pb-2 shadow-text" style={{ fontSize: "clamp(1.8rem, 5vw, 5.5rem)" }}>
                  {content.headline}
                </span>
              ) : (
                <>
                  <span className="block text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 4.5rem)" }}>
                    Welcome to
                  </span>
                  <span className="block gradient-text mt-1 pb-2" style={{ fontSize: "clamp(2rem, 5vw, 5.5rem)" }}>
                    Beerantum!
                  </span>
                </>
              )}
            </h1>

            <p className="text-base md:text-lg xl:text-xl text-[var(--brand-text)] leading-relaxed max-w-xl fade-up"
              style={{ animationDelay: "0.3s" }}>
              {content?.subtext ? (
                content.subtext
              ) : (
                <>
                  We are{" "}
                  <span style={{ color: "#CC00CC", fontWeight: 600 }}>Beerantum</span>, a quantum computing team
                  that fuses{" "}
                  <span style={{ color: "#FF00FF", fontWeight: 600 }}>Beerus' transformative force</span>{" "}
                  with{" "}
                  <span style={{ color: "#8B2FC9", fontWeight: 600 }}>Schrödinger's quantum principle.</span>
                </>
              )}
            </p>

            <p className="text-sm xl:text-base text-[var(--brand-text-muted)] fade-up"
              style={{ animationDelay: "0.38s" }}>
              Our mindset:{" "}
              <strong className="italic text-white">{content?.tagline || "Go beyond what is possible."}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 fade-up" style={{ animationDelay: "0.46s" }}>
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary text-sm py-3 px-8"
              >
                Discover More
              </button>
              <button
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline text-sm py-3 px-8"
              >
                Our Events
              </button>
            </div>

            {}
            <div className="grid grid-cols-3 gap-8 mt-2 pt-8 fade-up"
              style={{ animationDelay: "0.58s", borderTop: "1px solid rgba(139,47,201,0.15)" }}>
              {[{ v: "20+", l: "Workshops" }, { v: "500+", l: "Participants" }, { v: "3+", l: "Awards" }].map(s => (
                <div key={s.l}>
                  <span className="font-display font-bold text-3xl xl:text-4xl gradient-text block">{s.v}</span>
                  <span className="text-xs xl:text-sm text-[var(--brand-text-muted)] uppercase tracking-widest font-mono mt-1 block">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="flex items-center justify-center fade-up" style={{ animationDelay: "0.35s" }}>
            <div className="relative"
              style={{ width: "clamp(280px,32vw,520px)", height: "clamp(280px,32vw,520px)" }}>

              {}
              {[0, 1, 2].map(i => (
                <div key={i} className="absolute inset-0 rounded-full border"
                  style={{
                    inset: `${i * 8}%`,
                    borderColor: `rgba(${i === 0 ? "139,47,201" : i === 1 ? "204,0,204" : "255,0,255"},0.22)`,
                    animation: i % 2 === 0 ? "spin 20s linear infinite" : "spin 12s linear infinite reverse",
                  }}>
                  <div className="absolute w-3 h-3 rounded-full"
                    style={{
                      top: i === 0 ? "-6px" : i === 1 ? "50%" : "auto",
                      bottom: i === 2 ? "-5px" : "auto",
                      left: i === 0 ? "50%" : i === 1 ? "auto" : "50%",
                      right: i === 1 ? "-6px" : "auto",
                      transform: i !== 1 ? "translateX(-50%)" : "translateY(-50%)",
                      background: i === 0 ? "#8B2FC9" : i === 1 ? "#CC00CC" : "#FF00FF",
                      boxShadow: `0 0 12px ${i === 0 ? "rgba(139,47,201,1)" : i === 1 ? "rgba(204,0,204,1)" : "rgba(255,0,255,1)"}`,
                    }} />
                </div>
              ))}

              {}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl scale-150"
                    style={{ background: "radial-gradient(circle,rgba(204,0,204,0.45) 0%,transparent 70%)" }} />
                  <div className="relative rounded-full flex items-center justify-center"
                    style={{
                      width: "clamp(70px,8vw,120px)",
                      height: "clamp(70px,8vw,120px)",
                      background: "linear-gradient(135deg,#8B2FC9,#FF00FF)",
                      boxShadow: "0 0 50px rgba(204,0,204,0.65)",
                    }}>
                    <span className="font-display font-black text-white"
                      style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)" }}>B</span>
                  </div>
                </div>
              </div>

              {}
              {[{ top: "18%", left: "72%", size: 8, color: "#8B2FC9" },
                { top: "26%", left: "84%", size: 5, color: "#CC00CC" },
                { top: "68%", left: "14%", size: 7, color: "#8B2FC9" },
                { top: "78%", left: "76%", size: 5, color: "#FF00FF" }].map((d, i) => (
                <div key={i} className="absolute rounded-full animate-pulse"
                  style={{ top: d.top, left: d.left, width: d.size, height: d.size, background: d.color, boxShadow: `0 0 ${d.size * 2}px ${d.color}` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {}
      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors"
      >
        <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}


function WhatWeDoSection({ content }: { content?: Record<string, string> }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const pillars = [
    { icon: Zap, title: "Hackathons", desc: "Organize and participate in competitive quantum hackathons pushing the boundaries of what's possible." },
    { icon: BookOpen, title: "Workshops", desc: "Hands-on quantum learning sessions for beginners and advanced practitioners alike." },
    { icon: Trophy, title: "Competitions", desc: "Enter global quantum computing competitions to demonstrate our skills on the world stage." },
    { icon: Users, title: "Community", desc: "Build a thriving worldwide network of quantum enthusiasts and innovators." },
  ];

  return (
    <section id="about" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-dark-1)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-25" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("max-w-3xl mb-16 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Our Focus</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            What We <span className="gradient-text">Do?</span>
          </h2>
          <div className="section-divider" />
          <p className="text-[var(--brand-text-muted)] leading-relaxed mt-5 text-base xl:text-lg max-w-2xl">
            {content?.description || "We promote hackathons, workshops and pioneering events in quantum computing. Our mission is to deconstruct complex challenges and lead through innovation."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 mb-14">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <div key={title}
              className={cn("brand-card p-7 flex flex-col gap-5 transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(139,47,201,0.15)", border: "1px solid rgba(139,47,201,0.25)" }}>
                <Icon size={22} className="text-[var(--brand-magenta)]" />
              </div>
              <h3 className="font-display text-sm xl:text-base font-bold text-white uppercase tracking-wider">{title}</h3>
              <p className="text-sm xl:text-base text-[var(--brand-text-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className={cn("transition-all duration-700 delay-500", inView ? "opacity-100" : "opacity-0")}>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary text-sm py-3 px-8"
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}


function MissionSection({ content }: { content?: Record<string, string> }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const values = [
    { icon: Lightbulb, title: "Innovation", desc: "We relentlessly pursue novel approaches to quantum challenges that others haven't attempted.", from: "#8B2FC9", to: "#A020C0" },
    { icon: Handshake, title: "Collaboration", desc: "Great quantum leaps happen together. We foster diverse minds working toward shared breakthroughs.", from: "#A020C0", to: "#CC00CC" },
    { icon: GraduationCap, title: "Continuous Learning", desc: "The quantum frontier always expands. We commit to growing our knowledge and sharing it openly.", from: "#CC00CC", to: "#FF00FF" },
  ];

  return (
    <>
      {}
      <section id="mission" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
        style={{ background: "var(--brand-black)" }}>
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {}
            <div ref={ref} className={cn("flex justify-center transition-all duration-700", inView ? "opacity-100" : "opacity-0")}>
              <div className="relative" style={{ width: "clamp(240px,25vw,380px)", height: "clamp(240px,25vw,380px)" }}>
                {[1, 0.75, 0.5].map((s, i) => (
                  <div key={i} className="absolute inset-0 rounded-full border"
                    style={{ transform: `scale(${s})`, borderColor: "rgba(139,47,201,0.15)" }} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border flex items-center justify-center"
                    style={{ width: "40%", height: "40%", borderColor: "rgba(204,0,204,0.3)", background: "rgba(204,0,204,0.05)" }}>
                    <span style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>🎯</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn("flex flex-col gap-7 transition-all duration-700 delay-200",
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
              <div>
                <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">What drives us</span>
                <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
                  Our <span className="gradient-text">Mission</span>
                </h2>
                <div className="section-divider" />
              </div>
              <p className="text-[var(--brand-text)] leading-relaxed text-base xl:text-lg">
                {content?.text ? (
                  content.text
                ) : (
                  <>
                    To be the leading force in innovation, education and competition in the field of quantum
                    computing. We don't just face challenges —{" "}
                    <span className="font-semibold" style={{ color: "var(--brand-magenta)" }}>we redefine them.</span>
                  </>
                )}
              </p>
              <div className="flex flex-col gap-4">
                {["Pioneer quantum innovation through hands-on research",
                  "Educate and inspire the next generation of quantum talent",
                  "Win competitions and demonstrate quantum supremacy globally"].map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg,#8B2FC9,#FF00FF)" }}>
                      <CheckCircle size={12} className="text-white" />
                    </div>
                    <p className="text-sm xl:text-base text-[var(--brand-text-muted)]">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
        style={{ background: "var(--brand-dark-2)" }}>
        <div className="absolute inset-0 w-full h-full grid-bg opacity-30" />
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">What we stand for</span>
            <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
              Our Core <span className="gradient-text">Values!</span>
            </h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
            {values.map(({ icon: Icon, title, desc, from, to }) => (
              <div key={title} className="brand-card p-8 xl:p-10 flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg,${from},${to})` }}>
                  <Icon size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg xl:text-xl font-bold text-white uppercase tracking-wider mb-3">{title}</h3>
                  <p className="text-sm xl:text-base text-[var(--brand-text-muted)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── TEAM ──────────────────────────────────────────────────────────────────────
function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    teamService.getAll()
      .then(r => setMembers(r.data.data || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="team" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-black)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-20" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("mb-14 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">The people behind the mission</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Our <span className="gradient-text">Team</span>
          </h2>
          <div className="section-divider" />
          <p className="text-[var(--brand-text-muted)] mt-5 max-w-2xl xl:max-w-3xl text-base xl:text-lg">
            Our diverse team of quantum enthusiasts, researchers, and innovators working together to destroy challenges and stay at the top.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-xl animate-pulse" style={{ background: "rgba(139,47,201,0.06)" }} />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-24">
            <Users size={56} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
            <p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)] mb-2">No team members yet</p>
            <p className="text-xs text-[var(--brand-text-muted)]">Add members in the Admin Panel → Team</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {members.map((m, i) => (
              <div key={m._id}
                className={cn("brand-card overflow-hidden group flex flex-col transition-all duration-700",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}
                style={{ transitionDelay: `${0.05 + i * 0.06}s` }}>
                <div className="relative overflow-hidden" style={{ height: "clamp(160px,18vw,220px)" }}>
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="photo-placeholder w-full h-full text-xl xl:text-2xl">
                      {getInitials(m.name)}
                    </div>
                  )}
                  {m.isLeadership && (
                    <div className="absolute top-3 left-3 text-white text-[10px] font-display font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: "linear-gradient(to right,#8B2FC9,#CC00CC)" }}>Lead</div>
                  )}
                </div>
                <div className="p-5 xl:p-6 flex flex-col gap-2 flex-1">
                  <h3 className="font-display font-bold text-white text-sm xl:text-base uppercase tracking-wider">{m.name}</h3>
                  <p className="text-xs xl:text-sm font-mono uppercase tracking-widest" style={{ color: "var(--brand-magenta)" }}>{m.role}</p>
                  <p className="text-xs xl:text-sm text-[var(--brand-text-muted)]">· {m.education}</p>
                  {m.bio && <p className="text-xs xl:text-sm text-[var(--brand-text-muted)] line-clamp-2 mt-1">{m.bio}</p>}
                  {(m.socialLinks?.linkedin || m.socialLinks?.github || m.socialLinks?.twitter) && (
                    <div className="flex gap-3 mt-auto pt-3" style={{ borderTop: "1px solid rgba(139,47,201,0.1)" }}>
                      {m.socialLinks?.linkedin && <a href={m.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors"><Linkedin size={14} /></a>}
                      {m.socialLinks?.github && <a href={m.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors"><Github size={14} /></a>}
                      {m.socialLinks?.twitter && <a href={m.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] transition-colors"><Twitter size={14} /></a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── EVENTS ────────────────────────────────────────────────────────────────────
function EventsSection() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    eventsService.getAll()
      .then(r => setEvents(r.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => e.status === tab);

  return (
    <section id="events" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-dark-1)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-30" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Join us</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Our <span className="gradient-text">Events!</span>
          </h2>
          <div className="section-divider" />
          <p className="text-[var(--brand-text-muted)] mt-5 max-w-2xl xl:max-w-3xl text-base xl:text-lg">
            From hackathons to workshops — opportunities for learning, collaboration, and innovation in quantum computing.
          </p>
        </div>

        <div className="flex gap-3 mb-10">
          {(["upcoming", "past"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn(
                "font-display text-xs xl:text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg border transition-all duration-200",
                tab === t
                  ? "text-white border-transparent"
                  : "text-[var(--brand-text-muted)] hover:text-white"
              )}
              style={tab === t ? { background: "linear-gradient(135deg,#8B2FC9,#CC00CC)", boxShadow: "0 0 20px rgba(139,47,201,0.4)" }
                : { background: "transparent", borderColor: "rgba(139,47,201,0.3)" }}>
              {t === "upcoming" ? "Upcoming Events" : "Past Events"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            {[...Array(2)].map((_, i) => <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: "rgba(139,47,201,0.06)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={56} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
            <p className="font-display text-sm uppercase tracking-widest text-[var(--brand-text-muted)]">No {tab} events</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 xl:gap-8">
            {filtered.map((event, i) => (
              <div key={event._id}
                className={cn("rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 hover:-translate-y-0.5",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}
                style={{
                  transitionDelay: `${0.1 + i * 0.1}s`,
                  background: "rgba(20,20,32,0.95)",
                  border: "1px solid rgba(139,47,201,0.2)",
                }}>
                <div className="relative flex-shrink-0"
                  style={{ width: "100%", maxWidth: "240px", minHeight: "180px" }}>
                  {event.imageUrl
                    ? <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#8B2FC9,rgba(204,0,204,0.4))" }}>
                        <Calendar size={44} className="text-white opacity-40" />
                      </div>}
                  <div className="absolute top-3 left-3 text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ background: event.status === "upcoming" ? "rgba(139,47,201,0.9)" : "rgba(60,60,80,0.9)" }}>
                    {event.status}
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-6 xl:p-8 flex-1">
                  <h3 className="font-display font-bold text-white text-base xl:text-xl uppercase tracking-wider leading-tight">{event.title}</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs xl:text-sm text-[var(--brand-text-muted)]">
                      <Calendar size={13} style={{ color: "var(--brand-purple)" }} />
                      <span>{formatDateRange(event.date, event.endDate)}</span>
                      {event.timeDisplay && <><span style={{ color: "rgba(139,47,201,0.4)" }}>·</span><Clock size={13} style={{ color: "var(--brand-purple)" }} /><span>{event.timeDisplay}</span></>}
                    </div>
                    <div className="flex items-center gap-2 text-xs xl:text-sm text-[var(--brand-text-muted)]">
                      <MapPin size={13} style={{ color: "var(--brand-purple)" }} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-sm xl:text-base text-[var(--brand-text-muted)]">{truncate(event.description, 180)}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <span key={tag} className="text-[10px] xl:text-xs font-mono uppercase tracking-widest px-3 py-1 rounded"
                        style={{ border: "1px solid rgba(139,47,201,0.3)", color: "var(--brand-purple)", background: "rgba(139,47,201,0.08)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {event.registrationUrl && event.status === "upcoming" && (
                    <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(139,47,201,0.1)" }}>
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2.5 px-5">
                        Register Now <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── PARTNERS ──────────────────────────────────────────────────────────────────
function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    partnersService.getAll()
      .then(r => setPartners(r.data.data || []))
      .catch(() => setPartners([]));
  }, []);

  return (
    <section id="partners" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-dark-2)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-30" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100" : "opacity-0")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Powered by</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Our Partners <span className="gradient-text">&amp; Sponsors</span>
          </h2>
          <div className="section-divider mx-auto" />
        </div>
        {partners.length === 0 ? (
          <p className="text-center text-[var(--brand-text-muted)] text-sm">Partners will appear here once added via the admin panel.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 xl:gap-10">
            {partners.map((p, i) => (
              <div key={p._id}
                className={cn("relative rounded-2xl px-10 py-6 flex items-center justify-center group transition-all duration-300",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
                style={{
                  transitionDelay: `${0.1 + i * 0.1}s`,
                  background: "rgba(26,26,46,0.85)",
                  border: "1px solid rgba(139,47,201,0.2)",
                  minWidth: "160px",
                }}>
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded border"
                  style={{
                    background: "var(--brand-dark-2)",
                    color: p.tier === "platinum" ? "#D1D5DB" : p.tier === "gold" ? "#FBBF24" : "var(--brand-purple)",
                    borderColor: p.tier === "platinum" ? "rgba(209,213,219,0.3)" : p.tier === "gold" ? "rgba(251,191,36,0.3)" : "rgba(139,47,201,0.3)",
                  }}>{p.tier}</div>
                {p.logoUrl ? (
                  <img src={p.logoUrl} alt={p.name} className="h-10 xl:h-14 w-auto object-contain" />
                ) : p.website ? (
                  <a href={p.website} target="_blank" rel="noopener noreferrer"
                    className="font-display font-bold text-xl xl:text-2xl text-white tracking-wide hover:text-[var(--brand-magenta)] transition-colors">
                    {p.logoText || p.name}
                  </a>
                ) : (
                  <span className="font-display font-bold text-xl xl:text-2xl text-white tracking-wide">{p.logoText || p.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── GET INVOLVED + CONTACT FORM ──────────────────────────────────────────────
function ContactSection() {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState("loading");
    try {
      await contactService.submit(data);
      setSubmitState("success");
      reset();
      toast.success("Message sent! We'll reply within 48 hours.");
      setTimeout(() => setSubmitState("idle"), 5000);
    } catch (err) {
      setSubmitState("idle");
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      {/* Get Involved */}
      <section id="involved" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
        style={{ background: "var(--brand-black)" }}>
        <div className="absolute inset-0 w-full h-full grid-bg opacity-20" />
        <div className="page-container relative z-10 text-center">
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Be part of the future</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Get <span className="gradient-text">Involved</span>
          </h2>
          <div className="section-divider mx-auto" />
          <p className="text-[var(--brand-text-muted)] mt-6 max-w-2xl mx-auto text-base xl:text-lg">
            Join the Beerantum community and be part of our pioneering team. Plenty of ways to make an impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 xl:gap-8 mt-12 max-w-4xl mx-auto">
            {[{ e: "🔬", t: "Research", d: "Contribute to cutting-edge quantum research projects" },
              { e: "🏆", t: "Compete", d: "Join our team for global quantum competitions" },
              { e: "🎓", t: "Learn", d: "Attend workshops and grow your quantum skills" }].map(({ e, t, d }) => (
              <div key={t} className="brand-card p-8 xl:p-10 flex flex-col items-center gap-4">
                <span style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>{e}</span>
                <h3 className="font-display text-sm xl:text-base font-bold text-white uppercase tracking-wider">{t}</h3>
                <p className="text-sm xl:text-base text-[var(--brand-text-muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
        style={{ background: "var(--brand-dark-1)" }}>
        <div className="absolute inset-0 w-full h-full grid-bg opacity-25" />
        <div ref={ref} className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Left info */}
            <div className={cn("flex flex-col gap-8 transition-all duration-700",
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")}>
              <div>
                <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Reach out</span>
                <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
                  Send Us Your <span className="gradient-text">Message</span>
                </h2>
                <div className="section-divider" />
              </div>
              <p className="text-[var(--brand-text-muted)] text-base xl:text-lg">
                Have questions about our team, events, or collaborations? We'd love to hear from you.
              </p>
              <div className="flex flex-col gap-5">
                {[
                  { Icon: Mail, l: "Email", v: "contact@beerantum.com", h: "mailto:contact@beerantum.com" },
                  { Icon: Globe, l: "Website", v: "beerantum.com", h: null }
                ].map(({ Icon, l, v, h }) => (
                  <div key={l} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,47,201,0.12)", border: "1px solid rgba(139,47,201,0.2)" }}>
                      <Icon size={18} style={{ color: "var(--brand-purple)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-[var(--brand-text-muted)] uppercase tracking-widest">{l}</p>
                      {h ? <a href={h} className="text-sm xl:text-base text-[var(--brand-text)] hover:text-[var(--brand-magenta)] transition-colors">{v}</a>
                        : <p className="text-sm xl:text-base text-[var(--brand-text)]">{v}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Brand Socials */}
              <div className="flex gap-4 pt-2">
                {[
                  { Icon: Instagram, href: "https://www.instagram.com/beerantum/" },
                  { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61586622063433" },
                  { Icon: Music2, href: "https://vm.tiktok.com/ZS9JjsEFsfkKe-oMR2c/" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/company/beerantum/" },
                  { Icon: Youtube, href: "https://youtube.com/@beerantum_official" },
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 bg-[rgba(139,47,201,0.08)] border border-[rgba(139,47,201,0.15)] text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:border-[rgba(139,47,201,0.3)] hover:scale-110">
                    <Icon size={18} />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-5" style={{ borderTop: "1px solid rgba(139,47,201,0.1)" }}>
                <span style={{ fontSize: "2.5rem" }}>🐱</span>
                <p className="text-xs xl:text-sm text-[var(--brand-text-muted)] font-mono italic">
                  "Until you send it, the message is both received and not received."
                </p>
              </div>
            </div>

            {/* Right form */}
            <div className={cn("brand-card p-8 xl:p-10 transition-all duration-700 delay-200",
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                {[
                  { name: "name" as const, label: "Name", type: "text", placeholder: "Your name", rules: { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } } },
                  { name: "email" as const, label: "Email", type: "email", placeholder: "your@email.com", rules: { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Valid email required" } } },
                  { name: "subject" as const, label: "Subject", type: "text", placeholder: "What's this about?", rules: { required: "Subject is required" } },
                ].map(({ name, label, type, placeholder, rules }) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">{label} *</label>
                    <input {...register(name, rules)} type={type} placeholder={placeholder} className={cn("brand-input", errors[name] && "error")} />
                    {errors[name] && <p className="text-xs text-red-400">{errors[name]?.message}</p>}
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Message *</label>
                  <textarea
                    {...register("message", { required: "Message is required", minLength: { value: 10, message: "Min 10 characters" } })}
                    rows={5} placeholder="Tell us more..."
                    className={cn("brand-input resize-none", errors.message && "error")}
                  />
                  {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitState === "loading" || submitState === "success"}
                  className={cn("btn-primary mt-2 justify-center py-3",
                    submitState === "success" && "!bg-gradient-to-r !from-green-600 !to-green-500")}
                >
                  {submitState === "loading"
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    : submitState === "success"
                    ? <><CheckCircle size={16} />Message Sent!</>
                    : <><Send size={16} />Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    contentService.getAll().then(r => {
      setContent((r.data.data || {}) as Record<string, Record<string, string>>);
    }).catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <HeroSection content={content.hero} />
        <WhatWeDoSection content={content.whatWeDo} />
        <MissionSection content={content.mission} />
        <TeamSection />
        <EventsSection />
        <PartnersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
