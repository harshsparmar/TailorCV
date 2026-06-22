"use client";

import { useState, useRef, useCallback } from "react";
import type { ResumeData } from "@/types/resume";
import {
  Upload, FileText, X, AlertCircle, Loader2,
  Download, RotateCcw, Star, StarOff, LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  uploadedResume: ResumeData | null;
  uploadedFileName: string | null;
  onUpload: (resume: ResumeData, fileName: string) => void;
  onReset: () => void;
  isLoggedIn: boolean;
  isDefault: boolean;
  isSavingDefault: boolean;
  onSetDefault: () => void;
  onClearDefault: () => void;
}

type UploadState = "idle" | "parsing" | "error";

export function ResumeUpload({
  uploadedResume, uploadedFileName, onUpload, onReset,
  isLoggedIn, isDefault, isSavingDefault, onSetDefault, onClearDefault,
}: Props) {
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setState("parsing");

    if (file.name.endsWith(".json") || file.type === "application/json") {
      try {
        const text = await file.text();
        const data = JSON.parse(text) as ResumeData;
        if (!data.personalInfo || !data.experience) {
          throw new Error("Invalid resume JSON — missing required fields.");
        }
        setState("idle");
        onUpload(data, file.name);
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "Invalid JSON file.");
      }
      return;
    }

    if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to parse resume.");
        setState("idle");
        onUpload(data.resume as ResumeData, file.name);
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "Failed to upload resume.");
      }
      return;
    }

    setState("error");
    setError("Unsupported file type. Please upload a PDF or JSON file.");
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDownloadJSON = () => {
    if (!uploadedResume) return;
    const blob = new Blob([JSON.stringify(uploadedResume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isParsing = state === "parsing";
  const fileName = uploadedFileName ?? "resume";

  // ── Resume loaded ─────────────────────────────────────────────────────────
  if (uploadedResume) {
    return (
      <div className="flex flex-col gap-2">
        <div className={cn(
          "p-3.5 rounded-xl border",
          isDefault
            ? "bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/40"
            : "bg-stone-50 dark:bg-stone-800/30 border-stone-200 dark:border-white/[0.08]"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              isDefault
                ? "bg-violet-600"
                : "bg-stone-800 dark:bg-stone-600"
            )}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                {isDefault ? "Default Resume" : "Resume Loaded"}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{fileName}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleDownloadJSON}
                title="Download as JSON"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onReset}
                title={isDefault ? "Remove for this session (default stays saved)" : "Remove resume"}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action row — logged in */}
        {isLoggedIn && (
          <div className="flex gap-1.5 mt-1">
            {isDefault ? (
              <button
                onClick={onClearDefault}
                className="flex-1 py-1.5 text-[11px] font-medium text-red-500 hover:text-red-600 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors flex items-center justify-center gap-1"
              >
                <StarOff className="w-3 h-3" />
                Remove default
              </button>
            ) : (
              <button
                onClick={onSetDefault}
                disabled={isSavingDefault}
                className="flex-1 py-1.5 text-[11px] font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/60 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-full transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isSavingDefault ? <Loader2 className="w-3 h-3 animate-spin" /> : <Star className="w-3 h-3" />}
                {isSavingDefault ? "Saving…" : "Set as default"}
              </button>
            )}
            <button
              onClick={() => replaceInputRef.current?.click()}
              className="flex-1 py-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-white/[0.08] hover:bg-stone-50 dark:hover:bg-white/[0.04] rounded-full transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Replace
            </button>
          </div>
        )}

        {/* Replace — not logged in */}
        {!isLoggedIn && (
          <button
            onClick={() => replaceInputRef.current?.click()}
            className="w-full text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center gap-1 py-1 rounded hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Replace with another file
          </button>
        )}

        <input
          ref={replaceInputRef}
          type="file"
          accept=".pdf,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  // ── No resume yet ──────────────────────────────────────────────────────────
  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isParsing && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center gap-2 py-5 px-4 rounded-xl border-2 border-dashed transition-colors group",
          isParsing
            ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/20 cursor-default"
            : isDragging
            ? "border-violet-300 dark:border-violet-500/40 bg-violet-50/50 dark:bg-violet-950/10 cursor-copy"
            : "border-stone-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-500/40 cursor-pointer"
        )}
      >
        {isParsing ? (
          <>
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            <p className="text-xs font-medium text-violet-600 dark:text-violet-400">Parsing resume with AI…</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-600">This takes about 10–20 seconds</p>
          </>
        ) : (
          <>
            <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-white/[0.05] border border-stone-200 dark:border-white/[0.07] flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 group-hover:border-violet-200 dark:group-hover:border-violet-500/20 transition-colors">
              <Upload className="w-5 h-5 text-stone-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Drop your resume here</p>
              <p className="text-xs text-stone-400 dark:text-stone-600 mt-0.5">PDF or JSON · click to browse</p>
            </div>
          </>
        )}
      </div>

      {state === "error" && error && (
        <div className="mt-2 flex items-start gap-1.5 p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!isLoggedIn && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-600">
          <LogIn className="w-3 h-3 flex-shrink-0" />
          Sign in to save a default resume across sessions
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
