import { NextResponse } from "next/server";
import { getGold } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const gold = await getGold();
  return NextResponse.json({ gold, autoUpdated: false });
}
