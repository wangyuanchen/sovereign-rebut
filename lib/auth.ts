import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-for-dev");

export interface JWTPayload {
  walletAddress: string;
  iat: number;
  exp: number;
}

export async function createToken(walletAddress: string): Promise<string> {
  const token = await new SignJWT({ walletAddress })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ walletAddress: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return { walletAddress: payload.walletAddress };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

// Nonce store (in-memory for simplicity, use Redis in production)
const nonceStore = new Map<string, { nonce: string; expires: number }>();

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function storeNonce(address: string, nonce: string) {
  nonceStore.set(address.toLowerCase(), {
    nonce,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
}

export function verifyNonce(address: string, nonce: string): boolean {
  const stored = nonceStore.get(address.toLowerCase());
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    nonceStore.delete(address.toLowerCase());
    return false;
  }
  if (stored.nonce !== nonce) return false;
  nonceStore.delete(address.toLowerCase());
  return true;
}

// Verify auth from request (for API routes)
export async function verifyAuth(request: NextRequest): Promise<string | null> {
  // Try cookie first
  const token = request.cookies.get("auth-token")?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) return payload.walletAddress;
  }

  // Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const headerToken = authHeader.slice(7);
    const payload = await verifyToken(headerToken);
    if (payload) return payload.walletAddress;
  }

  return null;
}
