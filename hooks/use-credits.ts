"use client";

import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";

interface UseCreditsReturn {
  credits: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCredits(): UseCreditsReturn {
  const { address, isConnected } = useAccount();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!isConnected || !address) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/credits?address=${address}`);
      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }
      const data = await response.json();
      setCredits(data.credits);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    isLoading,
    error,
    refetch: fetchCredits,
  };
}
