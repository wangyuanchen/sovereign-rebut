import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbiItem, decodeEventLog } from "viem";
import { base } from "viem/chains";
import { db } from "@/lib/db";
import { users, payments, type PlanType } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { USDC_ADDRESS, PLAN_PRICES, PLAN_CREDITS, ERC20_ABI } from "@/lib/contracts/usdc";

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"),
});

const MERCHANT_WALLET = process.env.NEXT_PUBLIC_MERCHANT_WALLET?.toLowerCase();

export async function POST(request: Request) {
  try {
    const { txHash, walletAddress, plan } = await request.json();

    if (!txHash || !walletAddress || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!MERCHANT_WALLET) {
      return NextResponse.json(
        { error: "Merchant wallet not configured" },
        { status: 500 }
      );
    }

    // Check if tx already verified
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.txHash, txHash))
      .limit(1);

    if (existingPayment.length > 0) {
      return NextResponse.json(
        { error: "Transaction already verified" },
        { status: 400 }
      );
    }

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt || receipt.status !== "success") {
      return NextResponse.json(
        { error: "Transaction not confirmed or failed" },
        { status: 400 }
      );
    }

    // Find the Transfer event
    const transferEventSignature = parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    );

    let validTransfer = false;
    let transferAmount = BigInt(0);

    for (const log of receipt.logs) {
      // Check if this log is from the USDC contract
      if (log.address.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
        continue;
      }

      try {
        const decoded = decodeEventLog({
          abi: ERC20_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === "Transfer") {
          const { from, to, value } = decoded.args as {
            from: `0x${string}`;
            to: `0x${string}`;
            value: bigint;
          };

          // Verify sender is the wallet address
          if (from.toLowerCase() !== walletAddress.toLowerCase()) {
            continue;
          }

          // Verify recipient is merchant wallet
          if (to.toLowerCase() !== MERCHANT_WALLET) {
            continue;
          }

          transferAmount = value;
          validTransfer = true;
          break;
        }
      } catch {
        // Not a Transfer event or couldn't decode
        continue;
      }
    }

    if (!validTransfer) {
      return NextResponse.json(
        { error: "No valid USDC transfer found to merchant wallet" },
        { status: 400 }
      );
    }

    // Verify amount matches plan
    const expectedAmount = PLAN_PRICES[plan as PlanType];
    if (!expectedAmount || transferAmount !== expectedAmount) {
      return NextResponse.json(
        { error: "Transfer amount does not match plan price" },
        { status: 400 }
      );
    }

    // Calculate credits to add
    const creditsToAdd = PLAN_CREDITS[plan as PlanType];

    // Update user credits
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .limit(1);

    if (existingUser.length === 0) {
      // Create user with purchased credits
      await db.insert(users).values({
        walletAddress: walletAddress.toLowerCase(),
        credits: creditsToAdd,
      });
    } else {
      // Update credits
      if (creditsToAdd === -1) {
        // Unlimited plan
        await db
          .update(users)
          .set({ credits: -1 })
          .where(eq(users.walletAddress, walletAddress.toLowerCase()));
      } else {
        // Add credits (unless already unlimited)
        if (existingUser[0].credits !== -1) {
          await db
            .update(users)
            .set({ credits: existingUser[0].credits + creditsToAdd })
            .where(eq(users.walletAddress, walletAddress.toLowerCase()));
        }
      }
    }

    // Record payment
    const amountUsdc = Number(transferAmount) / 1e6;
    await db.insert(payments).values({
      txHash,
      walletAddress: walletAddress.toLowerCase(),
      plan: plan as PlanType,
      amountUsdc: amountUsdc.toFixed(2),
    });

    // Get updated credits
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .limit(1);

    return NextResponse.json({
      success: true,
      credits: updatedUser[0]?.credits ?? creditsToAdd,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
