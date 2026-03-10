import { NextResponse } from "next/server";
import { verifyMessage } from "viem";
import { createToken, verifyNonce, setAuthCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
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
