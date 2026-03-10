"use client";

import { useState } from "react";
import { ChevronRight, Clock, Briefcase, Home, Heart, Flame } from "lucide-react";
import { type Generation, type GenerationOutput, type SceneType } from "@/lib/db/schema";
import { ResultsCards } from "@/components/results-cards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
  generations: Generation[];
}

const SCENE_ICONS: Record<SceneType, React.ReactNode> = {
  workplace: <Briefcase className="h-4 w-4" />,
  family: <Home className="h-4 w-4" />,
  relationship: <Heart className="h-4 w-4" />,
  daily: <Flame className="h-4 w-4" />,
};

const SCENE_LABELS: Record<SceneType, string> = {
  workplace: "职场",
  family: "家庭",
  relationship: "感情",
  daily: "日常",
};

export function DashboardClient({ generations }: DashboardClientProps) {
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(
    null
  );

  if (generations.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-display text-3xl font-bold text-text">
          生成历史
        </h1>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
          <Clock className="mb-4 h-12 w-12 text-muted" />
          <h2 className="mb-2 font-display text-xl font-bold text-text">
            暂无记录
          </h2>
          <p className="text-muted">
            你还没有生成过任何回怼方案
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-text">
        生成历史
      </h1>

      <div className="space-y-3">
        {generations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => setSelectedGeneration(gen)}
            className="flex w-full items-center gap-4 rounded-lg border border-border bg-surface p-4 text-left transition-all hover:border-muted hover:bg-surface2"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                "bg-surface2 text-gold"
              )}
            >
              {SCENE_ICONS[gen.sceneType]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface2 px-2 py-0.5 text-xs text-muted">
                  {SCENE_LABELS[gen.sceneType]}
                </span>
                <span className="text-xs text-muted">
                  强度 {gen.intensity}/5
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-text">
                {gen.scenario}
              </p>
              <p className="mt-1 text-xs text-muted">
                {new Date(gen.createdAt).toLocaleString("zh-CN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
          </button>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedGeneration}
        onOpenChange={(open) => !open && setSelectedGeneration(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">生成详情</DialogTitle>
          </DialogHeader>
          
          {selectedGeneration && (
            <div className="space-y-6">
              {/* Original scenario */}
              <div className="rounded-lg border border-border bg-surface2 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted">
                  <span className="rounded-full bg-surface px-2 py-0.5">
                    {SCENE_LABELS[selectedGeneration.sceneType]}
                  </span>
                  <span>·</span>
                  <span>强度 {selectedGeneration.intensity}/5</span>
                </div>
                <p className="text-text">{selectedGeneration.scenario}</p>
              </div>

              {/* Results */}
              {selectedGeneration.output && (
                <ResultsCards
                  output={selectedGeneration.output as GenerationOutput}
                  hasCredits={true}
                  onUnlockClick={() => {}}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
