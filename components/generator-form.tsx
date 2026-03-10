"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount } from "wagmi";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { type GenerationOutput, type SceneType } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  scenario: z
    .string()
    .min(10, "At least 10 characters required")
    .max(500, "Maximum 500 characters"),
  sceneType: z.enum(["workplace", "family", "relationship", "daily"]),
  intensity: z.number().min(1).max(5),
});

type FormData = z.infer<typeof formSchema>;

interface GeneratorFormProps {
  onGenerate: (output: GenerationOutput, remainingCredits: number) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const SCENE_EMOJIS: Record<SceneType, string> = {
  workplace: "💼",
  family: "🏠",
  relationship: "💔",
  daily: "🔥",
};

export function GeneratorForm({
  onGenerate,
  isGenerating,
  setIsGenerating,
}: GeneratorFormProps) {
  const { isConnected } = useAccount();
  const { t, locale } = useI18n();
  const [intensity, setIntensity] = useState(3);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenario: "",
      sceneType: "workplace",
      intensity: 3,
    },
  });

  const scenario = watch("scenario");
  const sceneType = watch("sceneType");

  const onSubmit = async (data: FormData) => {
    if (!isConnected) {
      toast({
        title: t.toast.connectWallet,
        description: t.toast.connectWalletDesc,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.needsPayment) {
          toast({
            title: t.toast.insufficientCredits,
            description: t.toast.insufficientCreditsDesc,
            variant: "destructive",
          });
          return;
        }
        throw new Error(result.error || "Generation failed");
      }

      onGenerate(result.output, result.remainingCredits);
      toast({
        title: t.toast.generateSuccess,
        description: t.toast.generateSuccessDesc,
      });
    } catch (error) {
      toast({
        title: t.toast.generateFailed,
        description: error instanceof Error ? error.message : t.toast.tryAgain,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 2) return t.form.intensityMild;
    if (value === 3) return t.form.intensityBalanced;
    return t.form.intensityNuclear;
  };

  const sceneTypes: SceneType[] = ["workplace", "family", "relationship", "daily"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 01: Scenario Input */}
      <div className="relative bg-surface border border-border p-8">
        <span className="absolute top-3 right-4 font-mono text-[11px] text-border tracking-[2px]">
          01
        </span>
        <label className="block font-mono text-[10px] tracking-[3px] text-muted uppercase mb-4">
          {t.form.scenarioLabel}
        </label>
        <textarea
          {...register("scenario")}
          placeholder={t.form.scenarioPlaceholder}
          className="w-full bg-surface2 border border-border text-text font-body text-[15px] leading-[1.8] p-4 resize-none h-[130px] outline-none transition-colors focus:border-red placeholder:text-muted"
        />
        <div className="flex justify-between mt-2 text-xs text-muted font-mono">
          {errors.scenario ? (
            <span className="text-red">{errors.scenario.message}</span>
          ) : (
            <span>{t.form.scenarioHint}</span>
          )}
          <span>{scenario.length}/500</span>
        </div>
      </div>

      {/* Section 02: Mode Selector */}
      <div className="relative bg-surface border border-border p-6">
        <span className="absolute top-3 right-4 font-mono text-[11px] text-border tracking-[2px]">
          02
        </span>
        <label className="block font-mono text-[10px] tracking-[3px] text-muted uppercase mb-4">
          {t.form.sceneTypeLabel}
        </label>
        <div className="grid grid-cols-4 gap-3">
          {sceneTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("sceneType", type)}
              className={cn(
                "relative bg-surface2 border border-border p-4 text-center cursor-pointer transition-all overflow-hidden",
                "before:content-[''] before:absolute before:inset-0 before:bg-[rgba(230,51,41,0.15)] before:opacity-0 before:transition-opacity",
                "hover:before:opacity-100",
                sceneType === type && "border-red before:opacity-100"
              )}
            >
              <span className="text-[22px] block mb-1.5">{SCENE_EMOJIS[type]}</span>
              <span className={cn(
                "font-mono text-[11px] tracking-[1px] text-muted",
                sceneType === type && "text-red"
              )}>
                {t.scenes[type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 03: Intensity Slider */}
      <div className="relative bg-surface border border-border p-6">
        <span className="absolute top-3 right-4 font-mono text-[11px] text-border tracking-[2px]">
          03
        </span>
        <label className="block font-mono text-[10px] tracking-[3px] text-muted uppercase mb-4">
          {t.form.intensityLabel}
        </label>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-muted whitespace-nowrap w-[60px]">
            {getIntensityLabel(intensity)}
          </span>
          <input
            type="range"
            min={1}
            max={5}
            value={intensity}
            onChange={(e) => {
              const val = Number(e.target.value);
              setIntensity(val);
              setValue("intensity", val);
            }}
            className="flex-1 h-[2px] bg-border appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="font-display text-[28px] font-black text-red w-[40px] text-right">
            {intensity}
          </span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isGenerating || !isConnected}
        className={cn(
          "w-full bg-red text-white border-none py-5 font-display text-[18px] font-bold tracking-[1px] cursor-pointer transition-all relative overflow-hidden",
          "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-white/[0.08]",
          "hover:bg-[#a01f17] hover:-translate-y-[1px]",
          "active:translate-y-0",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
      >
        <span className="flex items-center justify-center gap-2.5">
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.form.generating}
            </>
          ) : (
            <>
              <span>⚡</span>
              {t.form.generateBtn}
            </>
          )}
        </span>
      </button>

      {!isConnected && (
        <p className="text-center text-sm text-muted font-mono tracking-wide">
          {t.form.connectFirst}
        </p>
      )}
    </form>
  );
}
