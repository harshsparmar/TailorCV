"use client";

import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onGenerate: (jd: string) => void;
  isLoading: boolean;
  hasResume: boolean;
}

const SAMPLE_JD = `Senior Software Engineer - Full Stack
Company: InnovateTech Solutions

We are seeking a talented Senior Software Engineer to join our growing engineering team. You will be responsible for designing, building, and maintaining high-performance web applications.

Requirements:
• 4+ years of experience with React, TypeScript, and Node.js
• Strong proficiency in cloud services (AWS or GCP)
• Experience with microservices architecture and RESTful API design
• Familiarity with containerization (Docker, Kubernetes)
• Database experience with PostgreSQL and Redis
• Strong understanding of CI/CD pipelines
• Experience with agile/scrum methodologies

Responsibilities:
• Lead development of scalable web applications serving millions of users
• Collaborate with cross-functional teams to define technical requirements
• Mentor junior engineers and conduct code reviews
• Design and implement distributed systems with high availability
• Optimize application performance and ensure security best practices

Nice to have:
• GraphQL experience
• Machine learning or AI integration experience
• Open source contributions`;

export function JobDescriptionInput({ onGenerate, isLoading, hasResume }: Props) {
  const [jd, setJd] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!hasResume) { setError("Upload your resume above first."); return; }
    const trimmed = jd.trim();
    if (!trimmed) { setError("Paste a job description first."); return; }
    if (trimmed.length < 50) { setError("Job description is too short — paste the full listing."); return; }
    setError("");
    onGenerate(trimmed);
  }

  const charCount = jd.length;
  const isNearLimit = charCount > 12000;
  const canSubmit = !isLoading && !!jd.trim() && hasResume;

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] uppercase text-stone-400 dark:text-stone-500">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600 flex-shrink-0" />
          Job Description
        </p>
        <button
          onClick={() => { setJd(SAMPLE_JD); setError(""); }}
          disabled={isLoading}
          className="text-[11px] text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 disabled:opacity-40 transition-colors"
        >
          Try sample
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        <textarea
          value={jd}
          onChange={(e) => { setJd(e.target.value); if (error) setError(""); }}
          placeholder={"Paste the job description here…\n\nInclude the title, required skills,\nresponsibilities, and experience level."}
          disabled={isLoading}
          maxLength={15000}
          className={cn(
            "w-full h-full min-h-[120px] p-3 rounded-xl resize-none text-sm leading-relaxed transition-colors",
            "text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600",
            "bg-stone-50 dark:bg-stone-900/50 border focus:outline-none focus:ring-2",
            error
              ? "border-red-300 dark:border-red-700 focus:ring-red-500/20"
              : "border-stone-200 dark:border-white/[0.08] focus:ring-violet-500/20 focus:border-violet-400 dark:focus:border-violet-500",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        />
        {jd && !isLoading && (
          <button
            onClick={() => { setJd(""); setError(""); }}
            className="absolute top-2.5 right-2.5 p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        ) : (
          <span />
        )}
        <span className={cn("text-[11px] tabular-nums", isNearLimit ? "text-amber-500" : "text-stone-400 dark:text-stone-600")}>
          {charCount.toLocaleString()} / 15000
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          "w-full py-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2",
          canSubmit
            ? "bg-stone-900 dark:bg-white hover:bg-stone-700 dark:hover:bg-stone-100 text-white dark:text-stone-900"
            : "bg-stone-100 dark:bg-white/[0.05] text-stone-400 dark:text-stone-600 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Tailoring your resume…
          </>
        ) : (
          "Tailor CV →"
        )}
      </button>
    </div>
  );
}
