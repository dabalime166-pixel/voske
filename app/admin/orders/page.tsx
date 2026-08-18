"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDateTime, formatRub } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl">Уведомления и заказы</h1>
      <div className="mt-6 divide-y divide-white/10 border border-white/10">
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="block px-5 py-5 hover:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg">
                {order.number}
                {!order.read && <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">новое уведомление</span>}
              </p>
              <span>{formatRub(order.total)}</span>
            </div>
            <p className="mt-1 text-sm text-white/60">
              {order.customer.firstName} {order.customer.lastName} · {order.customer.phone} · {order.customer.city} · {formatDateTime(order.createdAt)}
            </p>
          </Link>
        ))}
        {orders.length === 0 && <p className="p-6 text-white/40">Лента пуста</p>}
      </div>
    </div>
  );
}
