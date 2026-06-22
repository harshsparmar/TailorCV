"use client";

import { History, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn, formatDate, getScoreColor, getScoreBgColor } from "@/lib/utils";
import type { ResumeGenerationResult } from "@/types/resume";

interface Props {
  history: ResumeGenerationResult[];
  onSelect: (item: ResumeGenerationResult) => void;
  onClear: () => void;
  selectedId?: string;
}

export function HistoryPanel({ history, onSelect, onClear, selectedId }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-white/[0.07] overflow-hidden bg-white dark:bg-stone-900/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-stone-500 dark:text-stone-400">
            History
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-stone-100 dark:bg-white/10 text-stone-500 dark:text-stone-400 rounded tabular-nums">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
            : <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
          }
        </div>
      </button>

      {expanded && (
        <div className="divide-y divide-stone-100 dark:divide-white/[0.05] max-h-64 overflow-y-auto border-t border-stone-100 dark:border-white/[0.05]">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                "hover:bg-stone-50 dark:hover:bg-white/[0.02]",
                selectedId === item.id
                  ? "bg-violet-50 dark:bg-violet-950/20 border-l-2 border-violet-500"
                  : "border-l-2 border-transparent"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold tabular-nums",
                getScoreBgColor(item.atsScore)
              )}>
                {item.atsScore}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">
                  {item.jobTitle}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate mt-0.5">
                  {item.company} · {formatDate(item.timestamp)}
                </p>
              </div>
              <span className={cn("text-[11px] font-bold flex-shrink-0 tabular-nums", getScoreColor(item.atsScore))}>
                +{item.atsScore - item.originalScore}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
