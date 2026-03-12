"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

type AuthStatus = "idle" | "checking" | "signing" | "authenticated" | "error";

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const failedAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setStatus("idle");
      setError(null);
      failedAddressRef.current = null;
      return;
    }

    if (failedAddressRef.current === address.toLowerCase()) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setStatus("checking");
        setError(null);

        const sessionRes = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (
            sessionData.authenticated &&
            sessionData.walletAddress?.toLowerCase() === address.toLowerCase()
          ) {
            if (!cancelled) setStatus("authenticated");
            return;
          }
        }

        const nonceRes = await fetch(`/api/auth/nonce?address=${address}`, {
          credentials: "include",
        });
        if (!nonceRes.ok) {
          throw new Error("Failed to get nonce");
        }

        const { nonce } = await nonceRes.json();
        const message = `Welcome to Sovereign Rebut. Nonce: ${nonce}`;

        if (!cancelled) setStatus("signing");
        const signature = await signMessageAsync({ message });

        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ address, signature, nonce }),
        });

        if (!verifyRes.ok) {
          const data = await verifyRes.json().catch(() => ({}));
          throw new Error(data.error || "Wallet authentication failed");
        }

        if (!cancelled) {
          setStatus("authenticated");
          setError(null);
        }
      } catch (err) {
        failedAddressRef.current = address.toLowerCase();
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Wallet authentication failed");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected, signMessageAsync]);

  return {
    status,
    error,
    isAuthenticating: status === "checking" || status === "signing",
    isAuthenticated: status === "authenticated",
  };
}
