import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getOrder, updateOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({
      number: order.number,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      items: order.items,
      trackingPhone: order.trackingPhone,
      customer: { firstName: order.customer.firstName },
    });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const { id } = await params;
  const patch = await request.json();
  const order = await updateOrder(id, patch);
  return NextResponse.json(order);
}
