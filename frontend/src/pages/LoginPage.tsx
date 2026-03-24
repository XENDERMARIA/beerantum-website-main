
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, ArrowLeft, RefreshCw, CheckCircle2, Clock, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage, cn } from "@/utils";
import api from "@/services/api";


declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: unknown) => void;
          renderButton: (el: HTMLElement | null, cfg: unknown) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type OTPStep = "email" | "otp" | "pending";
type LoginMode = "google-otp" | "password";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [mode, setMode] = useState<LoginMode>("google-otp");
  const [otpStep, setOtpStep] = useState<OTPStep>("email");
  const [otpEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [pendingInfo, setPendingInfo] = useState<{ name: string; email: string } | null>(null);

  
  useEffect(() => {
    if (isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, navigate]);

  
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  
  const handleGoogleCredential = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      try {
        const res = await api.post("/auth/google", { credential: response.credential });
        const { user, accessToken, refreshToken } = res.data.data;
        setAuth(user, accessToken, refreshToken);
        toast.success(`Welcome, ${user.name}!`);
        navigate("/admin");
      } catch (err: unknown) {
        const axErr = err as { response?: { data?: { code?: string; message?: string; user?: { name: string; email: string } } } };
        const code = axErr.response?.data?.code;
        if (code === "PENDING_APPROVAL") {
          const u = axErr.response?.data?.user;
          setPendingInfo(u || { name: "", email: "" });
          setOtpStep("pending");
        } else {
          toast.error(axErr.response?.data?.message || getErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    },
    [setAuth, navigate]
  );

  useEffect(() => {
    if (mode !== "google-otp") return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const scriptId = "google-gsi";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = () => initGoogle();
      document.head.appendChild(s);
    } else if (window.google) {
      initGoogle();
    }

    function initGoogle() {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
        auto_select: false,
      });
      window.google?.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
          theme: "filled_black",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        }
      );
    }
  }, [mode, handleGoogleCredential]);

  
  const {
    register: regEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>();

  const onSendOTP = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email, purpose: "login" });
      setOtpEmail(email);
      setOtpStep("otp");
      setOtpCooldown(60);
      toast.success(`Code sent to ${email}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  
  const {
    register: regOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    setFocus,
  } = useForm<{ otp: string }>();

  useEffect(() => {
    if (otpStep === "otp") setTimeout(() => setFocus("otp"), 100);
  }, [otpStep, setFocus]);

  const onVerifyOTP = async ({ otp }: { otp: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email: otpEmail, otp, purpose: "login" });
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome, ${user.name}!`);
      navigate("/admin");
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { code?: string; message?: string } } };
      const code = axErr.response?.data?.code;
      if (code === "PENDING_APPROVAL") {
        setOtpStep("pending");
        setPendingInfo({ name: "", email: otpEmail });
      } else {
        toast.error(axErr.response?.data?.message || getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  
  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    formState: { errors: passErrors },
  } = useForm<{ email: string; password: string }>();
  const [showPass, setShowPass] = useState(false);

  const onPasswordLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome, ${user.name}!`);
      navigate("/admin");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  
  const resendOTP = async () => {
    if (otpCooldown > 0) return;
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: otpEmail, purpose: "login" });
      setOtpCooldown(60);
      toast.success("New code sent!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--brand-black)" }}>
      {}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%,rgba(139,47,201,0.08) 0%,transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-md">
        {}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-4">
            <img src="/images/BeerantumLogo.png" alt="Beerantum" className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">Admin Panel</h1>
          <p className="text-sm text-[var(--brand-text-muted)] mt-2">Sign in to manage the website</p>
        </div>

        <div className="brand-card overflow-hidden">
          {}
          {otpStep === "pending" && (
            <div className="p-8 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(139,47,201,0.15)", border: "1px solid rgba(139,47,201,0.3)" }}>
                <Clock size={28} className="text-[var(--brand-purple)]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2">Awaiting Approval</h2>
                <p className="text-sm text-[var(--brand-text-muted)] leading-relaxed">
                  {pendingInfo?.name && <><span className="text-white font-semibold">{pendingInfo.name}</span><br /></>}
                  Your account has been created. The admin will review your request and send you an email once you're approved.
                </p>
              </div>
              <div className="w-full p-4 rounded-xl text-xs text-[var(--brand-text-muted)]"
                style={{ background: "rgba(139,47,201,0.06)", border: "1px solid rgba(139,47,201,0.15)" }}>
                📧 You'll receive an email at <strong className="text-[var(--brand-text)]">{pendingInfo?.email}</strong> once the admin grants you access.
              </div>
              <button onClick={() => { setOtpStep("email"); setPendingInfo(null); }}
                className="btn-outline text-xs py-2 px-6 mt-2">
                <ArrowLeft size={12} /> Back to Login
              </button>
            </div>
          )}

          {}
          {otpStep !== "pending" && mode === "google-otp" && (
            <div className="p-8 flex flex-col gap-6">
              {}
              <div>
                <div id="google-btn" className="w-full min-h-[44px]" />
                {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                  <div className="text-center text-xs text-[var(--brand-text-muted)] py-3 border border-dashed border-[rgba(139,47,201,0.2)] rounded-lg mt-2">
                    Google OAuth not configured.<br />Add <code className="text-[var(--brand-purple)]">VITE_GOOGLE_CLIENT_ID</code> to <code>.env</code>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px" style={{ background: "rgba(139,47,201,0.2)" }} />
                <span className="text-xs text-[var(--brand-text-muted)] font-mono uppercase tracking-widest">or use email</span>
                <div className="flex-1 h-px" style={{ background: "rgba(139,47,201,0.2)" }} />
              </div>

              {}
              {otpStep === "email" && (
                <form onSubmit={handleEmailSubmit(onSendOTP)} className="flex flex-col gap-4" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
                      <input
                        {...regEmail("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Valid email required" } })}
                        type="email" placeholder="your@email.com"
                        className={cn("brand-input pl-9", emailErrors.email && "error")}
                      />
                    </div>
                    {emailErrors.email && <p className="text-xs text-red-400">⚠ {emailErrors.email.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary justify-center">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending code...</> : "Send Verification Code"}
                  </button>
                </form>
              )}

              {}
              {otpStep === "otp" && (
                <form onSubmit={handleOtpSubmit(onVerifyOTP)} className="flex flex-col gap-4" noValidate>
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(139,47,201,0.06)", border: "1px solid rgba(139,47,201,0.15)" }}>
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--brand-text)]">Code sent to <strong>{otpEmail}</strong></p>
                      <p className="text-[10px] text-[var(--brand-text-muted)] mt-0.5">Check your inbox and spam folder</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">6-Digit Code</label>
                    <input
                      {...regOtp("otp", { required: "Code is required", minLength: { value: 6, message: "Enter all 6 digits" }, maxLength: { value: 6, message: "Max 6 digits" }, pattern: { value: /^\d{6}$/, message: "Numbers only" } })}
                      type="text" inputMode="numeric" maxLength={6}
                      placeholder="000000"
                      className={cn("brand-input text-center text-2xl tracking-[0.5em] font-mono", otpErrors.otp && "error")}
                    />
                    {otpErrors.otp && <p className="text-xs text-red-400 text-center">⚠ {otpErrors.otp.message}</p>}
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary justify-center">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</> : "Verify & Sign In"}
                  </button>

                  <div className="flex items-center justify-between text-xs">
                    <button type="button" onClick={() => setOtpStep("email")}
                      className="flex items-center gap-1 text-[var(--brand-text-muted)] hover:text-white transition-colors">
                      <ArrowLeft size={12} /> Change email
                    </button>
                    <button type="button" onClick={resendOTP} disabled={otpCooldown > 0 || loading}
                      className={cn("flex items-center gap-1 transition-colors",
                        otpCooldown > 0 ? "text-[var(--brand-text-muted)] cursor-not-allowed" : "text-[var(--brand-purple)] hover:text-[var(--brand-magenta)]")}>
                      <RefreshCw size={12} />
                      {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Resend code"}
                    </button>
                  </div>
                </form>
              )}

              {}
              <p className="text-center text-xs text-[var(--brand-text-muted)]">
                Super-admin?{" "}
                <button onClick={() => setMode("password")}
                  className="text-[var(--brand-purple)] hover:text-[var(--brand-magenta)] transition-colors">
                  Use password instead
                </button>
              </p>
            </div>
          )}

          {}
          {otpStep !== "pending" && mode === "password" && (
            <div className="p-8 flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setMode("google-otp")}
                  className="text-[var(--brand-text-muted)] hover:text-white transition-colors p-1">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">Password Login</h2>
                  <p className="text-xs text-[var(--brand-text-muted)]">For super-admin accounts only</p>
                </div>
              </div>

              <form onSubmit={handlePassSubmit(onPasswordLogin)} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
                    <input {...regPass("email", { required: "Email required" })} type="email"
                      placeholder="admin@beerantum.com"
                      className={cn("brand-input pl-9", passErrors.email && "error")} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--brand-text-muted)]">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
                    <input {...regPass("password", { required: "Password required" })} type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn("brand-input pl-9 pr-10", passErrors.password && "error")} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)] hover:text-white transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary justify-center">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : "Sign In"}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[var(--brand-text-muted)] mt-6">
          <Link to="/" className="hover:text-[var(--brand-magenta)] transition-colors">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}