import { NextResponse } from "next/server";
import { COOKIE, MAX_AGE, checkPassword, createAdminToken, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: await isAdmin() });
}

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const token = createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
