import { NextResponse } from "next/server";
import { verifyMessage, type Hex } from "viem";
import { createToken, verifyNonce, setAuthCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type ViemSignature = Hex | { r: Hex; s: Hex; v: bigint };

function parseWalletSignature(input: unknown): ViemSignature | null {
  if (typeof input !== "string") return null;
  const sig = input.trim();
  if (!sig || !/^0x[0-9a-fA-F]+$/.test(sig)) return null;

  // Standard 65-byte: 0x + 130 hex = 132 chars
  if (sig.length === 132) {
    return sig as Hex;
  }

  // EIP-2098 compact 64-byte: 0x + 128 hex = 130 chars
  if (sig.length === 130) {
    const r = `0x${sig.slice(2, 66)}` as Hex;
    const vsHex = sig.slice(66);
    const vs = BigInt(`0x${vsHex}`);
    const yParity = Number((vs >> BigInt(255)) & BigInt(1));
    const s = vs & ((BigInt(1) << BigInt(255)) - BigInt(1));
    const sHex = s.toString(16).padStart(64, "0");
    return { r, s: `0x${sHex}` as Hex, v: BigInt(27 + yParity) };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { address, signature, nonce } = await request.json();

    if (!address || !signature || !nonce) {
      console.error("[Auth] Missing fields:", { address: !!address, signature: !!signature, nonce: !!nonce });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the nonce
    if (!verifyNonce(address, nonce)) {
      console.error("[Auth] Nonce verification failed for:", address);
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 401 }
      );
    }

    // Verify the signature
    const message = `Welcome to Sovereign Rebut. Nonce: ${nonce}`;
    const parsedSig = parseWalletSignature(signature);
    if (!parsedSig) {
      console.error("[Auth] Unsupported signature:", typeof signature, "len:", String(signature).length);
      return NextResponse.json(
        { error: "Unsupported signature format" },
        { status: 400 }
      );
    }

    let isValid = false;
    try {
      isValid = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: parsedSig,
      });
    } catch (verifyError) {
      console.error("[Auth] verifyMessage threw:", verifyError, "sig len:", String(signature).length);
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Check if user exists, create if not (with 3 free credits)
    const walletAddr = address.toLowerCase();
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddr))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        walletAddress: walletAddr,
        credits: 3,
      });
    }

    // Create JWT token
    const token = await createToken(walletAddr);

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Auth] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
