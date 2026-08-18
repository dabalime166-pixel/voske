import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getOrders, getProducts, unreadOrdersCount } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const [products, orders, unread] = await Promise.all([
    getProducts(),
    getOrders(),
    unreadOrdersCount(),
  ]);
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  return NextResponse.json({
    products: products.length,
    orders: orders.length,
    unread,
    revenue,
    lowStock: products.filter((p) => p.stockCount <= 3).length,
    latestOrders: orders.slice(0, 8),
  });
}
