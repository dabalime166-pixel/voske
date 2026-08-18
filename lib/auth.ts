import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD, ADMIN_SECRET } from "./constants";

const COOKIE = "voske_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function sign(value: string) {
  return createHmac("sha256", ADMIN_SECRET).update(value).digest("hex");
}

export function createAdminToken() {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(password: string) {
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("UNAUTHORIZED");
  }
}

export { COOKIE, MAX_AGE };
