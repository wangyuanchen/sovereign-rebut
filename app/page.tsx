"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { GeneratorForm } from "@/components/generator-form";
import { ResultsCards } from "@/components/results-cards";
import { PaymentModal } from "@/components/payment-modal";
import { useCredits } from "@/hooks/use-credits";
import { useI18n } from "@/lib/i18n";
import { type GenerationOutput } from "@/lib/db/schema";

export default function HomePage() {
  const { isConnected } = useAccount();
  const { credits, refetch } = useCredits();
  const { t } = useI18n();
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [localCredits, setLocalCredits] = useState<number | null>(null);

  const effectiveCredits = localCredits ?? credits;
  const hasCredits = effectiveCredits === -1 || effectiveCredits > 0;

  const handleGenerate = (newOutput: GenerationOutput, remainingCredits: number) => {
    setOutput(newOutput);
    setLocalCredits(remainingCredits);
  };

  const handlePaymentSuccess = (newCredits: number) => {
    setLocalCredits(newCredits);
    refetch();
  };

  return (
    <div className="max-w-[860px] mx-auto px-10 pb-20">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <p className="font-mono text-[11px] tracking-[3px] text-red uppercase mb-6 opacity-0 animate-[fadeUp_0.6s_0.1s_forwards]">
          {t.hero.eyebrow}
        </p>
        
        <h1 className="font-display text-[clamp(48px,8vw,88px)] font-black leading-none tracking-[-2px] mb-5 opacity-0 animate-[fadeUp_0.6s_0.2s_forwards]">
          {t.hero.title1}
          <span className="text-red relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[3px] after:bg-red after:scale-x-0 after:origin-left after:animate-[lineReveal_0.5s_0.9s_forwards]">
            {t.hero.title2}
          </span>
        </h1>
        
        <p className="font-body text-base text-muted max-w-[480px] mx-auto leading-[1.7] opacity-0 animate-[fadeUp_0.6s_0.3s_forwards]">
          {t.hero.subtitle}
        </p>
      </section>

      {/* Generator */}
      <section className="opacity-0 animate-[fadeUp_0.6s_0.4s_forwards]">
        <GeneratorForm
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </section>

      {/* Results */}
      {output && (
        <ResultsCards
          output={output}
          hasCredits={hasCredits}
          onUnlockClick={() => setIsPaymentOpen(true)}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes lineReveal {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
