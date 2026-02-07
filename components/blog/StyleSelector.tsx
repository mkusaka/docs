"use client";

import { useState } from "react";
import type { Language, Tone, DetailLevel, StyleOptions } from "@/lib/types";

interface StyleSelectorProps {
  value: StyleOptions;
  onChange: (options: StyleOptions) => void;
  disabled?: boolean;
}

const languages: { value: Language; label: string }[] = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ko", label: "한국어" },
];

const tones: { value: Tone; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "polite", label: "Polite" },
  { value: "technical", label: "Technical" },
  { value: "neutral", label: "Neutral" },
];

const details: { value: DetailLevel; label: string }[] = [
  { value: "concise", label: "Concise" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
];

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[0.625rem] uppercase tracking-[0.12em] text-neutral-600 min-w-[48px] pt-2 shrink-0 text-right">
        {label}
      </span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`px-3.5 py-[6px] rounded-full text-[0.8125rem] border cursor-pointer transition-all disabled:opacity-40 ${
              value === opt.value
                ? "border-white/[0.15] bg-white/[0.06] text-neutral-200"
                : "border-white/[0.06] text-neutral-500 hover:text-neutral-300 hover:border-white/[0.1] hover:bg-white/[0.03]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StyleSelector({
  value,
  onChange,
  disabled,
}: StyleSelectorProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-8 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.8125rem] font-medium text-neutral-500 flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-40"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Writing style
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors bg-transparent border-none cursor-pointer"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <div className="space-y-3">
          <ChipGroup
            label="Lang"
            options={languages}
            value={value.language}
            onChange={(v) => onChange({ ...value, language: v })}
            disabled={disabled}
          />
          <ChipGroup
            label="Tone"
            options={tones}
            value={value.tone}
            onChange={(v) => onChange({ ...value, tone: v })}
            disabled={disabled}
          />
          <ChipGroup
            label="Detail"
            options={details}
            value={value.detail}
            onChange={(v) => onChange({ ...value, detail: v })}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
