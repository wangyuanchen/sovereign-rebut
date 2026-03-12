import { NextResponse } from "next/server";
import { verifyMessage } from "viem";
import { createToken, verifyNonce, setAuthCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function normalizeSignature(input: unknown): `0x${string}` | null {
  if (typeof input !== "string") return null;
  const signature = input.trim();
  if (!signature) return null;

  // Already standard 65-byte hex signature: 0x + 130 hex chars.
  if (/^0x[0-9a-fA-F]{130}$/.test(signature)) {
    return signature as `0x${string}`;
  }

  // EIP-2098 compact signature: 0x + 128 hex chars (r + vs).
  if (/^0x[0-9a-fA-F]{128}$/.test(signature)) {
    const rHex = signature.slice(2, 66);
    const vsHex = signature.slice(66);
    const vs = BigInt(`0x${vsHex}`);
    const parityBit = BigInt(255);
    const one = BigInt(1);
    const yParity = Number((vs >> parityBit) & one);
    const s = vs & ((one << parityBit) - one);
    const sHex = s.toString(16).padStart(64, "0");
    const vHex = (27 + yParity).toString(16).padStart(2, "0");
    return `0x${rHex}${sHex}${vHex}` as `0x${string}`;
  }

  // Some providers may send JSON string signature object { r, s, v }.
  if (signature.startsWith("{")) {
    try {
      const parsed = JSON.parse(signature) as {
        r?: string;
        s?: string;
        v?: number | string;
      };
      if (
        parsed?.r &&
        parsed?.s &&
        /^0x[0-9a-fA-F]{64}$/.test(parsed.r) &&
        /^0x[0-9a-fA-F]{64}$/.test(parsed.s)
      ) {
        const rawV =
          typeof parsed.v === "string" ? Number(parsed.v) : parsed.v;
        const normalizedV = rawV === 0 || rawV === 1 ? rawV + 27 : rawV;
        if (normalizedV === 27 || normalizedV === 28) {
          const vHex = normalizedV.toString(16).padStart(2, "0");
          return `0x${parsed.r.slice(2)}${parsed.s.slice(2)}${vHex}` as `0x${string}`;
        }
      }
    } catch {
      // Ignore parse errors and fail below.
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { address, signature, nonce } = await request.json();

    if (!address || !signature || !nonce) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the nonce
    if (!verifyNonce(address, nonce)) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 401 }
      );
    }

    // Verify the signature
    const message = `Welcome to Sovereign Rebut. Nonce: ${nonce}`;
    const normalizedSignature = normalizeSignature(signature);
    if (!normalizedSignature) {
      return NextResponse.json(
        { error: "Unsupported signature format" },
        { status: 400 }
      );
    }

    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: normalizedSignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Check if user exists, create if not (with 3 free credits)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, address.toLowerCase()))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        walletAddress: address.toLowerCase(),
        credits: 3,
      });
    }

    // Create JWT token
    const token = await createToken(address.toLowerCase());

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
