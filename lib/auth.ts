import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { createHmac, randomBytes } from "crypto";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-for-dev");
const HMAC_KEY = process.env.JWT_SECRET || "fallback-secret-for-dev";
const NONCE_TTL_MS = 5 * 60 * 1000;

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
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

function hmac(data: string): string {
  return createHmac("sha256", HMAC_KEY).update(data).digest("hex");
}

/**
 * Stateless nonce: `timestamp.random.hmac(address:timestamp:random)`
 * No server-side storage needed — works across serverless instances.
 */
export function generateNonce(address: string): string {
  const ts = Date.now().toString();
  const rand = randomBytes(16).toString("hex");
  const mac = hmac(`${address.toLowerCase()}:${ts}:${rand}`);
  return `${ts}.${rand}.${mac}`;
}

export function verifyNonce(address: string, nonce: string): boolean {
  const parts = nonce.split(".");
  if (parts.length !== 3) return false;
  const [ts, rand, mac] = parts;

  const elapsed = Date.now() - Number(ts);
  if (isNaN(elapsed) || elapsed < 0 || elapsed > NONCE_TTL_MS) return false;

  const expected = hmac(`${address.toLowerCase()}:${ts}:${rand}`);
  if (mac !== expected) return false;

  return true;
}

// Verify auth from request (for API routes)
export async function verifyAuth(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("auth-token")?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) return payload.walletAddress;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const headerToken = authHeader.slice(7);
    const payload = await verifyToken(headerToken);
    if (payload) return payload.walletAddress;
  }

  return null;
}
