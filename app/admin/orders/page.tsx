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
      <p className="kicker">Лента</p>
      <h1 className="font-serif mt-1 text-3xl sm:text-4xl">Заказы</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">Уведомления о покупках с контактами гостя</p>

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className={`admin-card block p-4 transition hover:border-[#0b0b0b] ${!order.read ? "border-[#0b0b0b]" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {order.number}
                  {!order.read && (
                    <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-[var(--pomegranate)]">новое</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{order.customer.phone}</p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  {order.customer.city} · {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium">{formatRub(order.total)}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[var(--ink-soft)]">{order.status}</p>
              </div>
            </div>
          </Link>
        ))}
        {orders.length === 0 && (
          <div className="admin-card p-8 text-center text-sm text-[var(--ink-soft)]">Лента пуста</div>
        )}
      </div>
    </div>
  );
}
