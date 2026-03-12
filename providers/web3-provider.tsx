"use client";

import { WagmiProvider, http } from "wagmi";
import { mainnet, base, arbitrum, optimism, bsc } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode, useState, useMemo } from "react";

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  const config = useMemo(() => {
    return getDefaultConfig({
      appName: "Sovereign Rebut",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
      chains: [mainnet, base, arbitrum, optimism, bsc],
      transports: {
        [mainnet.id]: http(
          process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://ethereum-rpc.publicnode.com"
        ),
        [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"),
        [arbitrum.id]: http(
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc"
        ),
        [optimism.id]: http(
          process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || "https://mainnet.optimism.io"
        ),
        [bsc.id]: http(
          process.env.NEXT_PUBLIC_BSC_RPC_URL || "https://bsc-dataseed.binance.org"
        ),
      },
      // Avoid server-side wallet storage initialization (e.g. indexedDB access).
      ssr: false,
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#e63329",
            accentColorForeground: "#f0ece4",
            borderRadius: "small",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
