import jwt from "jsonwebtoken";
import type { HandlerEvent } from "@netlify/functions";

// Fail fast if JWT_SECRET is not configured
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is required for admin authentication");
}

const COOKIE_NAME = "admin_token";

export interface JWTPayload {
  role: string;
  sub: string;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  
  return cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
}

export function requireAdmin(event: HandlerEvent): JWTPayload {
  const cookies = parseCookies(event.headers.cookie);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = verifyToken(token);
  
  if (!payload || payload.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return payload;
}

export function createCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "Secure;" : "";
  
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`;
}

export function clearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
