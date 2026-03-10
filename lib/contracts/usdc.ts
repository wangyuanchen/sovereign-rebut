import { parseAbi } from "viem";

// USDC on Base mainnet
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

// ERC20 ABI for transfer function
export const ERC20_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Plan pricing in USDC (as bigint with 6 decimals)
export const PLAN_PRICES = {
  single: BigInt(5 * 10 ** USDC_DECIMALS), // 5 USDC
  pack10: BigInt(19 * 10 ** USDC_DECIMALS), // 19 USDC
  unlimited: BigInt(49 * 10 ** USDC_DECIMALS), // 49 USDC
} as const;

// Plan credits
export const PLAN_CREDITS = {
  single: 1,
  pack10: 10,
  unlimited: -1, // -1 = unlimited
} as const;

// Human-readable prices
export const PLAN_DISPLAY_PRICES = {
  single: "$5",
  pack10: "$19",
  unlimited: "$49",
} as const;

export type PlanType = keyof typeof PLAN_PRICES;
