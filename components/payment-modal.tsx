"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Loader2, Check, Zap, Infinity, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  USDC_ADDRESS,
  ERC20_ABI,
  PLAN_PRICES,
  PLAN_DISPLAY_PRICES,
  PLAN_CREDITS,
  type PlanType,
} from "@/lib/contracts/usdc";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credits: number) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { address } = useAccount();
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("pack10");
  const [isVerifying, setIsVerifying] = useState(false);

  const PLANS: {
    id: PlanType;
    name: string;
    price: string;
    credits: string;
    description: string;
    icon: React.ReactNode;
    popular?: boolean;
  }[] = [
    {
      id: "single",
      name: t.payment.single,
      price: PLAN_DISPLAY_PRICES.single,
      credits: t.payment.singleCredits,
      description: t.payment.singleDesc,
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "pack10",
      name: t.payment.pack10,
      price: PLAN_DISPLAY_PRICES.pack10,
      credits: t.payment.pack10Credits,
      description: t.payment.pack10Desc,
      icon: <Package className="h-5 w-5" />,
      popular: true,
    },
    {
      id: "unlimited",
      name: t.payment.unlimited,
      price: PLAN_DISPLAY_PRICES.unlimited,
      credits: t.payment.unlimitedCredits,
      description: t.payment.unlimitedDesc,
      icon: <Infinity className="h-5 w-5" />,
    },
  ];

  const {
    data: hash,
    isPending: isWritePending,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Verify payment after confirmation
  useEffect(() => {
    if (isConfirmed && hash && address) {
      verifyPayment(hash);
    }
  }, [isConfirmed, hash, address]);

  const verifyPayment = async (txHash: string) => {
    setIsVerifying(true);
    
    try {
      // Poll for verification (max 10 attempts, 3s apart)
      for (let i = 0; i < 10; i++) {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            txHash,
            walletAddress: address,
            plan: selectedPlan,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          toast({
            title: t.toast.paymentSuccess,
            description: t.toast.paymentSuccessDesc,
          });
          onSuccess(data.credits);
          onClose();
          resetWrite();
          return;
        }

        // Wait 3 seconds before next attempt
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      throw new Error("Verification timeout");
    } catch (error) {
      toast({
        title: t.toast.generateFailed,
        description: error instanceof Error ? error.message : t.toast.tryAgain,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePay = async () => {
    if (!address) {
      toast({
        title: t.toast.connectWallet,
        variant: "destructive",
      });
      return;
    }

    const merchantWallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET;
    if (!merchantWallet) {
      toast({
        title: "Configuration Error",
        description: "Merchant wallet not configured",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [merchantWallet as `0x${string}`, PLAN_PRICES[selectedPlan]],
      });
    } catch (error) {
      toast({
        title: t.toast.generateFailed,
        description: error instanceof Error ? error.message : t.toast.tryAgain,
        variant: "destructive",
      });
    }
  };

  const isPaying = isWritePending || isConfirming || isVerifying;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {t.payment.title}
          </DialogTitle>
          <DialogDescription>
            {t.payment.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Network indicator */}
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface2 px-3 py-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-muted">{t.payment.network}</span>
        </div>

        {/* Plan selection */}
        <div className="grid gap-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              disabled={isPaying}
              className={cn(
                "relative flex items-center gap-4 rounded-lg border p-4 text-left transition-all",
                selectedPlan === plan.id
                  ? "border-red bg-surface2"
                  : "border-border bg-surface hover:border-muted",
                isPaying && "opacity-50"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-2 right-3 rounded-full bg-red px-2 py-0.5 text-xs font-medium text-text">
                  {t.payment.popular}
                </span>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface2 text-gold">
                {plan.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text">{plan.name}</span>
                  <span className="text-sm text-muted">· {plan.credits}</span>
                </div>
                <p className="text-sm text-muted">{plan.description}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-red">{plan.price}</span>
                <p className="text-xs text-muted">USDC</p>
              </div>
            </button>
          ))}
        </div>

        {/* Pay button */}
        <Button
          size="lg"
          onClick={handlePay}
          disabled={isPaying}
          className="w-full"
        >
          {isWritePending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.payment.confirming}
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.payment.waiting}
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.payment.verifying}
            </>
          ) : isConfirmed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t.payment.success}
            </>
          ) : (
            `${t.payment.payBtn} ${PLAN_DISPLAY_PRICES[selectedPlan]} USDC`
          )}
        </Button>

        <p className="text-center text-xs text-muted">
          {t.payment.terms}
        </p>
      </DialogContent>
    </Dialog>
  );
}
