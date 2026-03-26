import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { cn } from "@/utils";
 
interface ImageUploadProps {
  value?: string;                    // current image URL
  onChange: (url: string) => void;   // called with new URL after upload
  folder?: string;                   // cloudinary folder: "team" | "events" | "partners"
  label?: string;
  previewShape?: "square" | "circle";
  className?: string;
}
 
type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";
 
export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Image",
  previewShape = "square",
  className,
}: ImageUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const uploadFile = useCallback(
    async (file: File) => {
      // Validate type
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed (JPG, PNG, WebP)");
        return;
      }
      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
 
      setState("uploading");
      setProgress(0);
 
      const formData = new FormData();
      formData.append("image", file);
 
      try {
        // Simulate progress (real progress needs XHR, axios doesn't support it easily)
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 15, 85));
        }, 200);
 
        const res = await api.post<{ success: boolean; data: { url: string } }>(
          `/upload?folder=${folder}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
 
        clearInterval(progressInterval);
        setProgress(100);
 
        onChange(res.data.data.url);
        setState("success");
        toast.success("Image uploaded!");
 
        // Reset to idle after 2 seconds
        setTimeout(() => setState("idle"), 2000);
      } catch (err) {
        setState("error");
        toast.error("Upload failed. Please try again.");
        setTimeout(() => setState("idle"), 2000);
      }
    },
    [folder, onChange]
  );
 
  // Drag events
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  };
  const onDragLeave = () => {
    if (state === "dragging") setState("idle");
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };
 
  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setState("idle");
  };
 
  const isUploading = state === "uploading";
 
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-xs font-semibold text-[var(--brand-text)]">{label}</label>
      )}
 
      <div className="flex items-start gap-4">
        {/* ── Drop zone ── */}
        <div
          className={cn(
            "relative flex-1 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group",
            state === "dragging"
              ? "border-[var(--brand-magenta)] bg-[rgba(204,0,204,0.08)] scale-[1.01]"
              : state === "success"
              ? "border-green-500 bg-[rgba(34,197,94,0.06)]"
              : state === "error"
              ? "border-red-500 bg-[rgba(239,68,68,0.06)]"
              : "border-[rgba(139,47,201,0.3)] hover:border-[rgba(139,47,201,0.6)] hover:bg-[rgba(139,47,201,0.04)]"
          )}
          style={{ minHeight: "100px" }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
 
          <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
            {isUploading ? (
              <>
                <Loader2 size={24} className="text-[var(--brand-purple)] animate-spin" />
                <p className="text-xs text-[var(--brand-text-muted)]">Uploading... {progress}%</p>
                {/* Progress bar */}
                <div className="w-full max-w-[160px] h-1.5 rounded-full bg-[rgba(139,47,201,0.2)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg,#8B2FC9,#CC00CC)",
                    }}
                  />
                </div>
              </>
            ) : state === "success" ? (
              <>
                <CheckCircle2 size={24} className="text-green-400" />
                <p className="text-xs text-green-400">Uploaded!</p>
              </>
            ) : state === "error" ? (
              <>
                <X size={24} className="text-red-400" />
                <p className="text-xs text-red-400">Failed — try again</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: "rgba(139,47,201,0.12)", border: "1px solid rgba(139,47,201,0.2)" }}>
                  <Upload size={18} className="text-[var(--brand-purple)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-text)]">
                    {state === "dragging" ? "Drop it here!" : "Drag & drop or click"}
                  </p>
                  <p className="text-xs text-[var(--brand-text-muted)] mt-0.5">
                    JPG, PNG, WebP — max 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
 
        {/* ── Preview ── */}
        {value && (
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "overflow-hidden border border-[rgba(139,47,201,0.3)]",
                previewShape === "circle" ? "rounded-full" : "rounded-xl"
              )}
              style={{ width: 80, height: 80 }}
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%231A1A2E' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='%238B2FC9' text-anchor='middle' dy='.3em' font-size='24'%3E?%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            {/* Clear button */}
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={10} />
            </button>
          </div>
        )}
 
        {/* ── Empty placeholder when no image ── */}
        {!value && (
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center border border-dashed border-[rgba(139,47,201,0.2)]",
              previewShape === "circle" ? "rounded-full" : "rounded-xl"
            )}
            style={{ width: 80, height: 80 }}
          >
            <ImageIcon size={20} className="text-[rgba(139,47,201,0.3)]" />
          </div>
        )}
      </div>
 
      {/* Current URL (small, for reference) */}
      {value && (
        <p className="text-[10px] text-[var(--brand-text-muted)] truncate font-mono">
          ✓ {value.split("/").slice(-2).join("/")}
        </p>
      )}
    </div>
  );
}
 