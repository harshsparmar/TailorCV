"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initial = user.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-stone-300 dark:border-white/[0.12] hover:bg-stone-100 dark:hover:bg-white/[0.06] transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          {initial}
        </div>
        <ChevronDown className={cn("w-3 h-3 text-stone-400 transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-stone-900 rounded-xl shadow-warm-md border border-stone-200 dark:border-white/10 py-1.5 z-50 animate-fade-in">
          <div className="px-3 py-2.5 border-b border-stone-100 dark:border-white/[0.06] mb-1">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mb-1">
              <Cloud className="w-3 h-3" />
              Cloud sync on
            </div>
            <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
