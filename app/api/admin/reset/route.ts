import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { resetCatalog } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const products = await resetCatalog();
  return NextResponse.json({ ok: true, count: products.length });
}
