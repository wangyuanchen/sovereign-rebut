"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Check, Zap, Package, Infinity } from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/use-credits";
import { cn } from "@/lib/utils";
import { PLAN_DISPLAY_PRICES, type PlanType } from "@/lib/contracts/usdc";

const PLANS: {
  id: PlanType;
  name: string;
  price: string;
  credits: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}[] = [
  {
    id: "single",
    name: "单次体验",
    price: PLAN_DISPLAY_PRICES.single,
    credits: "1次",
    description: "尝鲜体验",
    features: ["1次生成额度", "4种回怼风格", "复制和分享功能"],
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: "pack10",
    name: "10次套餐",
    price: PLAN_DISPLAY_PRICES.pack10,
    credits: "10次",
    description: "性价比之选",
    features: ["10次生成额度", "4种回怼风格", "复制和分享功能", "历史记录查看"],
    icon: <Package className="h-6 w-6" />,
    popular: true,
  },
  {
    id: "unlimited",
    name: "终身无限",
    price: PLAN_DISPLAY_PRICES.unlimited,
    credits: "无限次",
    description: "一次付费，永久使用",
    features: [
      "无限生成额度",
      "4种回怼风格",
      "复制和分享功能",
      "历史记录查看",
      "优先客服支持",
    ],
    icon: <Infinity className="h-6 w-6" />,
  },
];

export default function PricingPage() {
  const { isConnected } = useAccount();
  const { refetch } = useCredits();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentSuccess = () => {
    refetch();
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="font-display text-4xl font-black text-text sm:text-5xl">
          选择你的<span className="text-red">武器</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          使用 USDC 在 Base 网络上支付，即时到账，无需等待
        </p>
      </section>

      {/* Pricing cards */}
      <section className="mb-12 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-xl border p-6",
              plan.popular
                ? "border-red bg-surface"
                : "border-border bg-surface"
            )}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red px-4 py-1 text-sm font-medium text-text">
                最受欢迎
              </span>
            )}

            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface2 text-gold">
              {plan.icon}
            </div>

            {/* Name & description */}
            <h3 className="font-display text-xl font-bold text-text">
              {plan.name}
            </h3>
            <p className="text-sm text-muted">{plan.description}</p>

            {/* Price */}
            <div className="my-6">
              <span className="text-4xl font-bold text-red">{plan.price}</span>
              <span className="ml-2 text-muted">USDC</span>
              <p className="mt-1 text-sm text-muted">{plan.credits}</p>
            </div>

            {/* Features */}
            <ul className="mb-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-text/80">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isConnected ? (
              <Button
                onClick={() => setIsPaymentOpen(true)}
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                立即购买
              </Button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    连接钱包购买
                  </Button>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-text">
          常见问题
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">什么是 USDC？</h3>
            <p className="text-sm text-muted">
              USDC 是一种稳定币，价值与美元 1:1 挂钩。你可以在交易所购买 USDC
              并转入 Base 网络使用。
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">什么是 Base 网络？</h3>
            <p className="text-sm text-muted">
              Base 是由 Coinbase 推出的 Layer 2 网络，交易费用低廉，确认速度快。
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">购买后多久生效？</h3>
            <p className="text-sm text-muted">
              链上交易确认后立即生效，通常只需要几秒钟。
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">可以退款吗？</h3>
            <p className="text-sm text-muted">
              由于链上交易的不可逆性，已完成的支付无法退款。请在购买前确认你的需求。
            </p>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
