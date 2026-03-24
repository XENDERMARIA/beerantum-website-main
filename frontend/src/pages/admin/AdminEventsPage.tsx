
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Calendar, HelpCircle, MapPin, Tag, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { eventsService } from "@/services";
import { cn, formatDateRange, getErrorMessage } from "@/utils";
import type { Event } from "@/types";

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1.5" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <HelpCircle size={13} className="text-[var(--brand-text-muted)] cursor-help" />
      {show && (
        <span className="absolute left-5 top-0 z-50 w-60 text-xs bg-[#1A1A2E] border border-[rgba(139,47,201,0.3)] rounded-lg p-3 text-[var(--brand-text)] shadow-xl">
          {text}
        </span>
      )}
    </span>
  );
}


const AUDIENCE_OPTIONS = ["Students", "Researchers", "Beginners", "Advanced", "Professionals", "Everyone"];

const TAG_SUGGESTIONS = ["Hackathon", "Workshop", "Algorithms", "QML", "Qiskit", "VQE", "QAOA", "Error Correction", "Competition", "Talk", "Online", "In-Person"];

type FormData = {
  title: string;
  date: string;
  endDate: string;
  timeDisplay: string;
  location: string;
  description: string;
  status: "upcoming" | "past" | "ongoing";
  registrationUrl: string;
  imageUrl: string;
  maxAttendees: number;
};

function EventModal({ event, onClose, onSave }: { event?: Event; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!event;
  const [selectedAudience, setSelectedAudience] = useState<string[]>(event?.audience || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(event?.tags || []);
  const [customTag, setCustomTag] = useState("");

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      title: event?.title || "",
      date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      timeDisplay: event?.timeDisplay || "",
      location: event?.location || "",
      description: event?.description || "",
      status: event?.status || "upcoming",
      registrationUrl: event?.registrationUrl || "",
      imageUrl: event?.imageUrl || "",
      maxAttendees: event?.maxAttendees || (undefined as unknown as number),
    },
  });

  const toggleAudience = (a: string) =>
    setSelectedAudience(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const toggleTag = (t: string) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !selectedTags.includes(t)) { setSelectedTags(prev => [...prev, t]); }
    setCustomTag("");
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        audience: selectedAudience,
        tags: selectedTags,
        maxAttendees: data.maxAttendees || undefined,
      };
      if (isEdit) await eventsService.update(event!._id, payload);
      else await eventsService.create(payload as never);
      toast.success(isEdit ? "✅ Event updated!" : "✅ New event created!");
      onSave(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="brand-card w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {}
        <div className="sticky top-0 z-10 bg-[#141420] px-6 py-4 border-b border-[rgba(139,47,201,0.15)] flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
              {isEdit ? "✏️ Edit Event" : "➕ Create New Event"}
            </h2>
            <p className="text-xs text-[var(--brand-text-muted)] mt-0.5">Fields marked * are required</p>
          </div>
          <button onClick={onClose} className="text-[var(--brand-text-muted)] hover:text-white p-1"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-7" noValidate>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">1</span>
              Event Basics
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)]">Event Title *</label>
                <input {...register("title", { required: "Please enter the event title" })}
                  placeholder="e.g. Quantum Hackathon 2026"
                  className={cn("brand-input mt-1.5", errors.title && "error")} />
                {errors.title && <p className="text-xs text-red-400 mt-1">⚠ {errors.title.message}</p>}
              </div>

              {}
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Event Status *
                  <Tip text="'Upcoming' shows the Register button. 'Past' moves it to Past Events tab. Change this after the event is over." />
                </label>
                <div className="flex gap-3 mt-2">
                  {(["upcoming", "ongoing", "past"] as const).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group">
                      <input {...register("status")} type="radio" value={s} className="sr-only" />
                      <div className={cn(
                        "px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-widest transition-all",
                        watch("status") === s
                          ? "text-white border-transparent"
                          : "text-[var(--brand-text-muted)] border-[rgba(139,47,201,0.3)] hover:border-[var(--brand-magenta)]"
                      )}
                        style={watch("status") === s ? {
                          background: s === "upcoming" ? "linear-gradient(135deg,#8B2FC9,#CC00CC)" : s === "ongoing" ? "#166534" : "#374151"
                        } : {}}>
                        {s === "upcoming" ? "📅 Upcoming" : s === "ongoing" ? "🟢 Ongoing" : "✅ Past"}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">2</span>
              <Clock size={13} /> Date &amp; Time
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)]">Start Date &amp; Time *</label>
                <input {...register("date", { required: "Please pick a start date" })} type="datetime-local"
                  className={cn("brand-input mt-1.5", errors.date && "error")} />
                {errors.date && <p className="text-xs text-red-400 mt-1">⚠ {errors.date.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  End Date &amp; Time
                  <Tip text="Optional. Leave blank if it's a single-day event." />
                </label>
                <input {...register("endDate")} type="datetime-local" className="brand-input mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Time Display (shown on site)
                  <Tip text="A human-readable time string that shows on the event card. e.g. '9:00 AM – 6:00 PM'" />
                </label>
                <input {...register("timeDisplay")} placeholder="e.g. 9:00 AM – 6:00 PM"
                  className="brand-input mt-1.5" />
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">3</span>
              <MapPin size={13} /> Location &amp; Description
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)]">Location *</label>
                <input {...register("location", { required: "Please enter the location" })}
                  placeholder="e.g. MIT Campus, Cambridge, MA  OR  Virtual — Zoom"
                  className={cn("brand-input mt-1.5", errors.location && "error")} />
                {errors.location && <p className="text-xs text-red-400 mt-1">⚠ {errors.location.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)]">Description *</label>
                <textarea {...register("description", { required: "Please add a description" })} rows={4}
                  placeholder="Describe what this event is about, what participants will learn or do, who should attend..."
                  className={cn("brand-input resize-none mt-1.5", errors.description && "error")} maxLength={500} />
                <p className="text-[10px] text-[var(--brand-text-muted)] mt-1">Max 500 characters</p>
                {errors.description && <p className="text-xs text-red-400">⚠ {errors.description.message}</p>}
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">4</span>
              <Tag size={13} /> Audience &amp; Tags
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Who is this for?
                  <Tip text="Click to select/deselect. You can pick multiple. These appear on the event card." />
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AUDIENCE_OPTIONS.map(a => (
                    <button key={a} type="button" onClick={() => toggleAudience(a)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-all duration-150",
                        selectedAudience.includes(a)
                          ? "text-white border-transparent"
                          : "text-[var(--brand-text-muted)] border-[rgba(139,47,201,0.3)] hover:border-[var(--brand-magenta)]"
                      )}
                      style={selectedAudience.includes(a) ? { background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" } : {}}>
                      {selectedAudience.includes(a) ? "✓ " : ""}{a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Topic Tags
                  <Tip text="Tags show as small badges on the event card. Click suggestions or type your own." />
                </label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {TAG_SUGGESTIONS.map(t => (
                    <button key={t} type="button" onClick={() => toggleTag(t)}
                      className={cn(
                        "text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded border transition-all duration-150",
                        selectedTags.includes(t)
                          ? "text-white border-transparent"
                          : "text-[var(--brand-text-muted)] border-[rgba(139,47,201,0.3)] hover:border-[var(--brand-magenta)]"
                      )}
                      style={selectedTags.includes(t) ? { background: "rgba(139,47,201,0.6)" } : {}}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={customTag} onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
                    placeholder="Type a custom tag and press Enter"
                    className="brand-input flex-1 text-sm" />
                  <button type="button" onClick={addCustomTag} className="btn-outline text-xs px-4">Add</button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[10px] text-[var(--brand-text-muted)]">Selected:</span>
                    {selectedTags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded text-[var(--brand-purple)]"
                        style={{ background: "rgba(139,47,201,0.12)", border: "1px solid rgba(139,47,201,0.3)" }}>
                        {t}
                        <button type="button" onClick={() => toggleTag(t)} className="hover:text-red-400">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand-magenta)] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[rgba(204,0,204,0.15)] border border-[rgba(204,0,204,0.3)] flex items-center justify-center text-[10px] font-bold">5</span>
              Links &amp; Media <span className="text-[var(--brand-text-muted)] font-normal normal-case tracking-normal ml-1">(optional)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Registration Link
                  <Tip text="The link where people can register. Shows a 'Register Now' button on upcoming events." />
                </label>
                <input {...register("registrationUrl")} placeholder="https://forms.google.com/..." className="brand-input mt-1.5" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Event Image URL
                  <Tip text="A banner/thumbnail for the event card. Upload to imgur.com for a free link." />
                </label>
                <input {...register("imageUrl")} placeholder="https://i.imgur.com/..." className="brand-input mt-1.5" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--brand-text)] flex items-center">
                  Max Attendees
                  <Tip text="Optional. Just for your reference — doesn't auto-close registration." />
                </label>
                <input {...register("maxAttendees", { valueAsNumber: true })} type="number" min={1}
                  placeholder="e.g. 200"
                  className="brand-input mt-1.5" />
              </div>
            </div>
          </div>

          {}
          <div className="flex gap-3 pt-2 border-t border-[rgba(139,47,201,0.1)]">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                : <><Save size={15} />{isEdit ? "Save Changes" : "Create Event"}</>}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}


const STATUS: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: "rgba(139,47,201,0.15)", text: "var(--brand-magenta)", label: "📅 Upcoming" },
  ongoing: { bg: "rgba(22,101,52,0.2)", text: "#4ade80", label: "🟢 Ongoing" },
  past: { bg: "rgba(55,65,81,0.3)", text: "var(--brand-text-muted)", label: "✅ Past" },
};


export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | undefined>();
  const [filterTab, setFilterTab] = useState<"all" | "upcoming" | "past">("all");

  const fetchEvents = async () => {
    setLoading(true);
    try { const r = await eventsService.getAll(); setEvents(r.data.data || []); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try { await eventsService.remove(id); toast.success("Event deleted"); fetchEvents(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const filtered = filterTab === "all" ? events : events.filter(e => e.status === filterTab);

  return (
    <div className="max-w-4xl mx-auto">
      {}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Events</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary">
          <Plus size={15} />New Event
        </button>
      </div>

      {}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
        style={{ background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.18)" }}>
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-[var(--brand-text-muted)]">
          After an event ends, click ✏️ Edit and change its status to <strong className="text-[var(--brand-text)]">Past</strong> — it will move to the "Past Events" tab on the website automatically.
        </p>
      </div>

      {}
      <div className="flex gap-2 mb-6">
        {(["all", "upcoming", "past"] as const).map(t => (
          <button key={t} onClick={() => setFilterTab(t)}
            className={cn(
              "text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-lg border transition-all",
              filterTab === t
                ? "text-white border-transparent"
                : "text-[var(--brand-text-muted)] border-[rgba(139,47,201,0.3)] hover:border-[var(--brand-magenta)]"
            )}
            style={filterTab === t ? { background: "linear-gradient(135deg,#8B2FC9,#CC00CC)" } : {}}>
            {t === "all" ? `All (${events.length})` : t === "upcoming" ? `Upcoming (${events.filter(e => e.status === "upcoming").length})` : `Past (${events.filter(e => e.status === "past").length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "rgba(139,47,201,0.06)" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 brand-card">
          <Calendar size={52} className="mx-auto mb-4" style={{ color: "rgba(139,47,201,0.3)" }} />
          <p className="font-display text-base uppercase tracking-widest text-white mb-2">No events yet</p>
          <p className="text-sm text-[var(--brand-text-muted)] mb-6">Create your first event to show it on the website</p>
          <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary inline-flex">
            <Plus size={15} />Create First Event
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(event => {
            const s = STATUS[event.status] || STATUS.past;
            return (
              <div key={event._id} className="brand-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(139,47,201,0.12)", border: "1px solid rgba(139,47,201,0.2)" }}>
                  <Calendar size={18} style={{ color: "var(--brand-purple)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">{event.title}</h3>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: s.bg, color: s.text }}>{s.label}</span>
                  </div>
                  <p className="text-xs text-[var(--brand-text-muted)]">
                    📅 {formatDateRange(event.date, event.endDate)}
                    {event.location && <> &nbsp;·&nbsp; 📍 {event.location}</>}
                  </p>
                  <p className="text-xs text-[var(--brand-text-muted)] mt-1 line-clamp-1">{event.description}</p>
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {event.tags.slice(0, 5).map(t => (
                        <span key={t} className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
                          style={{ background: "rgba(139,47,201,0.1)", border: "1px solid rgba(139,47,201,0.25)", color: "var(--brand-purple)" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(event); setShowForm(true); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-[var(--brand-text-muted)] hover:text-[var(--brand-magenta)] hover:bg-[rgba(139,47,201,0.1)] transition-all border border-transparent hover:border-[rgba(139,47,201,0.2)]">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(event._id, event.title)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-[var(--brand-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <EventModal
          event={editing}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
          onSave={fetchEvents}
        />
      )}
    </div>
  );
}