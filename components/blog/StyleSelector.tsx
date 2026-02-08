"use client";

import { useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Card, CardHeader, CardAction, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <span className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground min-w-[48px] pt-2 shrink-0 text-right">
        {label}
      </span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant={value === opt.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`rounded-full px-3.5 text-[0.8125rem] ${
              value === opt.value
                ? "border border-border bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {opt.label}
          </Button>
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
    <Card className="mb-8 p-5 py-5 gap-0">
      <CardHeader className="p-0 mb-4">
        <span className="text-[0.8125rem] font-medium text-muted-foreground flex items-center gap-2">
          <SlidersHorizontalIcon className="size-3.5 opacity-40" />
          Writing style
        </span>
        <CardAction>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        </CardAction>
      </CardHeader>
      {!collapsed && (
        <CardContent className="p-0 space-y-3">
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
        </CardContent>
      )}
    </Card>
  );
}
