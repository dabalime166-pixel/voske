"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDateTime, formatRub } from "@/lib/format";
import type { Order } from "@/lib/types";

type Stats = {
  products: number;
  orders: number;
  unread: number;
  revenue: number;
  lowStock: number;
  latestOrders: Order[];
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Собираем стол...</p>;

  return (
    <div>
      <h1 className="font-serif text-4xl">Стол хозяина</h1>
      <p className="mt-2 text-white/60">Новые заказы приходят сюда целиком — имя, телефон, адрес, состав корзины.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Витрина", stats.products],
          ["Заказы", stats.orders],
          ["Непрочитано", stats.unread],
          ["Выручка", formatRub(stats.revenue)],
        ].map(([label, value]) => (
          <div key={String(label)} className="border border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">{label}</p>
            <p className="font-serif mt-2 text-3xl">{value}</p>
          </div>
        ))}
      </div>
      {stats.unread > 0 && (
        <div className="notice-pulse mt-8 border border-[var(--gold)] bg-[var(--gold)]/10 p-5">
          <p className="uppercase tracking-[0.18em] text-[var(--gold)]">{stats.unread} новых уведомлений о покупке</p>
          <Link href="/admin/orders" className="mt-2 inline-block text-sm underline">
            Открыть ленту заказов
          </Link>
        </div>
      )}
      <h2 className="font-serif mt-12 text-2xl">Последние заказы</h2>
      <div className="mt-4 divide-y divide-white/10 border border-white/10">
        {stats.latestOrders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-4 py-4 hover:bg-white/5">
            <div>
              <p>
                {order.number} · {order.customer.firstName} {order.customer.lastName}
                {!order.read && <span className="ml-2 text-[10px] uppercase text-[var(--gold)]">новое</span>}
              </p>
              <p className="text-sm text-white/50">{formatDateTime(order.createdAt)} · {order.customer.phone}</p>
            </div>
            <span>{formatRub(order.total)}</span>
          </Link>
        ))}
        {stats.latestOrders.length === 0 && <p className="p-6 text-white/40">Заказов ещё нет — оформите тестовую покупку на витрине.</p>}
      </div>
    </div>
  );
}
