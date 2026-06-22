"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F4F1EC]/90 dark:bg-[#0a0908]/90 backdrop-blur-sm border-b border-stone-200/70 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Wordmark */}
          <span className="text-sm font-semibold tracking-tight text-stone-900 dark:text-white select-none">
            Tailor<span className="text-violet-600 dark:text-violet-400">CV</span>
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-8 h-8 rounded-full border border-stone-300 dark:border-white/[0.12] flex items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            )}

            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-1.5 rounded-full bg-stone-900 dark:bg-white hover:bg-stone-700 dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold transition-colors"
                >
                  Sign in
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
