"use client";

import { Target, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn, getScoreColor, getScoreLabel } from "@/lib/utils";
import type { ResumeGenerationResult } from "@/types/resume";

interface Props {
  result: ResumeGenerationResult;
}

export function ATSScoreCard({ result }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const improvement = result.atsScore - result.originalScore;

  const barGradient =
    result.atsScore >= 80
      ? "linear-gradient(to right, #10b981, #22c55e)"
      : result.atsScore >= 60
      ? "linear-gradient(to right, #f59e0b, #fbbf24)"
      : "linear-gradient(to right, #ef4444, #f87171)";

  return (
    <div className="flex flex-col gap-4">
      {/* Score block */}
      <div className="py-4 px-1">
        <div className="flex items-end gap-3 mb-3">
          <div>
            <span className="text-6xl font-black tabular-nums text-stone-900 dark:text-white leading-none">
              {result.atsScore}
            </span>
            <span className="text-sm text-stone-400 dark:text-stone-500 ml-1.5 font-normal">/ 100</span>
          </div>
          <div className="pb-1 flex flex-col">
            <span className={cn("text-sm font-bold", getScoreColor(result.atsScore))}>
              {getScoreLabel(result.atsScore)}
            </span>
            <span className="text-xs text-emerald-500 font-semibold tabular-nums">
              ↑ +{improvement} pts
            </span>
          </div>
        </div>

        <div className="h-1 bg-stone-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${result.atsScore}%`, background: barGradient }}
          />
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-stone-500 dark:text-stone-500">
          <span>
            Before:{" "}
            <span className={cn("font-semibold tabular-nums", getScoreColor(result.originalScore))}>
              {result.originalScore}
            </span>
          </span>
          <span className="text-stone-300 dark:text-white/10">→</span>
          <span>
            After:{" "}
            <span className={cn("font-semibold tabular-nums", getScoreColor(result.atsScore))}>
              {result.atsScore}
            </span>
          </span>
        </div>
      </div>

      {/* Added keywords */}
      {result.addedKeywords.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.12em] uppercase text-stone-400 dark:text-stone-500 mb-2">
            <Target className="w-3 h-3" />
            Added keywords
          </p>
          <div className="flex flex-wrap gap-1">
            {result.addedKeywords.slice(0, 14).map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 text-[11px] font-medium bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 rounded-lg"
              >
                {kw}
              </span>
            ))}
            {result.addedKeywords.length > 14 && (
              <span className="px-2 py-0.5 text-[11px] text-stone-400 dark:text-stone-600">
                +{result.addedKeywords.length - 14} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Collapsibles */}
      {result.extractedRequirements.technologies.length > 0 && (
        <Collapsible
          label="Job Requirements"
          open={showRequirements}
          onToggle={() => setShowRequirements(!showRequirements)}
        >
          <div className="flex flex-col gap-2">
            {result.extractedRequirements.technologies.length > 0 && (
              <TagGroup label="Tech" tags={result.extractedRequirements.technologies.slice(0, 10)} />
            )}
            {result.extractedRequirements.skills.length > 0 && (
              <TagGroup label="Skills" tags={result.extractedRequirements.skills.slice(0, 8)} />
            )}
          </div>
        </Collapsible>
      )}

      {result.suggestions.length > 0 && (
        <Collapsible
          label={`Suggestions (${result.suggestions.length})`}
          icon={<Lightbulb className="w-3 h-3 text-amber-500" />}
          open={showSuggestions}
          onToggle={() => setShowSuggestions(!showSuggestions)}
        >
          <ul className="flex flex-col gap-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0 text-xs">•</span>
                <span className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </Collapsible>
      )}
    </div>
  );
}

function Collapsible({
  label, icon, open, onToggle, children,
}: {
  label: string;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-stone-100 dark:border-white/[0.07] rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        }
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-stone-100 dark:border-white/[0.07]">
          {children}
        </div>
      )}
    </div>
  );
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div>
      <p className="text-[10px] text-stone-400 dark:text-stone-600 mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 text-[11px] bg-stone-100 dark:bg-white/[0.05] text-stone-600 dark:text-stone-400 rounded"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
