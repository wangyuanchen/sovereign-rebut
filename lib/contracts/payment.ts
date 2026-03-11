import { parseAbi } from "viem";

export const PAYMENT_TOKEN_SYMBOL = "USDT" as const;
export const PAYMENT_TOKEN_DECIMALS = 6;

export const SUPPORTED_CHAIN_IDS = [1, 8453, 42161, 10, 56] as const;
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number];

export const CHAIN_PAYMENT_CONFIG: Record<
  SupportedChainId,
  {
    name: string;
    tokenAddress: `0x${string}`;
    rpcEnvVar: string;
    defaultRpcUrl: string;
  }
> = {
  1: {
    name: "Ethereum Mainnet",
    tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    rpcEnvVar: "NEXT_PUBLIC_ETHEREUM_RPC_URL",
    defaultRpcUrl: "https://ethereum-rpc.publicnode.com",
  },
  8453: {
    name: "Base",
    tokenAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    rpcEnvVar: "NEXT_PUBLIC_BASE_RPC_URL",
    defaultRpcUrl: "https://mainnet.base.org",
  },
  42161: {
    name: "Arbitrum One",
    tokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    rpcEnvVar: "NEXT_PUBLIC_ARBITRUM_RPC_URL",
    defaultRpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  10: {
    name: "Optimism",
    tokenAddress: "0x94b008aA00579c1307B0EF2c499aD98a8Ce58e58",
    rpcEnvVar: "NEXT_PUBLIC_OPTIMISM_RPC_URL",
    defaultRpcUrl: "https://mainnet.optimism.io",
  },
  56: {
    name: "BNB Smart Chain",
    tokenAddress: "0x55d398326f99059fF775485246999027B3197955",
    rpcEnvVar: "NEXT_PUBLIC_BSC_RPC_URL",
    defaultRpcUrl: "https://bsc-dataseed.binance.org",
  },
};

export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId);
}

export function getChainPaymentConfig(chainId: number) {
  if (!isSupportedChainId(chainId)) return null;
  return CHAIN_PAYMENT_CONFIG[chainId];
}

// ERC20 ABI for transfer function
export const ERC20_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

// Plan pricing in token units (6 decimals)
export const PLAN_PRICES = {
  single: BigInt(5 * 10 ** PAYMENT_TOKEN_DECIMALS), // 5 USDT
  pack10: BigInt(19 * 10 ** PAYMENT_TOKEN_DECIMALS), // 19 USDT
  unlimited: BigInt(49 * 10 ** PAYMENT_TOKEN_DECIMALS), // 49 USDT
} as const;

export const PLAN_CREDITS = {
  single: 1,
  pack10: 10,
  unlimited: -1, // -1 = unlimited
} as const;

export const PLAN_DISPLAY_PRICES = {
  single: "$5",
  pack10: "$19",
  unlimited: "$49",
} as const;

export type PlanType = keyof typeof PLAN_PRICES;
