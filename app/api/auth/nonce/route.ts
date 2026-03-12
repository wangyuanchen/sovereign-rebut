import { NextResponse } from "next/server";
import { generateNonce } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address is required" },
      { status: 400 }
    );
  }

  const nonce = generateNonce(address);

  return NextResponse.json({ nonce });
}
