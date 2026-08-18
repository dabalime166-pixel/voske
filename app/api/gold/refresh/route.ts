import { NextResponse } from "next/server";
import { fetchLiveGold } from "@/lib/gold";
import { saveGold } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const snapshot = await fetchLiveGold();
    await saveGold(snapshot);
    return NextResponse.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка обновления";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
