"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Check, Zap, Package, Infinity } from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/use-credits";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PLAN_DISPLAY_PRICES, PAYMENT_TOKEN_SYMBOL } from "@/lib/contracts/payment";

export default function PricingPage() {
  const { isConnected } = useAccount();
  const { refetch } = useCredits();
  const { t, locale } = useI18n();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const plans = useMemo(
    () =>
      [
        {
          id: "single" as const,
          name: t.payment.single,
          price: PLAN_DISPLAY_PRICES.single,
          credits: t.payment.singleCredits,
          description: t.payment.singleDesc,
          features: [
            t.pricing.features.credits1,
            t.pricing.features.styles,
            t.pricing.features.copyShare,
          ],
          icon: <Zap className="h-6 w-6" />,
          popular: false,
        },
        {
          id: "pack10" as const,
          name: t.payment.pack10,
          price: PLAN_DISPLAY_PRICES.pack10,
          credits: t.payment.pack10Credits,
          description: t.payment.pack10Desc,
          features: [
            t.pricing.features.credits10,
            t.pricing.features.styles,
            t.pricing.features.copyShare,
            t.pricing.features.history,
          ],
          icon: <Package className="h-6 w-6" />,
          popular: true,
        },
        {
          id: "unlimited" as const,
          name: t.payment.unlimited,
          price: PLAN_DISPLAY_PRICES.unlimited,
          credits: t.payment.unlimitedCredits,
          description: t.payment.unlimitedDesc,
          features: [
            t.pricing.features.creditsUnlimited,
            t.pricing.features.styles,
            t.pricing.features.copyShare,
            t.pricing.features.history,
            t.pricing.features.support,
          ],
          icon: <Infinity className="h-6 w-6" />,
          popular: false,
        },
      ] as const,
    [t]
  );

  const handlePaymentSuccess = () => {
    refetch();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
      <section className="mb-12 text-center">
        <h1 className="font-display text-4xl font-black text-text sm:text-5xl">
          {t.pricing.title}
          {locale === "en" ? " " : ""}
          <span className="text-red">{t.pricing.titleHighlight}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          {t.pricing.subtitle}
        </p>
      </section>

      <section className="mb-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-xl border p-6",
              plan.popular ? "border-red bg-surface" : "border-border bg-surface"
            )}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red px-4 py-1 text-sm font-medium text-text">
                {t.pricing.mostPopular}
              </span>
            )}

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface2 text-gold">
              {plan.icon}
            </div>

            <h3 className="font-display text-xl font-bold text-text">
              {plan.name}
            </h3>
            <p className="text-sm text-muted">{plan.description}</p>

            <div className="my-6">
              <span className="text-4xl font-bold text-red">{plan.price}</span>
              <span className="ml-2 text-muted">{PAYMENT_TOKEN_SYMBOL}</span>
              <p className="mt-1 text-sm text-muted">{plan.credits}</p>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
              {plan.features.map((feature, idx) => (
                <li
                  key={`${plan.id}-${idx}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-text/80">{feature}</span>
                </li>
              ))}
            </ul>

            {isConnected ? (
              <Button
                onClick={() => setIsPaymentOpen(true)}
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                {t.pricing.buyNow}
              </Button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {t.pricing.connectToBuy}
                  </Button>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        ))}
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-text">
          {t.pricing.faq.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">{t.pricing.faq.q1}</h3>
            <p className="text-sm text-muted">{t.pricing.faq.a1}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">{t.pricing.faq.q2}</h3>
            <p className="text-sm text-muted">{t.pricing.faq.a2}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">{t.pricing.faq.q3}</h3>
            <p className="text-sm text-muted">{t.pricing.faq.a3}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-2 font-medium text-text">{t.pricing.faq.q4}</h3>
            <p className="text-sm text-muted">{t.pricing.faq.a4}</p>
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
