import { NextResponse } from "next/server";
import { verifyMessage } from "viem";
import { createToken, verifyNonce, setAuthCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function toHexSignature(input: unknown): `0x${string}` | null {
  if (typeof input !== "string") return null;
  const sig = input.trim();
  if (!sig) return null;

  if (/^0x[0-9a-fA-F]+$/.test(sig) && sig.length >= 130) {
    return sig as `0x${string}`;
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
    const hexSig = toHexSignature(signature);
    if (!hexSig) {
      console.error("[Auth] Unsupported signature format:", typeof signature, String(signature).slice(0, 20), "length:", String(signature).length);
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
        signature: hexSig,
      });
    } catch (verifyError) {
      console.error("[Auth] verifyMessage threw:", verifyError);
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
