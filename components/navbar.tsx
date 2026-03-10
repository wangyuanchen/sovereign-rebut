"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Globe } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { useI18n } from "@/lib/i18n";
import { formatCredits, cn } from "@/lib/utils";

export function Navbar() {
  const { isConnected } = useAccount();
  const { credits, isLoading } = useCredits();
  const { t, locale, toggleLocale } = useI18n();

  return (
    <nav className="flex justify-between items-center px-10 py-5 border-b border-border sticky top-0 bg-background/[0.92] backdrop-blur-[12px] z-50">
      <Link href="/" className="flex items-center">
        <span className="font-display text-[22px] font-black tracking-[-0.5px]">
          Rebut<span className="text-red">AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {/* Language Toggle */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 bg-surface2 border border-border text-muted px-3 py-2 font-mono text-[11px] cursor-pointer transition-all tracking-[0.5px] hover:border-text hover:text-text"
          title={locale === "zh" ? "Switch to English" : "切换到中文"}
        >
          <Globe className="h-3.5 w-3.5" />
          {locale === "zh" ? "EN" : "中"}
        </button>

        {/* Credits Display */}
        {isConnected && !isLoading && (
          <span className="font-mono text-[11px] text-muted tracking-[0.5px]">
            {formatCredits(credits)}{" "}
            {credits === -1 ? t.nav.unlimited : t.nav.credits.toUpperCase()}
          </span>
        )}

        {/* Wallet Button */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const connected = mounted && account && chain;

            return (
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {!connected ? (
                  <button
                    onClick={openConnectModal}
                    className="bg-surface2 border border-border text-text px-4 py-2 font-mono text-[12px] cursor-pointer transition-all tracking-[0.5px] hover:border-red hover:text-red"
                  >
                    {t.nav.connectWallet}
                  </button>
                ) : chain.unsupported ? (
                  <button
                    onClick={openChainModal}
                    className="bg-red/20 border border-red text-red px-4 py-2 font-mono text-[12px] cursor-pointer tracking-[0.5px]"
                  >
                    {t.nav.wrongNetwork}
                  </button>
                ) : (
                  <button
                    onClick={openAccountModal}
                    className={cn(
                      "bg-surface2 border border-gold text-gold px-4 py-2 font-mono text-[12px] cursor-pointer transition-all tracking-[0.5px]",
                      "hover:bg-gold/10"
                    )}
                  >
                    {account.displayName}
                  </button>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}
