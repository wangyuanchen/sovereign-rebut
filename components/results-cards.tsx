"use client";

import { useState } from "react";
import { Copy, Check, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { type GenerationOutput, type ResponseStyle } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ResultsCardsProps {
  output: GenerationOutput;
  hasCredits: boolean;
  onUnlockClick: () => void;
}

const STYLE_COLORS: Record<keyof GenerationOutput, string> = {
  rational: "text-[#4a9eff] border-[#4a9eff]",
  emotion: "text-[#ff9f43] border-[#ff9f43]",
  political: "text-gold border-gold",
  nuclear: "text-red border-red",
};

function DamageDots({ damage, label }: { damage: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-muted tracking-[1px]">
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i <= damage ? "bg-red" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  style,
  styleKey,
  isLocked,
  onUnlockClick,
  delay,
}: {
  style: ResponseStyle;
  styleKey: keyof GenerationOutput;
  isLocked: boolean;
  onUnlockClick: () => void;
  delay: number;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = async () => {
    if (isLocked) return;
    
    try {
      await navigator.clipboard.writeText(style.content);
      setCopied(true);
      toast({
        title: t.toast.copySuccess,
        description: t.toast.copySuccessDesc,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t.toast.copyFailed,
        description: t.toast.copyFailedDesc,
        variant: "destructive",
      });
    }
  };

  const colorClass = STYLE_COLORS[styleKey];

  return (
    <div
      className={cn(
        "bg-surface border border-border p-7 relative transition-colors opacity-0 translate-y-2.5",
        "hover:border-[#333]",
        "animate-[cardReveal_0.4s_forwards]"
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Tag */}
      <span className={cn(
        "inline-block font-mono text-[10px] tracking-[2px] uppercase py-0.5 px-2 border mb-4",
        colorClass
      )}>
        {t.styles[styleKey]}
      </span>

      {/* Content */}
      <div className={cn("relative", isLocked && "locked-overlay")}>
        <p className={cn(
          "font-body text-[15px] leading-[1.9] text-text",
          isLocked && "blur-[5px] select-none pointer-events-none"
        )}>
          {style.content}
        </p>

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] gap-3">
            <Lock className="h-5 w-5 text-muted" />
            <span className="font-display text-base text-text">
              {t.results.locked}
            </span>
            <button
              onClick={onUnlockClick}
              className="bg-red text-white border-none py-2.5 px-6 font-mono text-[11px] tracking-[2px] cursor-pointer transition-colors hover:bg-[#a01f17]"
            >
              {t.results.unlock}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <DamageDots damage={style.damage} label={t.results.damage} />
        
        {!isLocked && (
          <button
            onClick={handleCopy}
            className={cn(
              "bg-transparent border border-border text-muted py-1.5 px-3.5 font-mono text-[10px] tracking-[1px] cursor-pointer transition-all",
              "hover:border-muted hover:text-text",
              copied && "border-[#4caf50] text-[#4caf50]"
            )}
          >
            {copied ? t.results.copied.toUpperCase() : t.results.copy.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
}

export function ResultsCards({
  output,
  hasCredits,
  onUnlockClick,
}: ResultsCardsProps) {
  const { t } = useI18n();
  const styleKeys: (keyof GenerationOutput)[] = ["rational", "emotion", "political", "nuclear"];

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h3 className="font-display text-[22px] font-black text-text">
          {t.results.title}
        </h3>
        <span className="font-mono text-[11px] text-muted tracking-[2px]">
          {t.results.resultsCount}
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {styleKeys.map((key, index) => (
          <ResultCard
            key={key}
            styleKey={key}
            style={output[key]}
            isLocked={key === "nuclear" && !hasCredits}
            onUnlockClick={onUnlockClick}
            delay={0.05 + index * 0.1}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes cardReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
