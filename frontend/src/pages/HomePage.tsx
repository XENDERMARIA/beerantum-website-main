import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  ChevronDown, Zap, BookOpen, Trophy, Users,
  Lightbulb, Handshake, GraduationCap, Calendar, MapPin,
  Clock, ExternalLink, Send, CheckCircle, Mail, Globe, Linkedin, Github, Twitter,
  Facebook, Instagram, Youtube, Music2, FileText, X, Award, Search, Medal,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { teamService, eventsService, partnersService, contactService, contentService, achievementsService, advisorsService, publicationsService } from "@/services";
import { cn, formatDateRange, getInitials, truncate, getErrorMessage } from "@/utils";
import type { TeamMember, Event, Partner, ContactFormData, Achievement, Advisor, Publication } from "@/types";
import { Skeleton, TeamMemberSkeleton, EventSkeleton, PartnerSkeleton, ContentSkeleton } from "@/components/ui/Skeleton";


const parseHeadline = (text: string) => {
  if (!text.includes("|")) return <span className="block gradient-text mt-1 pb-2 shadow-text" style={{ fontSize: "clamp(1.8rem, 5vw, 5.5rem)" }}>{text}</span>;
  const [white, gradient] = text.split("|").map(s => s.trim());
  return (
    <>
      <span className="block text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 4.5rem)" }}>
        {white}
      </span>
      <span className="block gradient-text mt-1 pb-2" style={{ fontSize: "clamp(2rem, 5vw, 5.5rem)" }}>
        {gradient}
      </span>
    </>
  );
};

const parseSubtext = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\[p\].*?\[\/p\]|\[m\].*?\[\/m\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[p]") && part.endsWith("[/p]")) {
      return <span key={i} className="highlight-purple">{part.slice(3, -4)}</span>;
    }
    if (part.startsWith("[m]") && part.endsWith("[/m]")) {
      return <span key={i} className="highlight-magenta">{part.slice(3, -4)}</span>;
    }
    return part;
  });
};


function MemberDetailModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col modal-enter"
        style={{
          background: "linear-gradient(145deg, rgba(25,25,35,0.95), rgba(15,15,20,0.98))",
          border: "1px solid rgba(139,47,201,0.4)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(139,47,201,0.15)"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative flex-shrink-0 border-b border-[rgba(139,47,201,0.2)]">
          {member.photoUrl ? (
            <div className="h-64 sm:h-80 w-full relative">
              <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,15,20,1)] to-transparent" />
            </div>
          ) : (
            <div className="h-32 sm:h-40 w-full relative overflow-hidden" style={{ background: "var(--brand-dark-2)" }}>
              <div className="absolute inset-0 opacity-20 grid-bg" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--brand-purple)] rounded-full blur-[80px] opacity-30" />
            </div>
          )}

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/10 text-white/70 flex items-center justify-center hover:bg-[var(--brand-purple)] hover:text-white transition-all z-10 backdrop-blur-md"
          >
            <X size={18} />
          </button>

          {/* Title Info */}
          <div className={cn("px-6 sm:px-8", member.photoUrl ? "absolute bottom-0 left-0 right-0 pb-6" : "absolute bottom-0 left-0 right-0 pb-6")}>
            {!member.photoUrl && (
              <div className="w-16 h-16 rounded-xl mb-4 border border-[rgba(139,47,201,0.3)] shadow-lg flex items-center justify-center text-2xl" 
                style={{ background: "linear-gradient(135deg,#8B2FC9,#CC00CC)", color: "white", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                {getInitials(member.name)}
              </div>
            )}
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wider drop-shadow-md">{member.name}</h2>
            <p className="font-mono text-sm sm:text-base uppercase tracking-[0.2em] mt-1 text-[var(--brand-magenta)] font-bold">{member.role}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {member.education && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--brand-text-muted)] border-b border-[rgba(255,255,255,0.05)] pb-2">
                <GraduationCap size={18} className="text-[var(--brand-purple)]" />
                <span className="text-xs font-mono uppercase tracking-[0.15em] font-semibold text-white/60">Education</span>
              </div>
              <p className="text-[var(--brand-text)] text-sm sm:text-base">{member.education}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[var(--brand-text-muted)] border-b border-[rgba(255,255,255,0.05)] pb-2">
              <FileText size={18} className="text-[var(--brand-purple)]" />
              <span className="text-xs font-mono uppercase tracking-[0.15em] font-semibold text-white/60">Biography</span>
            </div>
            <div className="text-[var(--brand-text-muted)] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {member.bio || <span className="italic opacity-50">No detailed biography provided for this member yet.</span>}
            </div>
          </div>

          {(member.socialLinks?.linkedin || member.socialLinks?.github || member.socialLinks?.twitter) && (
            <div className="pt-4 flex gap-3">
              {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white/70 hover:text-[var(--brand-magenta)] hover:border-[var(--brand-magenta)] hover:bg-[rgba(255,0,255,0.05)] transition-all"><Linkedin size={18} /></a>}
              {member.socialLinks?.github && <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white/70 hover:text-[var(--brand-magenta)] hover:border-[var(--brand-magenta)] hover:bg-[rgba(255,0,255,0.05)] transition-all"><Github size={18} /></a>}
              {member.socialLinks?.twitter && <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white/70 hover:text-[var(--brand-magenta)] hover:border-[var(--brand-magenta)] hover:bg-[rgba(255,0,255,0.05)] transition-all"><Twitter size={18} /></a>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function HeroSection({ content, loading }: { content?: Record<string, string>; loading?: boolean }) {
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

            {(loading || !content) ? (
              <ContentSkeleton />
            ) : (
              <>
                <h1 className="font-display font-black uppercase leading-tight fade-up" style={{ animationDelay: "0.2s" }}>
                  {content?.headline ? parseHeadline(content.headline) : (
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
                  {content?.subtext ? parseSubtext(content.subtext) : (
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
              </>
            )}

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


function WhatWeDoSection({ content, loading }: { content?: Record<string, string>; loading?: boolean }) {
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
            {(loading || !content) ? (
              <Skeleton className="h-6 w-full opacity-20" />
            ) : (
              content.description || "We promote hackathons, workshops and pioneering events in quantum computing. Our mission is to deconstruct complex challenges and lead through innovation."
            )}
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


function MissionSection({ content, loading }: { content?: Record<string, string>; loading?: boolean }) {
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
                {(loading || !content) ? (
                  <ContentSkeleton />
                ) : content.text ? (
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
            <div className="section-divider" style={{ margin: "0.75rem auto" }} />
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
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
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
              <TeamMemberSkeleton key={i} />
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
                onClick={() => setSelectedMember(m)}
                className={cn("brand-card overflow-hidden group flex flex-col transition-all duration-700 cursor-pointer",
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
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-display text-xs uppercase tracking-[0.2em] border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">View Profile</span>
                  </div>
                </div>
                <div className="p-5 xl:p-6 flex flex-col gap-2 flex-1">
                  <h3 className="font-display font-bold text-white text-sm xl:text-base uppercase tracking-wider">{m.name}</h3>
                  <p className="text-xs xl:text-sm font-mono uppercase tracking-widest" style={{ color: "var(--brand-magenta)" }}>{m.role}</p>
                  <p className="text-xs xl:text-sm text-[var(--brand-text-muted)]">· {m.education}</p>
                  {m.bio && <p className="text-xs xl:text-sm text-[var(--brand-text-muted)] line-clamp-2 mt-1">{m.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMember && (
          <MemberDetailModal 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)} 
          />
        )}
      </div>
    </section>
  );
}

// ─── EVENTS ────────────────────────────────────────────────────────────────────
function EventsSection() {
  const [tab, setTab] = useState<"upcoming" | "past">("past");
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
          {(["past", "upcoming"] as const).map(t => (
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
            {[...Array(2)].map((_, i) => <EventSkeleton key={i} />)}
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
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    partnersService.getAll()
      .then(r => setPartners(r.data.data || []))
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="partners" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-dark-2)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-30" />
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--brand-purple) 0%, transparent 70%)" }} />
      
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("text-center mb-16 transition-all duration-700", inView ? "opacity-100" : "opacity-0")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Our Global Network</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Partners <span className="gradient-text">&amp; Institutions</span>
          </h2>
          <div className="section-divider" style={{ margin: "0.75rem auto" }} />
          <p className="text-[var(--brand-text-muted)] mt-5 max-w-2xl mx-auto text-base xl:text-lg">
            The collective's leadership and members represent a network of premier research institutions and industry partners across four continents.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xl:gap-5">
            {[...Array(10)].map((_, i) => <PartnerSkeleton key={i} />)}
          </div>
        ) : partners.length === 0 ? (
          <p className="text-center text-[var(--brand-text-muted)] text-sm">Partners will appear here once added via the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xl:gap-5">
            {partners.map((p, i) => (
              <a
                key={p._id}
                href={p.website || undefined}
                target={p.website ? "_blank" : undefined}
                rel={p.website ? "noopener noreferrer" : undefined}
                className={cn(
                  "group relative rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-all duration-500 min-h-[120px]",
                  p.website ? "cursor-pointer" : "cursor-default",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{
                  transitionDelay: `${0.05 + i * 0.04}s`,
                  background: "rgba(20,20,36,0.7)",
                  border: "1px solid rgba(139,47,201,0.15)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,47,201,0.5)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,47,201,0.08)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(139,47,201,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,47,201,0.15)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(20,20,36,0.7)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {p.logoUrl ? (
                  <img src={p.logoUrl} alt={p.name}
                    className="h-10 xl:h-12 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(139,47,201,0.2), rgba(204,0,204,0.15))", border: "1px solid rgba(139,47,201,0.2)" }}>
                    <Handshake size={18} className="text-[var(--brand-purple)] opacity-70" />
                  </div>
                )}
                <span className="font-display font-bold text-[11px] xl:text-xs text-white/80 uppercase tracking-wider leading-tight group-hover:text-white transition-colors">
                  {p.name}
                </span>
                {p.website && (
                  <ExternalLink size={10} className="absolute top-3 right-3 text-[var(--brand-text-muted)] opacity-0 group-hover:opacity-60 transition-opacity" />
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    achievementsService.getAll()
      .then(r => setAchievements(r.data.data || []))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  const getPlacementGradient = (placement: string) => {
    const l = placement.toLowerCase();
    if (l.includes("1st") || l.includes("first")) return "linear-gradient(135deg, #FFD700, #FFA000)";
    if (l.includes("2nd") || l.includes("second")) return "linear-gradient(135deg, #C0C0C0, #9E9E9E)";
    if (l.includes("3rd") || l.includes("third")) return "linear-gradient(135deg, #CD7F32, #8B4513)";
    return "linear-gradient(135deg, #8B2FC9, #CC00CC)";
  };



  return (
    <section id="achievements" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-dark-1)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-25" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("text-center mb-14 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Our Track Record</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Achievements <span className="gradient-text">& Awards</span>
          </h2>
          <div className="section-divider" style={{ margin: "0.75rem auto" }} />
          <p className="text-[var(--brand-text-muted)] mt-5 max-w-2xl mx-auto text-base xl:text-lg">
            Beerantum has secured top rankings in several high-profile global competitions.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {achievements.map((a, i) => (
              <div key={a._id}
                className={cn("brand-card overflow-hidden group transition-all duration-700 hover:-translate-y-1",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}
                style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="h-1.5" style={{ background: getPlacementGradient(a.placement) }} />
                <div className="p-6 xl:p-8 flex gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: getPlacementGradient(a.placement), boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white"
                        style={{ background: getPlacementGradient(a.placement) }}>
                        {a.placement}
                      </span>
                      <span className="text-xs text-[var(--brand-text-muted)]">{a.year}</span>
                    </div>
                    <h3 className="font-display text-sm xl:text-base font-bold text-white uppercase tracking-wider">{a.title}</h3>
                    {a.description && (
                      <p className="text-xs xl:text-sm text-[var(--brand-text-muted)] mt-2 leading-relaxed">{a.description}</p>
                    )}
                    {a.competitionUrl && (
                      <a href={a.competitionUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--brand-magenta)] hover:text-white mt-3 transition-colors">
                        Learn more <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


// ─── ADVISORS ────────────────────────────────────────────────────────────────
function AdvisorsSection() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    advisorsService.getAll()
      .then(r => setAdvisors(r.data.data || []))
      .catch(() => setAdvisors([]))
      .finally(() => setLoading(false));
  }, []);



  return (
    <section id="advisors" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-dark-1)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-20" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Expert Guidance</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Our <span className="gradient-text">Advisors</span>
          </h2>
          <div className="section-divider" />
          <p className="text-[var(--brand-text-muted)] mt-5 max-w-2xl text-base xl:text-lg">
            Distinguished researchers and industry leaders guiding our quantum journey.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {advisors.map((a, i) => (
              <div key={a._id}
                onClick={() => setSelectedAdvisor(a)}
                className={cn("brand-card overflow-hidden group flex flex-col transition-all duration-700 cursor-pointer",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}
                style={{ transitionDelay: `${0.05 + i * 0.06}s` }}>
                <div className="relative overflow-hidden" style={{ height: "clamp(160px,18vw,220px)" }}>
                  {a.photoUrl ? (
                    <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="photo-placeholder w-full h-full text-xl xl:text-2xl">{getInitials(a.name)}</div>
                  )}
                  <div className="absolute top-3 left-3 text-white text-[10px] font-display font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: "linear-gradient(to right,#059669,#10B981)" }}>Advisor</div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-display text-xs uppercase tracking-[0.2em] border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">View Profile</span>
                  </div>
                </div>
                <div className="p-5 xl:p-6 flex flex-col gap-2 flex-1">
                  <h3 className="font-display font-bold text-white text-sm xl:text-base uppercase tracking-wider">{a.name}</h3>
                  {a.title && <p className="text-xs xl:text-sm font-mono uppercase tracking-widest" style={{ color: "#10B981" }}>{a.title}</p>}
                  {a.affiliation && <p className="text-xs xl:text-sm text-[var(--brand-text-muted)]">· {a.affiliation}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advisor Detail Modal */}
      {selectedAdvisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedAdvisor(null)}>
          <div className="glass-modal w-full max-w-md rounded-2xl modal-enter overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative p-6" style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.15), rgba(16,185,129,0.05))" }}>
              <button onClick={() => setSelectedAdvisor(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--brand-text-muted)] hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
              <div className="flex items-center gap-4">
                {selectedAdvisor.photoUrl ? (
                  <img src={selectedAdvisor.photoUrl} alt={selectedAdvisor.name} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-display font-bold" style={{ background: "linear-gradient(135deg,#059669,#10B981)" }}>{getInitials(selectedAdvisor.name)}</div>
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">{selectedAdvisor.name}</h3>
                  {selectedAdvisor.title && <p className="text-sm font-mono uppercase tracking-widest" style={{ color: "#10B981" }}>{selectedAdvisor.title}</p>}
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {selectedAdvisor.affiliation && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--brand-text-muted)] flex items-center gap-1.5 mb-1"><GraduationCap size={12} /> Affiliation</p>
                  <p className="text-sm text-[var(--brand-text)]">{selectedAdvisor.affiliation}</p>
                </div>
              )}
              {selectedAdvisor.bio && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--brand-text-muted)] flex items-center gap-1.5 mb-1"><FileText size={12} /> Biography</p>
                  <p className="text-sm text-[var(--brand-text)] leading-relaxed">{selectedAdvisor.bio}</p>
                </div>
              )}
              {(selectedAdvisor.socialLinks?.linkedin || selectedAdvisor.socialLinks?.github || selectedAdvisor.socialLinks?.twitter || selectedAdvisor.website) && (
                <div className="flex gap-3 pt-2">
                  {selectedAdvisor.socialLinks?.linkedin && <a href={selectedAdvisor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--brand-text-muted)] hover:text-white hover:bg-white/10 transition-all"><Linkedin size={16} /></a>}
                  {selectedAdvisor.socialLinks?.github && <a href={selectedAdvisor.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--brand-text-muted)] hover:text-white hover:bg-white/10 transition-all"><Github size={16} /></a>}
                  {selectedAdvisor.socialLinks?.twitter && <a href={selectedAdvisor.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--brand-text-muted)] hover:text-white hover:bg-white/10 transition-all"><Twitter size={16} /></a>}
                  {selectedAdvisor.website && <a href={selectedAdvisor.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--brand-text-muted)] hover:text-white hover:bg-white/10 transition-all"><Globe size={16} /></a>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


// ─── PUBLICATIONS ────────────────────────────────────────────────────────────
function PublicationsSection() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    publicationsService.getAll()
      .then(r => setPublications(r.data.data || []))
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);



  return (
    <section id="publications" className="w-full py-24 md:py-32 xl:py-36 relative overflow-hidden"
      style={{ background: "var(--brand-black)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 w-full h-full grid-bg opacity-20" />
      <div ref={ref} className="page-container relative z-10">
        <div className={cn("text-center mb-14 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <span className="font-mono text-xs text-[var(--brand-text-muted)] uppercase tracking-[0.25em]">Research Output</span>
          <h2 className="section-title text-3xl md:text-4xl xl:text-5xl text-white mt-3">
            Our <span className="gradient-text">Publications</span>
          </h2>
          <div className="section-divider" style={{ margin: "0.75rem auto" }} />
          <p className="text-[var(--brand-text-muted)] mt-5 max-w-2xl mx-auto text-base xl:text-lg">
            Peer-reviewed research and technical contributions from the Beerantum collective.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-5 max-w-4xl mx-auto">
            {publications.map((p, i) => (
              <div key={p._id}
                className={cn("brand-card p-6 xl:p-8 group transition-all duration-700 hover:-translate-y-0.5",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}
                style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg, rgba(139,47,201,0.15), rgba(204,0,204,0.1))", border: "1px solid rgba(139,47,201,0.2)" }}>
                    <BookOpen size={20} className="text-[var(--brand-purple)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm xl:text-base font-bold text-white tracking-wide leading-snug">{p.title}</h3>
                    {p.authors.length > 0 && (
                      <p className="text-xs text-[var(--brand-text-muted)] mt-1.5">{p.authors.join(", ")}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      {p.publishedIn && <span className="text-xs font-mono text-[var(--brand-magenta)]">{p.publishedIn}</span>}
                      <span className="text-xs text-[var(--brand-text-muted)]">{p.year}</span>
                      {p.doi && <span className="text-[10px] text-[var(--brand-text-muted)] font-mono">DOI: {p.doi}</span>}
                    </div>
                    {p.abstract && (
                      <p className="text-xs text-[var(--brand-text-muted)] mt-3 leading-relaxed line-clamp-2">{p.abstract}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {p.tags.slice(0, 4).map(t => (
                            <span key={t} className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full text-[var(--brand-purple)]"
                              style={{ background: "rgba(139,47,201,0.1)", border: "1px solid rgba(139,47,201,0.2)" }}>{t}</span>
                          ))}
                        </div>
                      )}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--brand-magenta)] hover:text-white transition-colors flex-shrink-0">
                          Read Paper <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
          <div className="section-divider" style={{ margin: "0.75rem auto" }} />
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService.getAll().then(r => {
      setContent((r.data.data || {}) as Record<string, Record<string, string>>);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main className="w-full">
        <HeroSection content={content.hero} loading={loading} />
        <WhatWeDoSection content={content.whatWeDo} loading={loading} />
        <MissionSection content={content.mission} loading={loading} />
        <TeamSection />
        <AdvisorsSection />
        <EventsSection />
        <AchievementsSection />
        <PartnersSection />
        <PublicationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
