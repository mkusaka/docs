"use client";

import { useState } from "react";
import { CopyIcon, LinkIcon, FileTextIcon, EyeIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CopyPageDropdownProps {
  slug: string;
  rawContent: string;
  aiContent?: string;
  viewingMarkdown: boolean;
  onToggleViewMarkdown: () => void;
}

export function CopyPageDropdown({ slug, rawContent, aiContent, viewingMarkdown, onToggleViewMarkdown }: CopyPageDropdownProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://mkusaka.com";
  const url = `${baseUrl}/${slug}`;
  const currentContent = aiContent || rawContent;

  return (
    <div className="flex">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(currentContent, "Copied")}
        className="rounded-r-none border-r-0"
      >
        <CopyIcon className="size-3.5 opacity-50" />
        {copied || "Copy page"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-l-none px-2">
            <ChevronDownIcon className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => copyToClipboard(url, "URL copied")}>
            <LinkIcon className="opacity-40" />
            Copy URL
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyToClipboard(currentContent, "MD copied")}>
            <FileTextIcon className="opacity-40" />
            Copy as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleViewMarkdown}>
            <EyeIcon className="opacity-40" />
            {viewingMarkdown ? "View rendered" : "View as Markdown"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
