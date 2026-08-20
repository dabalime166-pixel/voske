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

  if (!stats) {
    return <p className="text-sm text-[var(--ink-soft)]">Собираем стол…</p>;
  }

  const cards = [
    { label: "Витрина", value: stats.products, href: "/admin/products" },
    { label: "Заказы", value: stats.orders, href: "/admin/orders" },
    { label: "Новые", value: stats.unread, href: "/admin/orders" },
    { label: "Выручка", value: formatRub(stats.revenue), href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Админ</p>
          <h1 className="font-serif mt-1 text-3xl sm:text-4xl">Стол</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ink-soft)]">
            Новые покупки приходят сюда целиком — имя, телефон, адрес и состав корзины.
          </p>
        </div>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary w-full sm:w-auto">
          + Изделие
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-card p-4 transition hover:border-[#0b0b0b] sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">{card.label}</p>
            <p className="font-serif mt-2 text-2xl sm:text-3xl">{card.value}</p>
          </Link>
        ))}
      </div>

      {stats.unread > 0 && (
        <div className="admin-card notice-pulse mt-6 border-[#0b0b0b] bg-white p-4 sm:p-5">
          <p className="text-sm font-medium">{stats.unread} новых уведомлений о покупке</p>
          <Link href="/admin/orders" className="mt-2 inline-block text-sm underline underline-offset-4">
            Открыть ленту заказов
          </Link>
        </div>
      )}

      {stats.lowStock > 0 && (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Мало на складе: {stats.lowStock}{" "}
          <Link href="/admin/products" className="underline underline-offset-4">
            посмотреть витрину
          </Link>
        </p>
      )}

      <div className="mt-10 flex items-end justify-between gap-3">
        <h2 className="font-serif text-2xl">Последние заказы</h2>
        <Link href="/admin/orders" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
          Все
        </Link>
      </div>

      <div className="admin-card mt-4 divide-y divide-[var(--line)]">
        {stats.latestOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex items-start justify-between gap-3 px-4 py-4 hover:bg-[var(--muted)] sm:items-center"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {order.number}
                {!order.read && <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-[var(--pomegranate)]">новое</span>}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {order.customer.firstName} {order.customer.lastName} · {order.customer.phone}
              </p>
              <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{formatDateTime(order.createdAt)}</p>
            </div>
            <span className="shrink-0 text-sm font-medium">{formatRub(order.total)}</span>
          </Link>
        ))}
        {stats.latestOrders.length === 0 && (
          <p className="p-6 text-sm text-[var(--ink-soft)]">Заказов ещё нет — оформите тестовую покупку на витрине.</p>
        )}
      </div>
    </div>
  );
}
