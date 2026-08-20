"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { formatDateTime, formatRub } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "Новый" },
  { id: "confirmed", label: "Подтверждён" },
  { id: "processing", label: "В работе" },
  { id: "shipped", label: "Отправлен" },
  { id: "completed", label: "Выполнен" },
  { id: "cancelled", label: "Отменён" },
];

export default function AdminOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  async function load() {
    const res = await fetch(`/api/orders/${id}`);
    const data = await res.json();
    setOrder(data);
    if (data?.id && !data.read) {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function setStatus(status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrder(await res.json());
  }

  if (!order?.customer) {
    return <p className="text-sm text-[var(--ink-soft)]">Открываем уведомление…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-[var(--ink-soft)] underline underline-offset-4">
        ← К заказам
      </Link>
      <p className="kicker mt-4">Уведомление о покупке</p>
      <h1 className="font-serif mt-1 text-3xl sm:text-4xl">{order.number}</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{formatDateTime(order.createdAt)}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={`tel:${order.customer.phone}`} className="admin-btn admin-btn-primary">
          Позвонить
        </a>
        {order.customer.email && (
          <a href={`mailto:${order.customer.email}`} className="admin-btn admin-btn-ghost">
            Email
          </a>
        )}
        <a href={SITE.telegramUrl} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
          Telegram
        </a>
      </div>

      <section className="admin-card mt-6 p-4 sm:p-6">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">Покупатель</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--ink-soft)]">Имя</dt>
            <dd className="mt-1">
              {order.customer.firstName} {order.customer.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-soft)]">Телефон</dt>
            <dd className="mt-1">
              <a href={`tel:${order.customer.phone}`} className="underline underline-offset-4">
                {order.customer.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-soft)]">Email</dt>
            <dd className="mt-1 break-all">{order.customer.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-soft)]">Страна</dt>
            <dd className="mt-1">{order.customer.country === "armenia" ? "Армения" : "Россия"}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ink-soft)]">Город</dt>
            <dd className="mt-1">{order.customer.city}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-[var(--ink-soft)]">Адрес</dt>
            <dd className="mt-1">{order.customer.address}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-[var(--ink-soft)]">Комментарий</dt>
            <dd className="mt-1">{order.customer.comment || "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="admin-card mt-4 p-4 sm:p-6">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">Состав</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.productId + (item.size || "")} className="flex justify-between gap-4 text-sm">
              <span>
                {item.name}
                <span className="mt-0.5 block text-xs text-[var(--ink-soft)]">
                  {item.sku}
                  {item.size ? ` · ${item.size}` : ""} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 font-medium">{formatRub(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-[var(--line)] pt-4 text-lg font-medium">
          <span>Итого</span>
          <span>{formatRub(order.total)}</span>
        </p>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          Доставка: {order.deliveryMethod} · оплата: {order.paymentMethod}
          <br />
          Отслеживание для гостя: {SITE.trackingPhoneDisplay}
        </p>
      </section>

      <label className="mt-6 block text-sm">
        Статус заказа
        <select
          className="admin-field mt-2"
          value={order.status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
