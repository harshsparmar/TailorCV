"use client";

import { useState } from "react";
import { X, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface Props {
  onClose: () => void;
}

type Tab = "signin" | "signup";

export function AuthModal({ onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === "signin") {
      const { error } = await signIn(email, password);
      error ? setError(error) : onClose();
    } else {
      const { error, needsVerification } = await signUp(email, password);
      if (error) setError(error);
      else if (needsVerification) setVerificationSent(true);
      else onClose();
    }

    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/[0.08] rounded-2xl shadow-warm-lg w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-stone-100 dark:border-white/[0.06]">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white">
            {verificationSent ? "Check your email" : tab === "signin" ? "Sign in to TailorCV" : "Create an account"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          {verificationSent ? (
            <div className="flex flex-col items-center gap-3 py-3 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-white mb-1">
                  Confirmation email sent
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Click the link sent to{" "}
                  <span className="font-medium text-stone-700 dark:text-stone-300">{email}</span>{" "}
                  to activate your account.
                </p>
              </div>
              <button
                onClick={() => { setTab("signin"); setVerificationSent(false); }}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex bg-stone-100 dark:bg-white/[0.05] rounded-lg p-0.5 mb-5">
                {(["signin", "signup"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(null); }}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-xs font-medium transition-all",
                      tab === t
                        ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-warm"
                        : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                    )}
                  >
                    {t === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                  <input
                    type="email" required placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/[0.03] text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                  <input
                    type="password" required minLength={6}
                    placeholder={tab === "signup" ? "Password (min. 6 chars)" : "Password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/[0.03] text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-stone-900 dark:bg-white hover:bg-stone-700 dark:hover:bg-stone-100 text-white dark:text-stone-900 text-sm font-semibold transition-colors disabled:opacity-60 mt-1"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {tab === "signin" ? "Sign in" : "Create account"}
                </button>
              </form>

              {tab === "signup" && (
                <p className="text-[11px] text-stone-400 dark:text-stone-600 text-center mt-4">
                  Your resume history syncs across devices when signed in.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
